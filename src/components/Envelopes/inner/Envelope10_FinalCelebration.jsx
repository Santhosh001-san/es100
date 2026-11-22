import React from 'react';
import { motion } from 'framer-motion';
import { UnfoldingLetter } from '../../Letter/UnfoldingLetter';

export const Envelope10_FinalCelebration = ({ envelope, onClose, onLetterRead }) => {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.88, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '740px',
        margin: 'auto 0',
        position: 'relative',
        touchAction: 'pan-y',
        paddingBottom: 'clamp(36px, 5vw, 48px)'
      }}
    >
      {/* Renders the Final Invitation with the Magical Star Clasp & "UNLOCK THE FINAL CELEBRATION" */}
      <UnfoldingLetter
        onClose={onClose}
        onLetterRead={onLetterRead}
      />
    </motion.div>
  );
};
