import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useCardTilt } from "../../hooks/useCardTilt";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, title, onClose }: ImageModalProps) {
  const { elementRef, tiltStyle, glareStyle } = useCardTilt({
    scale: 1.05,
    speed: 300,
    glare: true,
    glareMaxOpacity: 0.25,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          onClick={onClose}
        >
          {/* Fond assombri */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Image avec effet 3D */}
          <motion.div
            ref={elementRef}
            style={tiltStyle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[90vh] rounded-[10px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glare overlay */}
            <div
              style={glareStyle}
              className="absolute inset-0 pointer-events-none z-10"
            />

            {/* Image */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
