import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TimelineConnectorProps {
  index: number;
}

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{
        delay: index * 0.2 + 0.4,
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <div className="flex items-center gap-1">
        {/* Dashed line */}
        <motion.div
          className="w-6 h-[2px]"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 6px, transparent 6px, transparent 12px)',
          }}
        />

        {/* Arrow icon */}
        <motion.div
          animate={{
            x: [0, 4, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowRight className="w-6 h-6 text-[#2AA7A1] stroke-[2.5]" />
        </motion.div>

        {/* Dashed line */}
        <motion.div
          className="w-6 h-[2px]"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 6px, transparent 6px, transparent 12px)',
          }}
        />
      </div>
    </motion.div>
  );
};
