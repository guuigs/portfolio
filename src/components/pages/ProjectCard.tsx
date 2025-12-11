import { useCardTilt } from "../../hooks/useCardTilt";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
  title: string;
  imageUrl?: string;
  link?: string;
  aspectRatio?: "2/3" | "1/1";
}

export function ProjectCard({ title, imageUrl, link, aspectRatio = "2/3" }: ProjectCardProps) {
  const { elementRef, tiltStyle, glareStyle } = useCardTilt({
    scale: 1.07,
    speed: 300,
    glare: true,
    glareMaxOpacity: 0.35,
  });

  const cardContent = (
    <div
      ref={elementRef}
      style={tiltStyle}
      className={cn(
        "w-full bg-primary-blue relative overflow-hidden cursor-pointer rounded-[10px] shadow-[0_1px_5px_#00000099] transition-shadow duration-300 hover:shadow-[0_5px_20px_5px_#00000044]",
        aspectRatio === "1/1" ? "aspect-square" : "aspect-[2/3]"
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
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-primary-blue" />
      )}
    </div>
  );

  return (
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
  );
}
