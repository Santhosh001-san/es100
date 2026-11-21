import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { secretBonusData } from '../../data/letter';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { Trophy3DCanvas } from './Trophy3DCanvas';

export const SecretBonusModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [isTrophyRevealed, setIsTrophyRevealed] = useState(false);

  const triggerTrophyConfetti = (customOriginY = 0.5) => {
    // 1. Initial Grand Burst: Colourful paper confetti & golden stars burst into the air (zIndex: 2000 to display inside/in front of the modal)
    confetti({
      particleCount: 100,
      spread: 100,
      startVelocity: 45,
      gravity: 0.72,
      decay: 0.92,
      ticks: 320,
      origin: { y: customOriginY },
      colors: ['#D4AF37', '#F5DE88', '#8B6FA9', '#C8A2C8', '#FF6B8B', '#60A5FA', '#34D399', '#FFFDF9'],
      shapes: ['square', 'circle'],
      zIndex: 2000
    });

    // Golden stars burst with natural rotation and gentle float
    confetti({
      particleCount: 50,
      spread: 90,
      startVelocity: 40,
      gravity: 0.65,
      decay: 0.94,
      ticks: 350,
      origin: { y: customOriginY },
      colors: ['#FFD700', '#FFE57F', '#D4AF37', '#FFF9E6'],
      shapes: ['star'],
      scalar: 1.25,
      zIndex: 2000
    });

    // 2. Cascading Side Cannons: Lavender pieces and paper strips falling naturally
    setTimeout(() => {
      // Left cannon - lavender and gold paper strips
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        startVelocity: 48,
        gravity: 0.75,
        decay: 0.92,
        ticks: 340,
        origin: { x: 0.12, y: customOriginY + 0.08 },
        colors: ['#8B6FA9', '#C8A2C8', '#D4AF37', '#E6DCF5', '#FF7597'],
        shapes: ['square', 'circle'],
        zIndex: 2000
      });

      // Right cannon - colorful and lavender pieces
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        startVelocity: 48,
        gravity: 0.75,
        decay: 0.92,
        ticks: 340,
        origin: { x: 0.88, y: customOriginY + 0.08 },
        colors: ['#8B6FA9', '#C8A2C8', '#D4AF37', '#E6DCF5', '#60A5FA'],
        shapes: ['square', 'circle'],
        zIndex: 2000
      });

      // Gentle golden stars rain slowly floating down from above
      confetti({
        particleCount: 40,
        spread: 130,
        startVelocity: 25,
        gravity: 0.52,
        decay: 0.95,
        ticks: 400,
        origin: { y: Math.max(0.2, customOriginY - 0.2) },
        colors: ['#FFE89C', '#FFD700', '#F3E5AB', '#FFFDF9'],
        shapes: ['star'],
        scalar: 1.15,
        zIndex: 2000
      });
    }, 240);
  };

  const handleOpen = () => {
    soundManager.playFanfare();
    setIsOpen(true);
    setHasUnlocked(true);
    setIsTrophyRevealed(false);
    triggerTrophyConfetti(0.5);
    setTimeout(() => {
      triggerTrophyConfetti(0.48);
    }, 280);
  };

  const handleClose = () => {
    soundManager.playButtonClick();
    setIsOpen(false);
    setIsTrophyRevealed(false);
  };

  // Support Escape key to close modal
  useEscapeKey(handleClose, isOpen);

  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      {/* Hidden / Subtle Glowing Gift Icon Trigger */}
      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '16px',
          borderRadius: '50px',
          background: 'rgba(255, 253, 249, 0.9)',
          border: '1px dashed rgba(212, 175, 55, 0.6)',
          boxShadow: '0 8px 25px rgba(212, 175, 55, 0.25)',
          animation: 'gentlePulse 3s ease-in-out infinite'
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFF1B0 0%, #D4AF37 60%, #99741B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFDF9',
            boxShadow: '0 4px 15px rgba(153, 116, 27, 0.4)'
          }}
        >
          <Trophy size={26} />
        </div>
        <span
          className="font-cinzel"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#B38B29',
            letterSpacing: '0.12em'
          }}
        >
          {hasUnlocked ? 'VIEW SECRET TROPHY' : 'CLASSIFIED TRANSMISSION: TAP HERE'}
        </span>
      </motion.div>

      {/* Secret Bonus Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20, 10, 30, 0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleClose}
          >
            <AnimatePresence mode="wait">
              {!isTrophyRevealed ? (
                <motion.div
                  key="certificate-card"
                  initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#FFFDF9',
                    borderRadius: '26px',
                    maxWidth: '660px',
                    width: '95%',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    padding: 'clamp(28px, 5vw, 42px) clamp(16px, 4vw, 34px)',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
                    border: '2px solid rgba(212, 175, 55, 0.65)',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  {/* Universal Close Button (pins sticky so it never disappears on scroll) */}
                  <CloseButton onClose={handleClose} variant="gold" isSticky={true} top="14px" right="14px" ariaLabel="Close Secret Trophy Window" />

                  {/* Alert Header */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#FFF4D6',
                      color: '#B38B29',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.14em',
                      fontFamily: "'Cinzel', serif",
                      marginBottom: '10px'
                    }}
                  >
                    <Sparkles size={14} />
                    {secretBonusData.alert}
                    <Sparkles size={14} />
                  </motion.div>

                  <h2
                    className="font-serif-luxury"
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#34224C',
                      marginBottom: '4px',
                      paddingLeft: '30px',
                      paddingRight: '30px'
                    }}
                  >
                    {secretBonusData.subtitle}
                  </h2>

                  <p
                    style={{
                      fontSize: '12.5px',
                      color: '#9E8AA8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '24px'
                    }}
                  >
                    {secretBonusData.awardHeader}
                  </p>

                  {/* 3D Animated Trophy Showcase */}
                  <div
                    style={{
                      position: 'relative',
                      width: '140px',
                      height: '140px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-20px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,225,120,0.6) 0%, rgba(212,175,55,0.2) 50%, transparent 70%)',
                        animation: 'rayRotate 10s linear infinite'
                      }}
                    />

                    <motion.div
                      animate={{
                        rotateY: [0, 15, -15, 0],
                        y: [0, -6, 0]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: 'easeInOut'
                      }}
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, #FFF7D1 0%, #D4AF37 55%, #8C6819 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 35px rgba(212, 175, 55, 0.45)',
                        border: '3px solid #FFFDF9',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      <Trophy size={56} color="#FFFDF9" />
                    </motion.div>
                  </div>

                  {/* Trophy Title */}
                  <h3
                    className="font-cinzel"
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#B38B29',
                      letterSpacing: '0.08em',
                      marginBottom: '10px'
                    }}
                  >
                    {secretBonusData.title}
                  </h3>

                  <div style={{ color: '#D4AF37', fontSize: '13px', marginBottom: '16px', letterSpacing: '0.2em' }}>
                    {secretBonusData.badgeRating}
                  </div>

                  {/* Certificate citation card */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #FAF6EE 0%, #F5ECFA 100%)',
                      borderRadius: '16px',
                      padding: '18px 22px',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      marginBottom: '24px'
                    }}
                  >
                    <p style={{ fontSize: '14.5px', color: '#443555', lineHeight: 1.6, margin: 0 }}>
                      “{secretBonusData.certificateText}”
                    </p>
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '12px',
                        color: '#8A7A9E',
                        fontStyle: 'italic',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}
                    >
                      {secretBonusData.citation}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        soundManager.playFanfare();
                        triggerTrophyConfetti(0.55);
                        setIsTrophyRevealed(true);
                      }}
                      className="btn-gold-luxury"
                    >
                      <Sparkles size={16} />
                      <span>Accept Honor with Pride</span>
                    </button>
                    <button
                      onClick={handleClose}
                      className="btn-lavender-luxury"
                      style={{ fontSize: '13px', padding: '12px 24px' }}
                    >
                      <span>Close Window</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="trophy-3d-reveal"
                  initial={{ scale: 0.88, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: -20 }}
                  transition={{ type: 'spring', damping: 24, stiffness: 240 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'radial-gradient(ellipse at 50% 30%, #251438 0%, #130B1E 60%, #0A0512 100%)',
                    borderRadius: '28px',
                    maxWidth: '640px',
                    width: '95%',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    padding: 'clamp(28px, 5vw, 36px) clamp(14px, 4vw, 20px) 28px',
                    boxShadow: '0 35px 80px rgba(0,0,0,0.7), 0 0 60px rgba(212, 175, 55, 0.25)',
                    border: '2px solid rgba(212, 175, 55, 0.75)',
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  {/* Universal Close Button (pins sticky so it never disappears on scroll) */}
                  <CloseButton onClose={handleClose} variant="gold" isSticky={true} top="14px" right="14px" ariaLabel="Close Secret Trophy Window" />

                  {/* Ceremonial Badge Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 244, 214, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.45)',
                      color: '#F5D061',
                      padding: '5px 18px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      fontFamily: "'Cinzel', serif",
                      marginBottom: '8px'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>HONOUR ACCEPTED • CLASSIFIED CEREMONY</span>
                    <Sparkles size={13} />
                  </motion.div>

                  {/* 3D Realistic Golden Trophy Canvas */}
                  <Trophy3DCanvas />

                  {/* Navigation Buttons */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setIsTrophyRevealed(false)}
                      className="btn-lavender-luxury"
                      style={{
                        fontSize: '12.5px',
                        padding: '9px 20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#D8C7E8',
                        borderColor: 'rgba(212, 175, 55, 0.35)'
                      }}
                    >
                      <span>← View Citation</span>
                    </button>
                    <button
                      onClick={handleClose}
                      className="btn-gold-luxury"
                      style={{ fontSize: '12.5px', padding: '9px 24px' }}
                    >
                      <span>Close Window</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
