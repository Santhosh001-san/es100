import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope03_LightWithin = ({ envelope, onClose }) => {
  const [lightPos, setLightPos] = useState({ x: 250, y: 180 });
  const [revealedNodeId, setRevealedNodeId] = useState(null);

  const lightNodes = [
    {
      id: 'drama',
      label: 'The Drama Core',
      icon: '✦',
      surprise: 'Doubling down on a ridiculous argument purely for the theatrical entertainment value.'
    },
    {
      id: 'tangents',
      label: 'The Tangent Flare',
      icon: '☼',
      surprise: 'Switching from serious topics to completely unhinged theories with zero warning.'
    },
    {
      id: 'rhythm',
      label: 'The Quiet Rhythm',
      icon: '❦',
      surprise: 'A shared natural frequency where even a single word says an entire paragraph.'
    },
    {
      id: 'quirks',
      label: 'The Small Habits',
      icon: '✨',
      surprise: 'The little quirks that make 100 days feel like they passed in 10 minutes.'
    }
  ];

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleNodeClick = (node) => {
    soundManager.playStarChime(1.25);
    setRevealedNodeId(revealedNodeId === node.id ? null : node.id);
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      onPointerMove={handlePointerMove}
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #FFFDF5 0%, #F8F1DE 65%, #EFE1C5 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 28px 75px rgba(181, 138, 56, 0.35), 0 0 45px rgba(255, 235, 170, 0.45)',
        border: '2px solid rgba(181, 138, 56, 0.65)',
        position: 'relative',
        textAlign: 'center',
        touchAction: 'pan-y'
      }}
    >
      {/* Interactive Light Beam that follows pointer / touch */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 240px at ${lightPos.x}px ${lightPos.y}px, rgba(255, 245, 200, 0.45) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 75%)`,
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'background 0.08s ease-out',
          borderRadius: '24px'
        }}
      />

      {/* Universal Close Button */}
      <CloseButton
        onClose={onClose}
        variant="gold"
        isSticky={true}
        top="14px"
        right="14px"
        ariaLabel="Close Envelope 03"
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
          background: 'rgba(181, 138, 56, 0.14)',
          border: '1px solid rgba(181, 138, 56, 0.45)',
          color: '#826217',
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
        <Bookmark size={13} />
        <span>ENVELOPE 03 • {envelope.category}</span>
        <Bookmark size={13} />
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

      {/* Illuminated Letter Parchment */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #FFFDF7 0%, #F9F3E8 100%)',
          borderRadius: '20px',
          padding: 'clamp(22px, 3.5vw, 28px)',
          border: '1.5px solid rgba(181, 138, 56, 0.4)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(181, 138, 56, 0.12)',
          marginBottom: '22px',
          position: 'relative',
          zIndex: 5
        }}
      >
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
              color: '#7D632E',
              fontStyle: 'italic',
              marginTop: '16px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(181, 138, 56, 0.35)',
              paddingTop: '12px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Interactive Light Nodes Tray */}
      <div style={{ marginBottom: '22px', position: 'relative', zIndex: 5 }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#826217', letterSpacing: '0.1em', fontFamily: "'Cinzel', serif", marginBottom: '10px' }}>
          ✦ TAP GLOWING LIGHT PRISMS TO UNCOVER QUIET DETAILS ✦
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {lightNodes.map((node) => {
            const isRevealed = revealedNodeId === node.id;
            return (
              <motion.button
                key={node.id}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleNodeClick(node)}
                style={{
                  background: isRevealed
                    ? 'radial-gradient(circle, #FFF4D0 0%, #D4AF37 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                  border: isRevealed
                    ? '1.5px solid #D4AF37'
                    : '1px solid rgba(181, 138, 56, 0.45)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: isRevealed ? '#34224C' : '#826217',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isRevealed
                    ? '0 4px 15px rgba(212, 175, 55, 0.6)'
                    : '0 2px 8px rgba(181, 138, 56, 0.15)'
                }}
              >
                <span>{node.icon}</span>
                <span>{node.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Revealed Observation Card */}
        <AnimatePresence>
          {revealedNodeId && (
            <motion.div
              key={revealedNodeId}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: '14px',
                background: '#FFFDF5',
                border: '1.5px solid #D4AF37',
                borderRadius: '14px',
                padding: '14px 18px',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(74, 53, 104, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={14} color="#D4AF37" />
                <strong style={{ fontSize: '12px', color: '#826217', fontFamily: "'Cinzel', serif" }}>
                  {lightNodes.find((n) => n.id === revealedNodeId)?.label}
                </strong>
              </div>
              <p style={{ fontSize: '13px', color: '#44321A', lineHeight: 1.55, margin: 0 }}>
                {lightNodes.find((n) => n.id === revealedNodeId)?.surprise}
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
