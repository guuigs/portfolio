import { useState } from "react";
import { createPortal } from "react-dom";
import { useCardTilt } from "../../hooks/useCardTilt";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
  title: string;
  imageUrl?: string;
  link?: string;
  aspectRatio?: "2/3" | "1/1" | "auto";
}

export function ProjectCard({ title, imageUrl, link, aspectRatio = "2/3" }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { elementRef, tiltStyle, glareStyle } = useCardTilt({
    scale: 1.07,
    speed: 300,
    glare: true,
    glareMaxOpacity: 0.35,
  });

  const { elementRef: modalElementRef, tiltStyle: modalTiltStyle, glareStyle: modalGlareStyle } = useCardTilt({
    scale: 1.05,
    speed: 300,
    glare: true,
    glareMaxOpacity: 0.25,
  });

  const handleCardClick = () => {
    if (aspectRatio === "auto" && imageUrl) {
      setIsModalOpen(true);
    }
  };

  const handleBackdropClick = () => {
    setIsModalOpen(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const cardContent = (
    <div
      ref={elementRef}
      style={tiltStyle}
      onClick={handleCardClick}
      className={cn(
        "w-full bg-primary-blue relative overflow-hidden cursor-pointer rounded-[10px] shadow-[0_1px_5px_#00000099] transition-shadow duration-300 hover:shadow-[0_5px_20px_5px_#00000044]",
        aspectRatio === "1/1" ? "aspect-square" : aspectRatio === "2/3" ? "aspect-[2/3]" : ""
      )}
    >
      {/* Glare overlay */}
      <div
        style={glareStyle}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Image content */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            aspectRatio === "auto" ? "w-full h-auto object-contain" : "absolute inset-0 w-full h-full object-cover object-center"
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-primary-blue" />
      )}
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col gap-[10px]">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {cardContent}
          </a>
        ) : (
          cardContent
        )}
        <p className="font-serif italic text-[20px] leading-[1.2] text-black">
          {title}
        </p>
      </div>

      {/* Modal popup rendered via portal */}
      {isModalOpen && aspectRatio === "auto" && imageUrl && createPortal(
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            ref={modalElementRef}
            style={modalTiltStyle}
            onClick={handleImageClick}
            className="relative max-w-[90vw] max-h-[90vh] rounded-[10px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Glare overlay for modal */}
            <div
              style={modalGlareStyle}
              className="absolute inset-0 pointer-events-none z-10"
            />

            {/* Image */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
