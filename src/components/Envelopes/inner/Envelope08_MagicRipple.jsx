import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Waves } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope08_MagicRipple = ({ envelope, onClose }) => {
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [ripples, setRipples] = useState([]);

  // Harmonic ripple points
  const rippleNodes = [
    { id: 'calm', label: 'Harmonic Pulse', color: '#8B6FA9' },
    { id: 'laugh', label: 'Wave of Joy', color: '#D4AF37' },
    { id: 'resilience', label: 'Resilience Tide', color: '#D97D95' }
  ];

  const triggerRippleAt = (x, y, color = '#D4AF37') => {
    soundManager.playStarChime(1.1);
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      color
    };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  const handleContainerClick = (e) => {
    // Prevent firing when user clicks buttons, labels or question cards
    if (e.target.closest('button') || e.target.closest('a')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerRippleAt(x, y, '#D4AF37');
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={handleContainerClick}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #221332 0%, #160B24 60%, #0E0517 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(139, 111, 169, 0.35)',
        border: '2px solid rgba(139, 111, 169, 0.65)',
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
        ariaLabel="Close Envelope 08"
      />

      {/* Expanding Ripple Rings */}
      {ripples.map((rip) => (
        <span
          key={rip.id}
          className="magic-ripple-ring"
          style={{
            position: 'absolute',
            left: `${rip.x}px`,
            top: `${rip.y}px`,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: `2px solid ${rip.color}`,
            boxShadow: `0 0 15px ${rip.color}`,
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'magicRippleWave 1.1s ease-out forwards'
          }}
        />
      ))}

      {/* Ripple Nodes at Top */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '14px', position: 'relative', zIndex: 10 }}>
        {rippleNodes.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const parentRect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
              triggerRippleAt(
                rect.left - parentRect.left + rect.width / 2,
                rect.top - parentRect.top + rect.height / 2,
                node.color
              );
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${node.color}88`,
              background: 'rgba(255, 255, 255, 0.08)',
              color: node.color,
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Waves size={13} />
            <span>{node.label}</span>
          </button>
        ))}
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
          background: 'rgba(139, 111, 169, 0.2)',
          border: '1px solid rgba(139, 111, 169, 0.45)',
          color: '#D8C6ED',
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
        <HelpCircle size={13} />
        <span>ENVELOPE 08 • {envelope.category}</span>
        <HelpCircle size={13} />
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

      {/* Parchment Box with Liquid Cosmic Backing */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: 'clamp(20px, 3.5vw, 26px)',
          border: '1.5px solid rgba(139, 111, 169, 0.35)',
          boxShadow: 'inset 0 0 20px rgba(139, 111, 169, 0.1), 0 8px 30px rgba(0, 0, 0, 0.4)',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 5,
          backdropFilter: 'blur(8px)'
        }}
      >
        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(18px, 2.6vw, 21px)',
            fontStyle: 'italic',
            fontWeight: 500,
            color: '#F4EBFC',
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
              color: '#C6B2DE',
              fontStyle: 'italic',
              marginTop: '14px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(139, 111, 169, 0.35)',
              paddingTop: '10px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Commander Diagnostic Quiz */}
      <div style={{ marginBottom: '22px', textAlign: 'left', position: 'relative', zIndex: 10 }}>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#D8C6ED',
            display: 'block',
            marginBottom: '10px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.08em'
          }}
        >
          COMMANDER DIAGNOSTIC:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {envelope.challengeData.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid rgba(139, 111, 169, 0.3)'
              }}
            >
              <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFDF9', margin: '0 0 10px' }}>
                {item.question}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {item.options.map((opt, oIdx) => {
                  const isChosen = challengeAnswers[item.id] === opt.text;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playButtonClick();
                        setChallengeAnswers((prev) => ({ ...prev, [item.id]: opt.text }));
                      }}
                      style={{
                        fontSize: '11.5px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        border: isChosen
                          ? '1.5px solid #D4AF37'
                          : '1px solid rgba(139, 111, 169, 0.4)',
                        background: isChosen ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
                        color: isChosen ? '#201332' : '#F4EBFC',
                        fontWeight: isChosen ? 700 : 500,
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(challengeAnswers).length === envelope.challengeData.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '14px',
              background: 'linear-gradient(135deg, rgba(132, 94, 194, 0.25) 0%, rgba(212, 175, 55, 0.2) 100%)',
              border: '1.5px solid #D4AF37',
              borderRadius: '14px',
              padding: '14px 18px',
              textAlign: 'center'
            }}
          >
            <strong style={{ fontSize: '13px', color: '#F4D47C', display: 'block', marginBottom: '4px' }}>
              ★ Diagnostic Verified: Grade Commander Estelle
            </strong>
            <span style={{ fontSize: '12.5px', color: '#E9DDF5' }}>
              Diagnosis: 100% Unpredictable, highly resilient, and extraordinarily entertaining company.
            </span>
          </motion.div>
        )}
      </div>

      {/* Tip for Ripples */}
      <div style={{ fontSize: '11px', color: '#D8C6ED', marginBottom: '18px', fontStyle: 'italic', position: 'relative', zIndex: 5 }}>
        ✦ Click anywhere to send expanding golden and violet waves across the surface ✦
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
