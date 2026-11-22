import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope07_SecretDispatch = ({ envelope, onClose }) => {
  const [stampedList, setStampedList] = useState([]);
  const [animatingStamp, setAnimatingStamp] = useState(null);

  const availableStamps = [
    {
      id: 'approved',
      title: 'APPROVED',
      subtitle: '100 DAYS OF CHAOS',
      color: '#C0392B',
      border: '2px solid #C0392B',
      rot: -5
    },
    {
      id: 'classified',
      title: 'TOP SECRET',
      subtitle: 'COMMANDER EYES ONLY',
      color: '#2980B9',
      border: '2px solid #2980B9',
      rot: 6
    },
    {
      id: 'unplanned',
      title: 'AUTHENTIC',
      subtitle: 'ZERO ROADMAP REQUIRED',
      color: '#B7950B',
      border: '2px dashed #B7950B',
      rot: -3
    }
  ];

  const handleApplyStamp = (stamp) => {
    soundManager.playButtonClick();
    setAnimatingStamp(stamp.id);

    setTimeout(() => {
      setStampedList((prev) => {
        if (prev.find((s) => s.id === stamp.id)) return prev;
        return [...prev, stamp];
      });
      setAnimatingStamp(null);
    }, 400);
  };

  const handleClearStamps = () => {
    soundManager.playButtonClick();
    setStampedList([]);
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'linear-gradient(135deg, #FBF8F1 0%, #F5EFE3 50%, #ECE2D0 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 28px 75px rgba(50, 35, 20, 0.35), 0 0 45px rgba(212, 175, 55, 0.25)',
        border: '2px solid rgba(181, 138, 56, 0.65)',
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
        ariaLabel="Close Envelope 07"
      />

      {/* Top Dossier Classification Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid rgba(181, 138, 56, 0.35)',
          paddingBottom: '10px',
          marginBottom: '16px',
          fontSize: '10px',
          fontFamily: "'Cinzel', serif",
          fontWeight: 800,
          color: '#826217',
          letterSpacing: '0.12em'
        }}
      >
        <span>DISPATCH REF: ES-100-SECRET</span>
        <span>CLEARANCE: LEVEL 5</span>
        <span>CODENAME: ESTELLE</span>
      </div>

      {/* Header Stamp */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(181, 138, 56, 0.14)',
          border: '1px solid rgba(181, 138, 56, 0.45)',
          color: '#826217',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <BookOpen size={13} />
        <span>ENVELOPE 07 • {envelope.category}</span>
        <BookOpen size={13} />
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

      {/* Parchment Dispatch Document (Receives the Stamps) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: '#FFFDF7',
          borderRadius: '18px',
          padding: 'clamp(22px, 3.5vw, 28px)',
          border: '1.5px solid rgba(181, 138, 56, 0.4)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02), 0 8px 24px rgba(74, 53, 104, 0.08)',
          marginBottom: '22px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Rendered Official Stamps on the Paper */}
        {stampedList.map((stamp, idx) => (
          <motion.div
            key={stamp.id}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.88 }}
            style={{
              position: 'absolute',
              top: `${14 + idx * 26}%`,
              right: idx % 2 === 0 ? '16px' : '40px',
              border: stamp.border,
              padding: '6px 14px',
              borderRadius: '8px',
              transform: `rotate(${stamp.rot}deg)`,
              color: stamp.color,
              fontFamily: "'Cinzel', serif",
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: `0 0 10px ${stamp.color}33`,
              background: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em' }}>{stamp.title}</div>
            <div style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em' }}>{stamp.subtitle}</div>
          </motion.div>
        ))}

        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(19px, 2.8vw, 22px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#38254E',
            lineHeight: 1.65,
            margin: 0,
            textAlign: 'left',
            position: 'relative',
            zIndex: 5
          }}
        >
          “{envelope.message}”
        </p>

        {envelope.subtext && (
          <p
            style={{
              fontSize: '13px',
              color: '#826217',
              fontStyle: 'italic',
              marginTop: '16px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(181, 138, 56, 0.35)',
              paddingTop: '12px',
              textAlign: 'left',
              position: 'relative',
              zIndex: 5
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Rubber Stamps Desk */}
      <div style={{ marginBottom: '22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#5C3E78',
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.08em'
            }}
          >
            OFFICIAL COMMANDER STAMP DESK:
          </span>
          {stampedList.length > 0 && (
            <button
              type="button"
              onClick={handleClearStamps}
              style={{
                fontSize: '11px',
                color: '#845EC2',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Clear Stamps
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {availableStamps.map((stamp) => {
            const isPressed = animatingStamp === stamp.id;
            return (
              <motion.button
                key={stamp.id}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApplyStamp(stamp)}
                style={{
                  flex: '1 1 140px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isPressed ? '#FDF5E6' : '#FFFFFF',
                  border: stamp.border,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  animation: isPressed ? 'stampPressDown 0.4s ease-out' : 'none'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, color: stamp.color, letterSpacing: '0.1em' }}>
                  {stamp.title}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#555', marginTop: '2px' }}>
                  {stamp.subtitle}
                </div>
              </motion.button>
            );
          })}
        </div>
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
