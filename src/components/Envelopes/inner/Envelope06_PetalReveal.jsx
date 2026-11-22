import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope06_PetalReveal = ({ envelope, onClose }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [activePetalId, setActivePetalId] = useState(null);
  const [activePetalText, setActivePetalText] = useState(null);

  // 6 Realistic Flower Petals positioned directly below the note
  const interactivePetals = [
    {
      id: 1,
      rot: -14,
      color1: '#FFF0F5',
      color2: '#F9BED0',
      color3: '#E2799A',
      sentiment: 'A Petal of Spontaneous Laughter'
    },
    {
      id: 2,
      rot: 16,
      color1: '#FFF5F8',
      color2: '#F5ABC3',
      color3: '#DA658A',
      sentiment: 'A Whimsical 2:00 AM Tangent'
    },
    {
      id: 3,
      rot: -20,
      color1: '#FFF8FA',
      color2: '#F8B7CB',
      color3: '#E07295',
      sentiment: 'A Gentle Breeze of Good Vibes'
    },
    {
      id: 4,
      rot: 12,
      color1: '#FFF0F4',
      color2: '#F49EB9',
      color3: '#D65780',
      sentiment: 'Zero Logic, 100% Fun'
    },
    {
      id: 5,
      rot: -12,
      color1: '#FFF2F7',
      color2: '#F9B4C9',
      color3: '#DF6C91',
      sentiment: 'Unplanned Moments are the Best'
    },
    {
      id: 6,
      rot: 22,
      color1: '#FFF6F9',
      color2: '#F1A5BE',
      color3: '#CE537B',
      sentiment: 'A Little Burst of Warmth'
    }
  ];

  const handlePetalClick = (petal) => {
    soundManager.playStarChime(1.35);
    if (activePetalId === petal.id) {
      setActivePetalId(null);
      setActivePetalText(null);
    } else {
      setActivePetalId(petal.id);
      setActivePetalText(petal.sentiment);
    }
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
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 28px 75px rgba(217, 125, 149, 0.35), 0 0 50px rgba(255, 215, 230, 0.45)',
        border: '2px solid rgba(217, 125, 149, 0.65)',
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
        ariaLabel="Close Envelope 06"
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

      {/* Letter Parchment (Notes) */}
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
          marginBottom: '20px',
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

      {/* Interactive Petals Garden below the Note */}
      <div
        style={{
          marginBottom: '22px',
          position: 'relative',
          zIndex: 5,
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '18px',
          border: '1.5px solid rgba(217, 125, 149, 0.3)',
          padding: '16px 14px 18px',
          boxShadow: '0 4px 18px rgba(217, 125, 149, 0.12)'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#9E4663',
            letterSpacing: '0.1em',
            fontFamily: "'Cinzel', serif",
            marginBottom: '12px'
          }}
        >
          ✦ TAP DRIFTING FLOWER PETALS FOR LITTLE SENTIMENTS ✦
        </div>

        {/* Petals Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(10px, 3vw, 20px)',
            flexWrap: 'wrap',
            padding: '6px 0'
          }}
        >
          {interactivePetals.map((petal, index) => {
            const isSelected = activePetalId === petal.id;
            return (
              <motion.button
                key={petal.id}
                type="button"
                whileHover={{ scale: 1.25, y: -4 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -4, 0],
                  rotate: [petal.rot, petal.rot + (index % 2 === 0 ? 5 : -5), petal.rot]
                }}
                transition={{
                  y: { repeat: Infinity, duration: 2.6 + (index % 3) * 0.4, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 3.2 + (index % 3) * 0.4, ease: 'easeInOut' }
                }}
                onClick={() => handlePetalClick(petal)}
                aria-label={`Flower Petal ${petal.id}`}
                title="Tap petal!"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: isSelected
                    ? 'drop-shadow(0 0 10px rgba(217, 125, 149, 0.95))'
                    : 'drop-shadow(0 4px 8px rgba(217, 125, 149, 0.28))'
                }}
              >
                <svg
                  width="38"
                  height="50"
                  viewBox="0 0 38 50"
                  fill="none"
                  style={{
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <defs>
                    <linearGradient id={`petal-grad-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={petal.color1} />
                      <stop offset="45%" stopColor={petal.color2} />
                      <stop offset="100%" stopColor={petal.color3} />
                    </linearGradient>
                  </defs>
                  {/* Natural organic curved petal outline */}
                  <path
                    d="M19 2 C29 10 37 24 33 38 C29 46 23 49 19 49 C15 49 9 46 5 38 C1 24 9 10 19 2 Z"
                    fill={`url(#petal-grad-${petal.id})`}
                    stroke={isSelected ? '#9E4663' : 'rgba(217, 125, 149, 0.55)'}
                    strokeWidth={isSelected ? '2' : '1.2'}
                  />
                  {/* Delicate petal vein details */}
                  <path
                    d="M19 10 C19 22 19 34 19 45"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 22 C22 19 26 20 28 22"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 30 C16 27 12 28 10 30"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            );
          })}
        </div>

        {/* Active Petal Sentiment Display right below the petals */}
        <AnimatePresence mode="wait">
          {activePetalText && (
            <motion.div
              key={activePetalText}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: '14px',
                background: '#FFFFFF',
                border: '1.5px solid #D97D95',
                borderRadius: '16px',
                padding: '10px 20px',
                boxShadow: '0 6px 20px rgba(217, 125, 149, 0.22)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#9E4663',
                maxWidth: '92%'
              }}
            >
              <span style={{ fontSize: '15px' }}>🌸</span>
              <span>{activePetalText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Directives */}
      <div style={{ marginBottom: '22px', textAlign: 'left', position: 'relative', zIndex: 5 }}>
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
                  type="button"
                  onClick={() => {
                    soundManager.playButtonClick();
                    setSelectedChoiceId(choice.id);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isSelected
                      ? '1.5px solid #4B6584'
                      : '1px solid rgba(75, 101, 132, 0.25)',
                    background: isSelected
                      ? 'rgba(75, 101, 132, 0.12)'
                      : 'rgba(255, 255, 255, 0.88)',
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
                      padding: '12px 16px',
                      marginTop: '4px',
                      fontSize: '12.5px',
                      color: '#2B3E50',
                      lineHeight: 1.5
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
