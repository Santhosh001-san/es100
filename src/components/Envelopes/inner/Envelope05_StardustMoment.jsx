import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope05_StardustMoment = ({ envelope, onClose }) => {
  const [activeStarId, setActiveStarId] = useState(null);

  // 5 Constellation Stars
  const constellationStars = [
    {
      id: 'serenity',
      name: 'Alpha Serenity',
      spark: 'A peaceful corner where no words need to be forced.',
      color: '#E8D5F5'
    },
    {
      id: 'calm',
      name: 'Beta Sanctuary',
      spark: 'Zero pressure to perform, zero expectations—just quiet ease.',
      color: '#FFF2C4'
    },
    {
      id: 'flow',
      name: 'Gamma Effortless',
      spark: 'Talking to you feels as natural as breathing.',
      color: '#D4AF37'
    },
    {
      id: 'oasis',
      name: 'Delta Comfort',
      spark: 'A steady warm light amidst hurried routines and long days.',
      color: '#FCE7EC'
    },
    {
      id: 'stella',
      name: 'Stella Commander',
      spark: 'Where conversations always leave things a little brighter than they were.',
      color: '#C59B27'
    }
  ];

  const handleStarClick = (e, star) => {
    e.stopPropagation();
    soundManager.playStarChime(1.3);
    setActiveStarId(activeStarId === star.id ? null : star.id);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 22,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#FFFDF9', '#D4AF37', '#845EC2', '#E8D5F5']
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
        background: 'radial-gradient(ellipse at 50% 20%, #201332 0%, #150B22 60%, #0D0616 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 50px rgba(132, 94, 194, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.55)',
        position: 'relative',
        textAlign: 'center',
        color: '#FFFFFF',
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
        ariaLabel="Close Envelope 05"
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
          color: '#F4D47C',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px',
          position: 'relative',
          zIndex: 5
        }}
      >
        <Coffee size={13} />
        <span>ENVELOPE 05 • {envelope.category}</span>
        <Coffee size={13} />
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
          color: '#FFFDF9',
          marginBottom: '18px',
          lineHeight: 1.25,
          position: 'relative',
          zIndex: 5
        }}
      >
        {envelope.title}
      </motion.h3>

      {/* Parchment Box with Elegant Dark Mode Luster */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'rgba(255, 255, 255, 0.07)',
          borderRadius: '20px',
          padding: 'clamp(22px, 3.5vw, 28px)',
          border: '1.5px solid rgba(212, 175, 55, 0.35)',
          boxShadow: 'inset 0 0 25px rgba(212, 175, 55, 0.05), 0 8px 30px rgba(0, 0, 0, 0.4)',
          marginBottom: '22px',
          position: 'relative',
          zIndex: 5,
          backdropFilter: 'blur(10px)'
        }}
      >
        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(19px, 2.8vw, 22px)',
            fontStyle: 'italic',
            fontWeight: 500,
            color: '#F7EDFF',
            lineHeight: 1.65,
            margin: 0,
            textAlign: 'left'
          }}
        >
          “{envelope.message}”
        </p>

        {envelope.subtext && (
          <p
            style={{
              fontSize: '13px',
              color: '#D4C2E8',
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

      {/* Interactive Constellation Star Console */}
      <div style={{ marginBottom: '22px', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>
          ✦ TAP CONSTELLATION STARS TO EXPLORE PEACEFUL REFLECTIONS ✦
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {constellationStars.map((star) => {
            const isActive = activeStarId === star.id;
            return (
              <motion.button
                key={star.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => handleStarClick(e, star)}
                style={{
                  background: isActive
                    ? 'radial-gradient(circle, #FFF4D0 0%, #D4AF37 100%)'
                    : 'rgba(255, 255, 255, 0.12)',
                  border: isActive ? '1.5px solid #FFF' : '1px solid rgba(212, 175, 55, 0.45)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: isActive ? '#34224C' : '#FFF8DB',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? '0 0 16px rgba(255, 235, 160, 0.8)'
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                <span>✦</span>
                <span>{star.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Revealed Star Reflection Card */}
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
                background: 'rgba(28, 16, 44, 0.95)',
                border: '1.5px solid rgba(212, 175, 55, 0.65)',
                borderRadius: '14px',
                padding: '14px 18px',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={14} color="#D4AF37" />
                <strong style={{ fontSize: '12px', color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                  {constellationStars.find((s) => s.id === activeStarId)?.name}
                </strong>
              </div>
              <p style={{ fontSize: '13px', color: '#EAE1F5', lineHeight: 1.55, margin: 0 }}>
                {constellationStars.find((s) => s.id === activeStarId)?.spark}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
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
