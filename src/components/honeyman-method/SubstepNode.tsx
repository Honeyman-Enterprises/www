import React from 'react';
import { motion } from 'framer-motion';

interface SubstepNodeProps {
  substep: string;
  substepNumber: number;
  index: number;
  parentHovered: boolean;
  onClick: (event: React.MouseEvent) => void;
  onSubstepHover: (substepNumber: number | null) => void;
}

export const SubstepNode: React.FC<SubstepNodeProps> = ({
  substep,
  substepNumber,
  index,
  parentHovered,
  onClick,
  onSubstepHover,
}) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Connection line to parent card */}
      <motion.div
        className="w-px bg-gray-300"
        initial={{ height: 0 }}
        animate={{
          height: parentHovered ? '30px' : '20px',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Node circle */}
      <motion.div
        className="relative cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.3 + index * 0.1,
          duration: 0.3,
          type: 'spring',
          stiffness: 200,
        }}
        onHoverStart={() => onSubstepHover(substepNumber)}
        onHoverEnd={() => onSubstepHover(null)}
        onClick={(e) => onClick(e as any)}
      >
        <motion.div
          className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shadow-md"
          whileHover={{
            scale: 1.3,
            borderColor: '#2AA7A1',
            backgroundColor: '#2AA7A1',
            color: '#ffffff',
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Substep ${substepNumber}: ${substep}`}
        >
          {substepNumber}
        </motion.div>
      </motion.div>
    </div>
  );
};
