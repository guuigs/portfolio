import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

/** Sampling grid for the name. Coarse on purpose — the ASCII pass throws
 *  away most of the detail anyway, and every filled cell costs an instance. */
const GRID_W = 96;
const GRID_H = 34;
const LINES = ["GUILHEM", "TERRIER"];

/**
 * Builds the voxel field for the name by rendering it into an offscreen 2D
 * canvas and reading back the filled pixels.
 *
 * three's npm package ships AsciiEffect but not the `typeface.json` fonts, so
 * `TextGeometry` would mean fetching a font at runtime. Rasterising with the
 * browser's own text engine avoids that entirely and keeps the build offline.
 */
interface Sample {
  cells: { x: number; y: number }[];
  /** Extent of the inked pixels, not of the sampling grid. */
  width: number;
  height: number;
}

function sampleName(): Sample {
  const empty: Sample = { cells: [], width: 0, height: 0 };
  const canvas = document.createElement("canvas");
  canvas.width = GRID_W;
  canvas.height = GRID_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return empty;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, GRID_W, GRID_H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = GRID_H / (LINES.length + 0.35);
  const font = (size: number) => `700 ${size}px ui-sans-serif, system-ui, sans-serif`;

  LINES.forEach((line, index) => {
    // Fit each line to the width as well as the height. Sizing on the line
    // height alone left the name occupying two thirds of the grid, which the
    // camera fit then faithfully reproduced as a small name in a big box.
    const cap = lineHeight * 1.12;
    ctx.font = font(cap);
    const measured = ctx.measureText(line).width || 1;
    const size = Math.min(cap, (cap * (GRID_W * 0.95)) / measured);
    ctx.font = font(size);
    ctx.fillText(line, GRID_W / 2, lineHeight * (index + 0.65));
  });

  const { data } = ctx.getImageData(0, 0, GRID_W, GRID_H);
  const cells: { x: number; y: number }[] = [];
  let minX = GRID_W;
  let maxX = 0;
  let minY = GRID_H;
  let maxY = 0;

  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      // Red channel is enough: the canvas is greyscale by construction.
      if (data[(y * GRID_W + x) * 4] <= 110) continue;
      cells.push({ x, y });
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (cells.length === 0) return empty;

  // Re-centre on the ink, so the camera fit measures the name and not the
  // empty margin around it.
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    cells: cells.map((cell) => ({ x: cell.x - cx, y: cy - cell.y })),
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export default function AsciiName() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const { cells, width: inkW, height: inkH } = sampleName();
    if (cells.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scene = new THREE.Scene();
    // Must be opaque black, not transparent: AsciiEffect forces brightness to
    // 1 wherever alpha is 0, so a transparent clear paints the whole frame
    // with the densest character instead of leaving it blank.
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(40, 1, 1, 1000);
    camera.position.set(0, 0, 96);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    // Two opposed key lights: AsciiEffect maps luminance to characters, so
    // the glyph variety comes entirely from this falloff.
    const key = new THREE.PointLight(0xffffff, 2.4, 0, 0);
    key.position.set(60, 60, 80);
    scene.add(key);
    const fill = new THREE.PointLight(0xffffff, 1.1, 0, 0);
    fill.position.set(-70, -40, 40);
    scene.add(fill);

    const geometry = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const material = new THREE.MeshPhongMaterial({ flatShading: true, shininess: 6 });
    const mesh = new THREE.InstancedMesh(geometry, material, cells.length);

    const matrix = new THREE.Matrix4();
    cells.forEach((cell, index) => {
      // Already centred on the ink, with y flipped for scene coordinates.
      matrix.setPosition(cell.x, cell.y, 0);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    // WebGL can be absent (blocked, blacklisted driver, hardened browser).
    // Constructing the renderer is where that surfaces, so guard it and fall
    // back to flat type rather than leaving an empty box in the footer.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      setFailed(true);
      geometry.dispose();
      material.dispose();
      return;
    }
    renderer.setPixelRatio(1);

    const effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true, resolution: 0.19 });
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

      // Scale the name to whatever the container can show, so it is never
      // cropped on a narrow column or lost in the middle of a wide one.
      const visibleH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      const visibleW = visibleH * camera.aspect;
      // Leave room for the depth the rotation swings through, or the edges
      // of the name clip as it turns.
      group.scale.setScalar(Math.min(visibleW / (inkW + 10), visibleH / (inkH + 8)));
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    const start = performance.now();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = (performance.now() - start) / 1000;

      // Oscillate rather than spin: a full rotation spends half its time
      // showing the name backwards, which just reads as noise.
      group.rotation.y = Math.sin(t * 0.55) * 0.62;
      group.rotation.x = Math.sin(t * 0.37) * 0.16;

      effect.render(scene, camera);
    };

    if (reduced.matches) {
      // Still render one frame, so the name is legible without animating.
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
      mesh.dispose();
    };
  }, []);

  if (failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-1">
        {LINES.map((line) => (
          <span
            key={line}
            className="font-mono text-lg font-medium tracking-[0.4em] text-fg-muted sm:text-2xl"
          >
            {line}
          </span>
        ))}
      </div>
    );
  }

  return <div ref={hostRef} className="ascii-stage size-full" />;
}
