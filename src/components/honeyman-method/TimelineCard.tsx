import React from 'react';
import { motion } from 'framer-motion';

interface TimelineCardProps {
  id: string;
  title: string;
  gradient: string;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  hoveredSubstep: number | null;
  hoveredSubstepText: string;
  onClick: (event: React.MouseEvent) => void;
  onHover: (isHovered: boolean) => void;
}

const gradients = {
  'foundation-grad': 'linear-gradient(135deg, #0A1D33 0%, #102B52 100%)',
  'activation-grad': 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
  'evolution-grad': 'linear-gradient(135deg, #8B7355 0%, #D2B48C 100%)',
};

export const TimelineCard: React.FC<TimelineCardProps> = ({
  id: _id,
  title,
  gradient,
  index,
  isActive,
  isHovered,
  hoveredSubstep,
  hoveredSubstepText,
  onClick,
  onHover,
}) => {
  const showSubstep = hoveredSubstep !== null && hoveredSubstepText !== '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="w-[280px] h-[180px] rounded-2xl cursor-pointer overflow-hidden shadow-lg text-white relative"
        style={{
          background: gradients[gradient as keyof typeof gradients],
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => onClick(e)}
        onHoverStart={() => onHover(true)}
        onHoverEnd={() => onHover(false)}
        role="button"
        tabIndex={0}
        aria-label={`${title} phase`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as any);
          }
        }}
      >
        {/* Top section - title area */}
        <motion.div
          className="absolute inset-x-0 top-0 flex flex-col items-center justify-center px-6"
          animate={{
            height: showSubstep ? '66.66%' : '100%',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.h3
            className="text-2xl font-bold uppercase tracking-tight text-center"
            animate={{
              scale: isHovered || isActive ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
        </motion.div>

        {/* Bottom section - substep text (slides up) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[33.33%] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 border-t-2 border-white/50"
          initial={{ y: '100%' }}
          animate={{
            y: showSubstep ? 0 : '100%',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <p className="text-sm text-center font-semibold text-white drop-shadow-lg z-10 relative">
            {hoveredSubstepText}
          </p>
        </motion.div>

        {/* Hover/Active overlay */}
        <motion.div
          className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered || isActive ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-4 border-white/40 rounded-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
