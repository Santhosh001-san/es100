import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope09_MemoryUnlocked = ({ envelope, onClose }) => {
  const [activeTokenDay, setActiveTokenDay] = useState('Day 01');
  const [focusedCardId, setFocusedCardId] = useState(null);

  const handleCardClick = (day) => {
    soundManager.playButtonClick();
    setActiveTokenDay(day);
    setFocusedCardId(focusedCardId === day ? null : day);
  };

  return (
    <motion.div
      initial={{ scale: 0.78, opacity: 0, y: 35, filter: 'blur(6px)' }}
      animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ scale: 0.82, opacity: 0, y: 20, filter: 'blur(4px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #FFFDF5 0%, #FBF3DC 60%, #F5E5C0 100%)',
        borderRadius: '26px',
        maxWidth: '660px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) 28px',
        boxShadow: '0 30px 85px rgba(181, 138, 56, 0.4), 0 0 55px rgba(212, 175, 55, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.75)',
        position: 'relative',
        textAlign: 'center'
      }}
    >
      {/* Universal Close Button */}
      <CloseButton
        onClose={onClose}
        variant="gold"
        isSticky={true}
        top="14px"
        right="14px"
        ariaLabel="Close Envelope 09"
      />

      {/* Header Stamp */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.16)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          color: '#8A691A',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <Clock size={13} />
        <span>ENVELOPE 09 • {envelope.category}</span>
        <Clock size={13} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-serif-luxury"
        style={{
          fontSize: 'clamp(24px, 4vw, 30px)',
          fontWeight: 700,
          color: '#34224C',
          marginBottom: '18px',
          lineHeight: 1.25
        }}
      >
        {envelope.title}
      </motion.h3>

      {/* Letter Parchment */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FAF3E6 100%)',
          borderRadius: '20px',
          padding: 'clamp(20px, 3.5vw, 26px)',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(181, 138, 56, 0.12)',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(18px, 2.6vw, 21px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#38254E',
            lineHeight: 1.6,
            margin: 0,
            textAlign: 'left'
          }}
        >
          “{envelope.message}”
        </p>

        {envelope.subtext && (
          <p
            style={{
              fontSize: '12.5px',
              color: '#846A36',
              fontStyle: 'italic',
              marginTop: '14px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(212, 175, 55, 0.35)',
              paddingTop: '10px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Layered Memory Keepsake Cards */}
      <div style={{ marginBottom: '22px', textAlign: 'left' }}>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#8A691A',
            display: 'block',
            marginBottom: '10px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.08em'
          }}
        >
          TAP ARCHIVAL TOKENS TO BRING FORWARD:
        </span>

        {/* 4 Cards Grid with Depth of Field Focusing */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {envelope.tokens.map((tok) => {
            const isActive = activeTokenDay === tok.day;
            const isAnyFocused = focusedCardId !== null;
            const isUnfocused = isAnyFocused && focusedCardId !== tok.day;

            return (
              <motion.button
                key={tok.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(tok.day)}
                style={{
                  background: isActive ? '#FFF8E6' : '#FFFFFF',
                  border: isActive ? '2px solid #C59B27' : '1px solid rgba(197, 155, 39, 0.35)',
                  borderRadius: '14px',
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? '0 8px 24px rgba(197, 155, 39, 0.35)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: isActive ? 'scale(1.04)' : isUnfocused ? 'scale(0.96)' : 'scale(1)',
                  filter: isUnfocused ? 'blur(1px) opacity(0.65)' : 'blur(0px) opacity(1)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 900,
                    color: '#C59B27',
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    marginBottom: '3px'
                  }}
                >
                  {tok.day}
                </span>
                <strong style={{ fontSize: '11.5px', color: '#38254E', display: 'block', lineHeight: 1.25 }}>
                  {tok.label}
                </strong>
              </motion.button>
            );
          })}
        </div>

        {/* Expanded Summary for Focused Token */}
        {activeTokenDay && (
          <motion.div
            key={activeTokenDay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '14px',
              background: '#FFFDF5',
              border: '1.5px solid rgba(197, 155, 39, 0.55)',
              borderRadius: '14px',
              padding: '14px 18px',
              fontSize: '13px',
              color: '#44321A',
              lineHeight: 1.55,
              boxShadow: '0 8px 20px rgba(197, 155, 39, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#C59B27' }}>
              <Sparkles size={14} />
              <strong style={{ fontSize: '12px', letterSpacing: '0.06em', fontFamily: "'Cinzel', serif" }}>
                ARCHIVED MEMORY • {activeTokenDay}
              </strong>
            </div>
            {envelope.tokens.find((t) => t.day === activeTokenDay)?.summary}
          </motion.div>
        )}
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onClose}
          className="btn-gold-luxury"
          style={{ padding: '10px 26px', fontSize: '12.5px' }}
        >
          <span>Keep Note & Return to Envelopes</span>
        </button>
      </div>
    </motion.div>
  );
};
