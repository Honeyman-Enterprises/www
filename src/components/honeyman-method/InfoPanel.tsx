import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

interface PanelPosition {
  x: number;
  y: number;
}

interface SubstepWithDetails {
  label: string;
  number: number;
  details: string[];
}

interface InfoPanelProps {
  isOpen: boolean;
  title: string;
  description: string;
  substeps: SubstepWithDetails[];
  highlightedSubstep: number | null;
  position: PanelPosition;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  isOpen,
  title,
  description,
  substeps,
  highlightedSubstep,
  position,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed z-50 w-full max-w-md max-h-[70vh] overflow-visible"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto my-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#0B2442] to-[#2AA7A1] px-8 py-6">
                <motion.h3
                  className="text-2xl font-bold text-white uppercase tracking-tight"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h3>

                <motion.p
                  className="text-white/80 mt-2 text-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {description}
                </motion.p>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close info panel"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {substeps.map((substep) => (
                    <motion.div
                      key={substep.number}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Substep heading */}
                      <motion.div
                        className="flex items-center gap-3 mb-3 p-2 rounded-lg"
                        initial={{ backgroundColor: highlightedSubstep === substep.number ? '#2AA7A1' : 'transparent' }}
                        animate={{ backgroundColor: highlightedSubstep === substep.number ? ['#2AA7A1', 'transparent'] : 'transparent' }}
                        transition={{ duration: 0.5, times: [0, 1] }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0B2442] text-white flex items-center justify-center text-xs font-bold">
                          {substep.number}
                        </div>
                        <p className="text-gray-900 text-sm font-semibold uppercase tracking-wide">
                          {substep.label}
                        </p>
                      </motion.div>

                      {/* Substep details with checkmarks */}
                      <div className="ml-9 space-y-2">
                        {substep.details.map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-4 h-4 text-[#2AA7A1]" />
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            {/* Footer with subtle gradient */}
            <div className="h-2 bg-gradient-to-r from-[#2AA7A1] to-[#BE8A2F]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
