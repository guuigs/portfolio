import { useEffect, useRef } from "react";
import imgHomePage from "@/assets/images/home-image.png";
import { Footer } from "../layout/Footer";

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const msg = "CREER ET ETRE HEUREUX ";
    const size = 6; // Taille des carrés (2x2px)
    const circleY = 1;
    const circleX = 1;
    const letterSpacing = 4;
    const diameter = 16;
    const rotation = 0.2;
    const speed = 0.5;

    const msgArray = msg.split('');
    const n = msgArray.length - 1;
    const a = Math.round(size * diameter * 0.20);
    let currStep = 20;
    let ymouse = a * circleY ;
    let xmouse = a * circleX ;
    const y: number[] = [];
    const x: number[] = [];
    const Y: number[] = [];
    const X: number[] = [];

    const outerDiv = document.createElement('div');
    const innerDiv = document.createElement('div');

    // Styles pour le conteneur
    outerDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 50;
      pointer-events: none;
      font-size: ${size}px;
    `;

    innerDiv.style.position = 'relative';

    const handleMouseMove = (e: MouseEvent) => {
      ymouse = e.pageY || e.clientY;
      xmouse = e.pageX || e.clientX;
    };

    const makeCircle = () => {
      outerDiv.style.top = window.scrollY + 'px';
      outerDiv.style.left = window.scrollX + 'px';

      currStep -= rotation;

      for (let i = n; i > -1; --i) {
        const el = document.getElementById('square' + i);
        if (el) {
          el.style.top = Math.round(y[i] + a * Math.sin((currStep + i) / letterSpacing) * circleY - 15) + 'px';
          el.style.left = Math.round(x[i] + a * Math.cos((currStep + i) / letterSpacing) * circleX) + 'px';
        }
      }
    };

    const drag = () => {
      y[0] = Y[0] += (ymouse - Y[0]) * speed;
      x[0] = X[0] += (xmouse - 20 - X[0]) * speed;

      for (let i = n; i > 0; --i) {
        y[i] = Y[i] += (y[i - 1] - Y[i]) * speed;
        x[i] = X[i] += (x[i - 1] - X[i]) * speed;
      }

      makeCircle();
    };

    const init = () => {
      ymouse += window.scrollY;
      xmouse += window.scrollX;

      for (let i = n; i > -1; --i) {
        const square = document.createElement('div');
        square.id = 'square' + i;
        square.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: ${size}px;
          height: ${size}px;
          background-color: #4169E1;
          border-radius: 0px;
        `;
        innerDiv.appendChild(square);
        y[i] = x[i] = Y[i] = X[i] = 0;
      }

      outerDiv.appendChild(innerDiv);
      document.body.appendChild(outerDiv);

      const interval = setInterval(drag, 25);

      return () => {
        clearInterval(interval);
        if (outerDiv.parentNode) {
          document.body.removeChild(outerDiv);
        }
      };
    };

    document.addEventListener('mousemove', handleMouseMove);
    const cleanup = init();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen flex flex-col">
      {/* Main content - starts below header */}
      <div className="flex-1 flex flex-col justify-end items-center pb-[80px] md:pb-[100px] pt-[120px] md:pt-[140px]">
        {/* Title positioned above image */}
        <h1 className="font-serif text-[56px] md:text-[84px] leading-tight text-black text-center mb-[-50px] md:mb-[-100px]">
          Créer et être heureux
        </h1>

        {/* Image */}
        <div className="relative w-full max-w-[800px] md:max-w-[1200px]">
          <img
            src={imgHomePage}
            alt="Home"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Footer - positioned at bottom with z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] bg-transparent pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}