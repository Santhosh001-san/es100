import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope06_PetalReveal = ({ envelope, onClose }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [activePetalText, setActivePetalText] = useState(null);

  // 8 Interactive Floating Petals
  const interactivePetals = [
    { id: 1, top: '10%', left: '8%', size: 24, rot: 15, sentiment: 'A Petal of Spontaneous Laughter' },
    { id: 2, top: '15%', right: '10%', size: 28, rot: -25, sentiment: 'A Whimsical 2:00 AM Tangent' },
    { id: 3, top: '38%', left: '4%', size: 22, rot: 45, sentiment: 'A Gentle Breeze of Good Vibes' },
    { id: 4, top: '45%', right: '5%', size: 26, rot: -10, sentiment: 'Zero Logic, 100% Fun' },
    { id: 5, bottom: '22%', left: '7%', size: 30, rot: 30, sentiment: 'Unplanned Moments are the Best' },
    { id: 6, bottom: '18%', right: '8%', size: 24, rot: -40, sentiment: 'A Little Burst of Warmth' }
  ];

  const handlePetalClick = (petal) => {
    soundManager.playStarChime(1.35);
    setActivePetalText(activePetalText === petal.sentiment ? null : petal.sentiment);
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #FFF5F8 0%, #FBE5EC 65%, #F4D3DE 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) 28px',
        boxShadow: '0 28px 75px rgba(217, 125, 149, 0.35), 0 0 50px rgba(255, 215, 230, 0.45)',
        border: '2px solid rgba(217, 125, 149, 0.65)',
        position: 'relative',
        textAlign: 'center',
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
        ariaLabel="Close Envelope 06"
      />

      {/* Interactive Drifting Petals around the scene */}
      {interactivePetals.map((petal) => (
        <motion.button
          key={petal.id}
          whileHover={{ scale: 1.45, rotate: petal.rot + 30 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => handlePetalClick(petal)}
          title="Tap petal!"
          style={{
            position: 'absolute',
            top: petal.top,
            bottom: petal.bottom,
            left: petal.left,
            right: petal.right,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            borderRadius: '50% 0 50% 50%',
            background: 'linear-gradient(135deg, #FFF0F5 0%, #F5C2D2 60%, #E89EBA 100%)',
            border: '1px solid rgba(217, 125, 149, 0.45)',
            boxShadow: '0 4px 12px rgba(217, 125, 149, 0.35)',
            transform: `rotate(${petal.rot}deg)`,
            cursor: 'pointer',
            zIndex: 10,
            animation: `floatSlow ${4 + (petal.id % 3)}s ease-in-out infinite ${petal.id * 0.4}s`
          }}
        />
      ))}

      {/* Active Petal Toast Banner */}
      <AnimatePresence>
        {activePetalText && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#FFFFFF',
              border: '1.5px solid #D97D95',
              borderRadius: '20px',
              padding: '6px 18px',
              boxShadow: '0 8px 24px rgba(217, 125, 149, 0.25)',
              zIndex: 30,
              fontSize: '12px',
              fontWeight: 700,
              color: '#9E4663',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🌸</span>
            <span>{activePetalText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Stamp */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(217, 125, 149, 0.15)',
          border: '1px solid rgba(217, 125, 149, 0.45)',
          color: '#9E4663',
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
        <Compass size={13} />
        <span>ENVELOPE 06 • {envelope.category}</span>
        <Compass size={13} />
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
          lineHeight: 1.25,
          position: 'relative',
          zIndex: 5
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
          background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF5F7 100%)',
          borderRadius: '20px',
          padding: 'clamp(20px, 3.5vw, 26px)',
          border: '1.5px solid rgba(217, 125, 149, 0.35)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(217, 125, 149, 0.1)',
          marginBottom: '18px',
          position: 'relative',
          zIndex: 5
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
              color: '#8E5A6C',
              fontStyle: 'italic',
              marginTop: '14px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(217, 125, 149, 0.35)',
              paddingTop: '10px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Directives */}
      <div style={{ marginBottom: '20px', textAlign: 'left', position: 'relative', zIndex: 5 }}>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#5C3E78',
            display: 'block',
            marginBottom: '8px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.08em'
          }}
        >
          SELECT NEXT EXPEDITION DIRECTIVE:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {envelope.choicesData.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            return (
              <div key={choice.id}>
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    setSelectedChoiceId(choice.id);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isSelected
                      ? '1.5px solid #4B6584'
                      : '1px solid rgba(75, 101, 132, 0.25)',
                    background: isSelected
                      ? 'rgba(75, 101, 132, 0.12)'
                      : 'rgba(255, 255, 255, 0.85)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', color: '#2C3A4E', display: 'block' }}>
                      {choice.label}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: '#6A7B94' }}>{choice.desc}</span>
                  </div>
                  <Compass size={16} color={isSelected ? '#4B6584' : '#94A3B8'} />
                </button>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      background: '#F0F4F8',
                      borderLeft: '3px solid #4B6584',
                      borderRadius: '0 8px 8px 0',
                      padding: '10px 14px',
                      marginTop: '4px',
                      fontSize: '12.5px',
                      color: '#2B3E50',
                      lineHeight: 1.45
                    }}
                  >
                    ✦ {choice.response}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Prompt */}
      <div style={{ fontSize: '11px', color: '#9E4663', marginBottom: '18px', fontStyle: 'italic', position: 'relative', zIndex: 5 }}>
        ✦ Tap the floating petals drifting across the screen! ✦
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
        <button
          onClick={onClose}
          className="btn-lavender-luxury"
          style={{ padding: '10px 26px', fontSize: '12.5px' }}
        >
          <span>Keep Note & Return to Envelopes</span>
        </button>
      </div>
    </motion.div>
  );
};
