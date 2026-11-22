import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope05_StardustMoment = ({ envelope, onClose }) => {
  const [activeStarId, setActiveStarId] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // 5 Constellation Stars
  const constellationStars = [
    {
      id: 'serenity',
      name: 'Alpha Serenity',
      x: 18,
      y: 18,
      spark: 'A peaceful corner where no words need to be forced.',
      color: '#E8D5F5'
    },
    {
      id: 'calm',
      name: 'Beta Sanctuary',
      x: 78,
      y: 16,
      spark: 'Zero pressure to perform, zero expectations—just quiet ease.',
      color: '#FFF2C4'
    },
    {
      id: 'flow',
      name: 'Gamma Effortless',
      x: 48,
      y: 8,
      spark: 'Talking to you feels as natural as breathing.',
      color: '#D4AF37'
    },
    {
      id: 'oasis',
      name: 'Delta Comfort',
      x: 16,
      y: 78,
      spark: 'A steady warm light amidst hurried routines and long days.',
      color: '#FCE7EC'
    },
    {
      id: 'stella',
      name: 'Stella Commander',
      x: 82,
      y: 80,
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
      particleCount: 20,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#FFFDF9', '#D4AF37', '#845EC2', '#E8D5F5']
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: x * 10, y: y * 10 });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={handleMouseMove}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #201332 0%, #150B22 60%, #0D0616 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) 28px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 50px rgba(132, 94, 194, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.55)',
        position: 'relative',
        textAlign: 'center',
        color: '#FFFFFF',
        overflow: 'hidden'
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

      {/* Interactive Constellation Overlay with Soft Parallax */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        {/* Constellation Connecting SVG Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <line x1="18%" y1="18%" x2="48%" y2="8%" stroke="rgba(212, 175, 55, 0.25)" strokeDasharray="3 3" />
          <line x1="48%" y1="8%" x2="78%" y2="16%" stroke="rgba(212, 175, 55, 0.25)" strokeDasharray="3 3" />
          <line x1="18%" y1="18%" x2="16%" y2="78%" stroke="rgba(212, 175, 55, 0.2)" strokeDasharray="3 3" />
          <line x1="78%" y1="16%" x2="82%" y2="80%" stroke="rgba(212, 175, 55, 0.2)" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Clickable Constellation Stars */}
      {constellationStars.map((star) => {
        const isActive = activeStarId === star.id;
        return (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: `${star.y}%`,
              left: `${star.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 15
            }}
          >
            <motion.button
              whileHover={{ scale: 1.4, rotate: 20 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleStarClick(e, star)}
              title={star.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isActive
                  ? 'radial-gradient(circle, #FFF4D0 0%, #D4AF37 100%)'
                  : 'rgba(255, 255, 255, 0.15)',
                border: isActive ? '1.5px solid #FFF' : '1px solid rgba(212, 175, 55, 0.5)',
                color: isActive ? '#34224C' : '#FFF7D1',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 0 20px rgba(255, 235, 160, 0.95)'
                  : '0 0 10px rgba(212, 175, 55, 0.3)',
                animation: 'constellationStarGlow 3s ease-in-out infinite'
              }}
            >
              ✦
            </motion.button>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: star.x > 50 ? 'auto' : '0',
                  right: star.x > 50 ? '0' : 'auto',
                  background: 'rgba(28, 16, 44, 0.95)',
                  border: '1.5px solid rgba(212, 175, 55, 0.65)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  width: '210px',
                  textAlign: 'left',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  zIndex: 25,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {star.name}
                </div>
                <div style={{ fontSize: '12px', color: '#EAE1F5', lineHeight: 1.45 }}>
                  {star.spark}
                </div>
              </motion.div>
            )}
          </div>
        );
      })}

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
          marginBottom: '20px',
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

      {/* Tip for Constellation */}
      <div style={{ fontSize: '11px', color: '#D4AF37', marginBottom: '18px', fontStyle: 'italic', position: 'relative', zIndex: 5 }}>
        ✦ Tap the glowing constellation stars around the night sky to explore peaceful reflections ✦
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
