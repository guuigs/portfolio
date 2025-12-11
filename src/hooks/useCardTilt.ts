import { useRef, useEffect, useState } from "react";

interface TiltOptions {
  scale?: number;
  speed?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
}

export function useCardTilt(options: TiltOptions = {}) {
  const {
    scale = 1.07,
    speed = 300,
    glare = true,
    glareMaxOpacity = 0.35,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({});
  const boundsRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let updateRAF: number | null = null;

    const rotateToMouse = (e: MouseEvent) => {
      if (!boundsRef.current) return;

      if (updateRAF) {
        cancelAnimationFrame(updateRAF);
      }

      updateRAF = requestAnimationFrame(() => {
        const bounds = boundsRef.current!;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;

        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2,
        };

        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        // Use the exact formula from the CodePen
        setTiltStyle({
          transform: `
            scale3d(${scale}, ${scale}, ${scale})
            rotate3d(
              ${center.y / 100},
              ${-center.x / 100},
              0,
              ${Math.log(distance) * 2}deg
            )
          `,
          transition: "none",
        });

        if (glare) {
          // Calculate glare position - centered on mouse with doubled offset
          const glareX = center.x * 2 + bounds.width / 2;
          const glareY = center.y * 2 + bounds.height / 2;

          setGlareStyle({
            backgroundImage: `
              radial-gradient(
                circle at ${glareX}px ${glareY}px,
                rgba(255, 255, 255, ${glareMaxOpacity}),
                rgba(0, 0, 0, 0.06)
              )
            `,
          });
        }
      });
    };

    const handleMouseEnter = () => {
      boundsRef.current = element.getBoundingClientRect();
      document.addEventListener("mousemove", rotateToMouse);
    };

    const handleMouseLeave = () => {
      document.removeEventListener("mousemove", rotateToMouse);
      if (updateRAF) {
        cancelAnimationFrame(updateRAF);
      }

      setTiltStyle({
        transform: "",
        transition: `transform ${speed}ms ease-out`,
      });

      if (glare) {
        setGlareStyle({
          backgroundImage: "",
        });
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousemove", rotateToMouse);
      if (updateRAF) {
        cancelAnimationFrame(updateRAF);
      }
    };
  }, [scale, speed, glare, glareMaxOpacity]);

  return { elementRef, tiltStyle, glareStyle };
}
