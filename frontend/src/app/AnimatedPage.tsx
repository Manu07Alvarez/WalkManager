import React from 'react';
import { motion } from 'motion/react';

interface AnimatedPageProps {
  children: React.ReactNode;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.995 }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1], // Spring cubic-bezier ease-out curve
      }}
      className="w-full min-h-full"
    >
      {children}
    </motion.div>
  );
};
