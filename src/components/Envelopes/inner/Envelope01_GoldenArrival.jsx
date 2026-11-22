import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope01_GoldenArrival = ({ envelope, onClose }) => {
  const [activeStarId, setActiveStarId] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const interactiveStars = [
    {
      id: 1,
      top: '12%',
      left: '8%',
      char: '✦',
      label: 'The First Message',
      note: 'Day 1: An innocent, ordinary chat that had no idea it would last 100 days.'
    },
    {
      id: 2,
      top: '14%',
      right: '10%',
      char: '★',
      label: 'Zero Script',
      note: 'No roadmap, no expectations—just two people who immediately found an effortless rhythm.'
    },
    {
      id: 3,
      bottom: '18%',
      left: '6%',
      char: '✨',
      label: 'Growing Flow',
      note: 'Somewhere between ordinary pings, talking to you quietly became the highlight of every day.'
    },
    {
      id: 4,
      bottom: '16%',
      right: '8%',
      char: '✦',
      label: 'The Golden Thread',
      note: 'A hundred days connected by genuine warmth, shared laughter, and zero drama.'
    }
  ];

  const handleStarClick = (e, star) => {
    e.stopPropagation();
    soundManager.playStarChime(1.15);
    setActiveStarId(activeStarId === star.id ? null : star.id);

    // Micro sparkle burst at the star's coordinate
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 22,
      spread: 45,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#D4AF37', '#FFF3C4', '#F5DC93', '#FFFFFF']
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 25 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #FFFDF7 0%, #F8F1E2 70%, #F1E5CD 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(30px, 4.5vw, 40px) clamp(18px, 4vw, 32px) 30px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 50px rgba(212, 175, 55, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.75)',
        position: 'relative',
        textAlign: 'center',
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease-out'
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

      {/* Floating Interactive Stars Around the Scene */}
      {interactiveStars.map((star) => {
        const isActive = activeStarId === star.id;
        return (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: star.top,
              bottom: star.bottom,
              left: star.left,
              right: star.right,
              zIndex: 10
            }}
          >
            <motion.button
              whileHover={{ scale: 1.35, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleStarClick(e, star)}
              title={star.label}
              style={{
                background: isActive
                  ? 'radial-gradient(circle, #FFECA8 0%, #D4AF37 100%)'
                  : 'rgba(255, 253, 245, 0.85)',
                border: isActive ? '1.5px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                color: isActive ? '#34224C' : '#96741F',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 0 16px rgba(212, 175, 55, 0.8)'
                  : '0 4px 10px rgba(181, 138, 56, 0.18)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {star.char}
            </motion.button>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: star.left ? '0' : 'auto',
                  right: star.right ? '0' : 'auto',
                  background: '#FFFDF5',
                  border: '1.5px solid #D4AF37',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  width: '210px',
                  textAlign: 'left',
                  boxShadow: '0 10px 25px rgba(74, 53, 104, 0.25)',
                  zIndex: 20
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#96741F', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {star.label}
                </div>
                <div style={{ fontSize: '12px', color: '#44321A', lineHeight: 1.45 }}>
                  {star.note}
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

      {/* Tip for Interactive Stars */}
      <div style={{ fontSize: '11px', color: '#876516', marginBottom: '18px', fontStyle: 'italic' }}>
        ✦ Tap the golden stars around the letter to uncover little memory fragments ✦
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
