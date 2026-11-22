import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope01_GoldenArrival = ({ envelope, onClose }) => {
  const [activeStarId, setActiveStarId] = useState(null);

  const interactiveStars = [
    {
      id: 1,
      char: '✦',
      label: 'The First Message',
      note: 'Day 1: An innocent, ordinary chat that had no idea it would last 100 days.'
    },
    {
      id: 2,
      char: '★',
      label: 'Zero Script',
      note: 'No roadmap, no expectations—just two people who immediately found an effortless rhythm.'
    },
    {
      id: 3,
      char: '✨',
      label: 'Growing Flow',
      note: 'Somewhere between ordinary pings, talking to you quietly became the highlight of every day.'
    },
    {
      id: 4,
      char: '✦',
      label: 'The Golden Thread',
      note: 'A hundred days connected by genuine warmth, shared laughter, and zero drama.'
    }
  ];

  const handleStarClick = (e, star) => {
    e.stopPropagation();
    soundManager.playStarChime(1.15);
    setActiveStarId(activeStarId === star.id ? null : star.id);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 24,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#D4AF37', '#FFF3C4', '#F5DC93', '#FFFFFF']
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #FFFDF7 0%, #F8F1E2 70%, #F1E5CD 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 40px) clamp(18px, 4vw, 32px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 50px rgba(212, 175, 55, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.75)',
        position: 'relative',
        textAlign: 'center',
        touchAction: 'pan-y'
      }}
    >
      {/* Universal Close Button */}
      <CloseButton
        onClose={onClose}
        variant="gold"
        isSticky={true}
        top="14px"
        right="14px"
        ariaLabel="Close Envelope 01"
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
          background: 'rgba(212, 175, 55, 0.14)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          color: '#876516',
          padding: '5px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.14em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <Sparkles size={13} />
        <span>ENVELOPE 01 • {envelope.category}</span>
        <Sparkles size={13} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-serif-luxury"
        style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: 700,
          color: '#34224C',
          marginBottom: '20px',
          lineHeight: 1.25
        }}
      >
        {envelope.title}
      </motion.h3>

      {/* Floating Parchment with Dynamic Light Border */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #FFFCF7 0%, #F9F3E8 100%)',
          borderRadius: '20px',
          padding: 'clamp(22px, 3.5vw, 28px)',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(74, 53, 104, 0.08)',
          marginBottom: '22px',
          position: 'relative'
        }}
      >
        {/* Main Cormorant Message */}
        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(19px, 2.8vw, 22px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#38254E',
            lineHeight: 1.65,
            margin: 0,
            textAlign: 'left'
          }}
        >
          “{envelope.message}”
        </p>

        {/* Subtext Footnote */}
        {envelope.subtext && (
          <p
            style={{
              fontSize: '13px',
              color: '#846D47',
              fontStyle: 'italic',
              marginTop: '16px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(212, 175, 55, 0.35)',
              paddingTop: '12px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Golden Stars Console / Tray */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#876516', letterSpacing: '0.1em', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>
          ✦ TAP GOLDEN STARS TO REVEAL MILESTONE MEMORIES ✦
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {interactiveStars.map((star) => {
            const isActive = activeStarId === star.id;
            return (
              <motion.button
                key={star.id}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handleStarClick(e, star)}
                style={{
                  background: isActive
                    ? 'radial-gradient(circle, #FFF4D0 0%, #D4AF37 100%)'
                    : 'rgba(255, 253, 245, 0.92)',
                  border: isActive ? '1.5px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.45)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: isActive ? '#34224C' : '#876516',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? '0 4px 15px rgba(212, 175, 55, 0.6)'
                    : '0 2px 8px rgba(181, 138, 56, 0.15)',
                  transition: 'all 0.25s ease'
                }}
              >
                <span>{star.char}</span>
                <span>{star.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Revealed Star Milestone Card */}
        <AnimatePresence>
          {activeStarId && (
            <motion.div
              key={activeStarId}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: '14px',
                background: '#FFFDF5',
                border: '1.5px solid #D4AF37',
                borderRadius: '14px',
                padding: '14px 18px',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(74, 53, 104, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={14} color="#D4AF37" />
                <strong style={{ fontSize: '12px', color: '#876516', fontFamily: "'Cinzel', serif" }}>
                  {interactiveStars.find((s) => s.id === activeStarId)?.label}
                </strong>
              </div>
              <p style={{ fontSize: '13px', color: '#44321A', lineHeight: 1.55, margin: 0 }}>
                {interactiveStars.find((s) => s.id === activeStarId)?.note}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button: Return to collection */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onClose}
          className="btn-gold-luxury"
          style={{ padding: '11px 28px', fontSize: '13px' }}
        >
          <span>Keep Note & Return to Envelopes</span>
        </button>
      </div>
    </motion.div>
  );
};
