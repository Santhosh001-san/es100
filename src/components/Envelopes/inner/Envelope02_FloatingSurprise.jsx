import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope02_FloatingSurprise = ({ envelope, onClose }) => {
  const [activeBubble, setActiveBubble] = useState(null);

  // Floating decorative objects that can be nudged / clicked / bounced
  const floatingObjects = [
    {
      id: 'plane',
      icon: '✈',
      label: 'Paper Glider',
      phrase: 'Direct flight to sudden laughter!',
      color: '#D97D95'
    },
    {
      id: 'laugh',
      icon: '😂',
      label: 'Unhinged Laugh',
      phrase: 'Officially cited for unprovoked giggles!',
      color: '#E29578'
    },
    {
      id: 'sun',
      icon: '☼',
      label: 'Mood Lifter',
      phrase: 'Instantly flips the vibe of any stressful day.',
      color: '#F4A261'
    },
    {
      id: 'spark',
      icon: '✨',
      label: 'Sudden Tangent',
      phrase: 'Zero transition, 100% entertainment value.',
      color: '#845EC2'
    },
    {
      id: 'coffee',
      icon: '☕',
      label: 'Late Night Fuel',
      phrase: 'Fueling theories that make absolutely no sense.',
      color: '#C98E73'
    }
  ];

  const handleObjectClick = (obj) => {
    soundManager.playStarChime(1.2);
    setActiveBubble(activeBubble?.id === obj.id ? null : obj);
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #FFF5F7 0%, #FCE7EC 65%, #F8D7E0 100%)',
        borderRadius: '26px',
        maxWidth: '640px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 28px 75px rgba(217, 125, 149, 0.35), 0 0 45px rgba(255, 230, 240, 0.4)',
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
        ariaLabel="Close Envelope 02"
      />

      {/* Top Header Badge */}
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
          color: '#A84C66',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <Smile size={13} />
        <span>ENVELOPE 02 • {envelope.category}</span>
        <Smile size={13} />
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

      {/* Unfolded Letter Parchment Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF5F7 100%)',
          borderRadius: '20px',
          padding: 'clamp(22px, 3.5vw, 28px)',
          border: '1.5px solid rgba(217, 125, 149, 0.35)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(217, 125, 149, 0.12)',
          marginBottom: '22px',
          position: 'relative'
        }}
      >
        {/* Main Message */}
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

        {envelope.subtext && (
          <p
            style={{
              fontSize: '13px',
              color: '#9C5870',
              fontStyle: 'italic',
              marginTop: '16px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(217, 125, 149, 0.35)',
              paddingTop: '12px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Floating Charms Tray */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#A84C66', letterSpacing: '0.1em', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>
          ✦ TAP OR NUDGE THE FLOATING KEEPSAKES ✦
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {floatingObjects.map((obj, i) => (
            <motion.div
              key={obj.id}
              drag
              dragConstraints={{ top: -15, bottom: 15, left: -15, right: 15 }}
              whileHover={{ scale: 1.25, rotate: 12 }}
              whileTap={{ scale: 0.92, rotate: -12 }}
              onClick={() => handleObjectClick(obj)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.95)',
                border: `1.5px solid ${obj.color}77`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'grab',
                boxShadow: `0 4px 12px ${obj.color}35`,
                animation: `floatingKeepsake ${3.5 + (i % 3) * 0.5}s ease-in-out infinite ${i * 0.4}s`
              }}
            >
              {obj.icon}
            </motion.div>
          ))}
        </div>

        {/* Interactive Speech Bubble When an Object is Tapped */}
        <AnimatePresence>
          {activeBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                marginTop: '14px',
                background: '#FFFFFF',
                border: `1.5px solid ${activeBubble.color}`,
                borderRadius: '16px',
                padding: '12px 18px',
                boxShadow: '0 8px 24px rgba(74, 53, 104, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#34224C'
              }}
            >
              <span style={{ fontSize: '20px' }}>{activeBubble.icon}</span>
              <span>{activeBubble.phrase}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
