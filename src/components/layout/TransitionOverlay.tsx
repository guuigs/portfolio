import { motion, AnimatePresence } from "motion/react";

interface TransitionOverlayProps {
  isVisible: boolean;
  onCovered: () => void; // Called when bands fully cover the screen
}

export function TransitionOverlay({ isVisible, onCovered }: TransitionOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
           className="fixed inset-0 z-[100] flex flex-col pointer-events-none"
           initial="hidden"
           animate="visible"
           exit="exit"
        >
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="relative w-full h-[25vh] bg-white"
              variants={{
                hidden: { x: "-100%" },
                visible: { x: "0%" },
                exit: { x: "100%" }
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1, // Stagger effect
              }}
              onAnimationComplete={(definition) => {
                // Trigger onCovered only when the LAST band finishes entering
                if (definition === "visible" && index === 3) {
                  onCovered();
                }
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
