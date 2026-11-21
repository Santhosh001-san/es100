import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audioSynth';

export const GiftBox3D = ({ onUnwrapComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleUnwrap = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    // 1. Play Ribbon Untie sound
    soundManager.playRibbonUntie();

    // 2. Untie ribbon & open lid after 600ms
    setTimeout(() => {
      soundManager.playGiftOpen();
      setIsOpened(true);

      // 3. Fire celebratory confetti
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#8B6FA9', '#F8D7E3', '#FFFDF9', '#E6DCF5']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.2, y: 0.55 },
          colors: ['#D4AF37', '#9D84B7', '#F5C6D8']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.8, y: 0.55 },
          colors: ['#D4AF37', '#9D84B7', '#F5C6D8']
        });
      }, 300);

      // 4. Smooth transition to next chapter
      setTimeout(() => {
        if (onUnwrapComplete) {
          onUnwrapComplete();
        }
      }, 1600);
    }, 650);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* 3D Gift Box Container */}
      <div className="gift-scene">
        {/* Soft shadow on the ground */}
        <div className="box-shadow-ground" />

        <div
          className="gift-box-3d"
          style={{
            transform: isOpened
              ? 'rotateX(4deg) rotateY(0deg) scale(1.04)'
              : 'rotateX(-14deg) rotateY(18deg)'
          }}
        >
          {/* Golden Light Beam emitted from inside when opened */}
          <AnimatePresence>
            {isOpened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="golden-light-beam"
              />
            )}
          </AnimatePresence>

          {/* Box Bottom Face */}
          <div className="box-face box-bottom" />

          {/* Box Body Faces */}
          <div className="box-face box-front">
            {/* Front vertical ribbon */}
            <motion.div
              animate={isOpening ? { opacity: 0, scaleY: 0 } : { opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.45 }}
              className="ribbon-vert"
            />
            {/* Front horizontal ribbon */}
            <motion.div
              animate={isOpening ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.45 }}
              className="ribbon-horiz"
            />
            {/* Embossed delicate gold border */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                border: '1px dashed rgba(243, 229, 171, 0.4)',
                borderRadius: '6px',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div className="box-face box-back">
            <div className="ribbon-vert" />
            <div className="ribbon-horiz" />
          </div>

          <div className="box-face box-left">
            <div className="ribbon-vert" />
            <div className="ribbon-horiz" />
          </div>

          <div className="box-face box-right">
            <div className="ribbon-vert" />
            <div className="ribbon-horiz" />
          </div>

          {/* Box Lid (with 3D lift & backward tilt animation) */}
          <div className={`box-lid-3d ${isOpened ? 'open' : ''}`}>
            <div className="lid-surface">
              {/* Lid Ribbon Cross */}
              <motion.div
                animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div className="ribbon-vert" style={{ width: '40px' }} />
                <div className="ribbon-horiz" style={{ height: '40px' }} />

                {/* 3D Golden Bow */}
                <div className="bow-container">
                  <div className="bow-knot" />
                  <div className="bow-wing-left" />
                  <div className="bow-wing-right" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Delivery Tag tied to box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        style={{
          marginTop: '16px',
          background: 'rgba(255, 253, 249, 0.96)',
          borderRadius: '16px',
          padding: '14px 22px',
          boxShadow: '0 8px 24px rgba(74, 53, 104, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          maxWidth: '380px',
          width: '92%',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <span
          className="font-cinzel"
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#D4AF37',
            display: 'block',
            marginBottom: '3px'
          }}
        >
          SPECIAL DELIVERY!
        </span>

        <h3
          className="font-serif-luxury"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#3B2A52',
            margin: '2px 0 4px'
          }}
        >
          To: Commander Estelle
        </h3>

        <p
          style={{
            fontSize: '12px',
            color: '#706085',
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          From: <strong style={{ color: '#523770' }}>Yours Lovingly, Silly Goose</strong>
        </p>

        <div
          style={{
            marginTop: '6px',
            paddingTop: '6px',
            borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
            fontSize: '11.5px',
            fontStyle: 'italic',
            color: '#8A7A9E'
          }}
        >
          “Your 100-day surprise has arrived!”
        </div>
      </motion.div>

      {/* Main Interactive Button: UNWRAP YOUR SURPRISE */}
      <motion.button
        onClick={handleUnwrap}
        disabled={isOpening || isOpened}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="btn-gold-luxury"
        style={{
          marginTop: '20px',
          fontSize: '14px',
          padding: '14px 38px',
          cursor: isOpening || isOpened ? 'default' : 'pointer'
        }}
      >
        <Sparkles size={17} color="#7A5600" />
        {isOpened
          ? 'SURPRISE REVEALED!'
          : isOpening
          ? 'UNWRAPPING...'
          : 'UNWRAP YOUR SURPRISE'}
      </motion.button>
    </div>
  );
};
