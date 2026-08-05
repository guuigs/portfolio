import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

const TEX_W = 512;
const TEX_H = 256;

/** Deterministic PRNG, so the same landmasses come back on every load. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Value noise on a coarse lattice, bilinearly interpolated.
 *
 * The lattice wraps on x so the equirectangular texture has no visible seam
 * where the map meets itself behind the globe.
 */
function noiseLayer(cols: number, rows: number, random: () => number) {
  const grid = Array.from({ length: cols * rows }, () => random());
  const at = (x: number, y: number) =>
    grid[((y + rows) % rows) * cols + ((x + cols) % cols)];

  return (u: number, v: number) => {
    const fx = u * cols;
    const fy = v * rows;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    // Smoothstep the interpolation, otherwise the lattice shows as diamonds.
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);

    const top = at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx;
    const bottom = at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx;
    return top * (1 - sy) + bottom * sy;
  };
}

/**
 * Paints an equirectangular land/sea map.
 *
 * Procedural rather than a shipped image: a real Earth texture would be
 * hundreds of kilobytes for something the ASCII pass reduces to a dozen
 * brightness levels anyway.
 */
function buildSurface(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;

  const random = mulberry32(20260805);
  const octaves = [
    { noise: noiseLayer(8, 5, random), weight: 0.6 },
    { noise: noiseLayer(17, 9, random), weight: 0.28 },
    { noise: noiseLayer(33, 17, random), weight: 0.12 },
  ];

  const image = ctx.createImageData(TEX_W, TEX_H);

  for (let y = 0; y < TEX_H; y += 1) {
    const v = y / TEX_H;
    // Pull the value down towards the poles so land doesn't ring the caps,
    // where the equirectangular projection smears it into a solid band.
    const polar = 1 - Math.abs(v - 0.5) * 2;
    const capBias = Math.min(polar * 2.4, 1);

    for (let x = 0; x < TEX_W; x += 1) {
      let value = 0;
      for (const { noise, weight } of octaves) value += noise(x / TEX_W, v) * weight;
      value *= 0.45 + 0.55 * capBias;

      const land = value > 0.52;
      // Coastlines get an intermediate tone, so the ASCII ramp has something
      // between "ocean" and "continent" to work with. The gap between the
      // three levels has to be wide: the shading multiplies on top of it, and
      // a subtle texture would vanish under the terminator.
      const shore = !land && value > 0.48;
      // The ocean is never fully black: it has to keep drawing a faint glyph,
      // otherwise the disc dissolves at the limb wherever water meets the edge
      // and the planet stops reading as a sphere.
      const level = land ? 225 + Math.min((value - 0.52) * 300, 30) : shore ? 115 : 58;

      const at = (y * TEX_W + x) * 4;
      image.data[at] = level;
      image.data[at + 1] = level;
      image.data[at + 2] = level;
      image.data[at + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function AsciiPlanet() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scene = new THREE.Scene();
    // Opaque black: AsciiEffect forces brightness to 1 wherever alpha is 0, so
    // a transparent clear would paint the whole frame with the densest glyph.
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    // Mostly ambient, with a soft key. The terminator still rounds the globe,
    // but the land/sea contrast has to survive it — a hard key washed the
    // continents out entirely and left a plain shaded ball.
    scene.add(new THREE.AmbientLight(0xffffff, 0.78));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(2.4, 1.1, 3.2);
    scene.add(key);

    const surface = buildSurface();
    const geometry = new THREE.SphereGeometry(1.6, 64, 48);
    const material = new THREE.MeshPhongMaterial({ map: surface, shininess: 2 });
    const planet = new THREE.Mesh(geometry, material);
    // A slight axial tilt reads as a planet rather than a spinning ball.
    planet.rotation.z = 0.24;
    scene.add(planet);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      setFailed(true);
      geometry.dispose();
      material.dispose();
      surface.dispose();
      return;
    }
    renderer.setPixelRatio(1);

    const effect = new AsciiEffect(renderer, " .:-=+*#%@", { invert: true, resolution: 0.21 });
    effect.domElement.style.color = "inherit";
    effect.domElement.style.backgroundColor = "transparent";
    effect.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(effect.domElement);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      effect.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    let last = 0;

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      // 15fps: the character grid is coarse enough that a faster refresh only
      // costs battery without reading as smoother.
      if (time - last < 1000 / 15) return;
      last = time;

      planet.rotation.y = (time / 1000) * 0.22;
      effect.render(scene, camera);
    };

    if (reduced.matches) {
      effect.render(scene, camera);
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      effect.domElement.remove();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      surface.dispose();
    };
  }, []);

  if (failed) {
    return (
      <div className="flex size-full items-center justify-center">
        <span aria-hidden="true" className="font-mono text-6xl opacity-80">
          ◍
        </span>
      </div>
    );
  }

  return <div ref={hostRef} className="ascii-stage size-full" />;
}
