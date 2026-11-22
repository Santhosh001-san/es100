import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope04_UnfoldingStory = ({ envelope, onClose }) => {
  // 3 Layers / Accordion Stages
  const [openLayers, setOpenLayers] = useState({
    layer1: true,   // The 45-Minute Investigation Dossier
    layer2: false,  // The Classified Commendation
    layer3: false   // The Official Chaos Award Citation
  });

  const toggleLayer = (layerKey) => {
    soundManager.playButtonClick();
    setOpenLayers((prev) => {
      const nextState = !prev[layerKey];
      // If opening layer 3 (The Chaos Award), trigger fanfare and confetti!
      if (layerKey === 'layer3' && nextState) {
        soundManager.playFanfare();
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#845EC2', '#D4AF37', '#FFFDF9', '#D97D95']
        });
      }
      return { ...prev, [layerKey]: nextState };
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 35 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #FAF0FE 0%, #F1DCF7 65%, #E5C7EE 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 38px) clamp(18px, 4vw, 30px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 28px 75px rgba(132, 94, 194, 0.35), 0 0 45px rgba(220, 195, 245, 0.35)',
        border: '2px solid rgba(132, 94, 194, 0.65)',
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
        ariaLabel="Close Envelope 04"
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
          background: 'rgba(132, 94, 194, 0.15)',
          border: '1px solid rgba(132, 94, 194, 0.45)',
          color: '#653F9C',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <Award size={13} />
        <span>ENVELOPE 04 • {envelope.category}</span>
        <Award size={13} />
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
          marginBottom: '20px',
          lineHeight: 1.25
        }}
      >
        {envelope.title}
      </motion.h3>

      {/* LAYER 1: The Investigation Overview (Accordion Fold 1) */}
      <div
        style={{
          marginBottom: '12px',
          background: '#FFFEFA',
          borderRadius: '16px',
          border: '1.5px solid rgba(132, 94, 194, 0.35)',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(74, 53, 104, 0.08)'
        }}
      >
        <button
          onClick={() => toggleLayer('layer1')}
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'linear-gradient(90deg, #F9F2FD 0%, #FFFFFF 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#734B9C', fontFamily: "'Cinzel', serif" }}>
              STAGE 01
            </span>
            <strong style={{ fontSize: '13.5px', color: '#34224C' }}>
              The 100-Day Investigation
            </strong>
          </div>
          {openLayers.layer1 ? <ChevronUp size={16} color="#734B9C" /> : <ChevronDown size={16} color="#734B9C" />}
        </button>

        <AnimatePresence>
          {openLayers.layer1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 18px 18px', textAlign: 'left' }}
            >
              <p
                className="font-cormorant"
                style={{
                  fontSize: '18px',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: '#38254E',
                  lineHeight: 1.6,
                  margin: '10px 0 0'
                }}
              >
                “{envelope.message}”
              </p>
              {envelope.subtext && (
                <div style={{ fontSize: '12.5px', color: '#7E5B98', marginTop: '10px', fontStyle: 'italic' }}>
                  ✦ {envelope.subtext}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LAYER 2: Operational Commendation (Accordion Fold 2) */}
      <div
        style={{
          marginBottom: '12px',
          background: '#FFFEFA',
          borderRadius: '16px',
          border: '1.5px solid rgba(132, 94, 194, 0.35)',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(74, 53, 104, 0.08)'
        }}
      >
        <button
          onClick={() => toggleLayer('layer2')}
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'linear-gradient(90deg, #F9F2FD 0%, #FFFFFF 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#734B9C', fontFamily: "'Cinzel', serif" }}>
              STAGE 02
            </span>
            <strong style={{ fontSize: '13.5px', color: '#34224C' }}>
              Strategic Operational Commendation
            </strong>
          </div>
          {openLayers.layer2 ? <ChevronUp size={16} color="#734B9C" /> : <ChevronDown size={16} color="#734B9C" />}
        </button>

        <AnimatePresence>
          {openLayers.layer2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 18px 18px', textAlign: 'left' }}
            >
              <div style={{ padding: '12px', background: '#F8EEFA', borderRadius: '12px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={16} color="#734B9C" />
                  <strong style={{ fontSize: '12.5px', color: '#34224C' }}>
                    CODENAME: COMMANDER ESTELLE
                  </strong>
                </div>
                <p style={{ fontSize: '13px', color: '#4E3A68', lineHeight: 1.5, margin: 0 }}>
                  Subject has demonstrated rare conversational hyper-mobility, effortlessly transitioning between deep philosophical questions, 2:00 AM food theories, and dramatic theatrical debate.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LAYER 3: The Official Chaos Award Citation (Accordion Fold 3) */}
      <div
        style={{
          marginBottom: '22px',
          background: '#FFFEFA',
          borderRadius: '16px',
          border: '2px solid rgba(212, 175, 55, 0.65)',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(212, 175, 55, 0.2)'
        }}
      >
        <button
          onClick={() => toggleLayer('layer3')}
          style={{
            width: '100%',
            padding: '14px 18px',
            background: 'linear-gradient(90deg, #FFF9EA 0%, #FFFFFF 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#B38B29', fontFamily: "'Cinzel', serif" }}>
              STAGE 03
            </span>
            <strong style={{ fontSize: '13.5px', color: '#B38B29', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Official Chaos Award Citation
            </strong>
          </div>
          {openLayers.layer3 ? <ChevronUp size={16} color="#B38B29" /> : <ChevronDown size={16} color="#B38B29" />}
        </button>

        <AnimatePresence>
          {openLayers.layer3 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ padding: '0 18px 20px', textAlign: 'center' }}
            >
              <div
                style={{
                  background: 'radial-gradient(circle at 50% 20%, #FFFDF5 0%, #F5ECFF 100%)',
                  border: '1.5px solid #845EC2',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 8px 25px rgba(132, 94, 194, 0.2)',
                  marginTop: '10px'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#845EC2',
                    fontWeight: 800,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    marginBottom: '8px'
                  }}
                >
                  <Award size={16} />
                  <span>{envelope.awardData.badge}</span>
                </div>
                <h4
                  className="font-serif-luxury"
                  style={{ fontSize: '20px', fontWeight: 800, color: '#34224C', margin: '4px 0' }}
                >
                  {envelope.awardData.recipient}
                </h4>
                <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#A84C66', marginBottom: '10px' }}>
                  {envelope.awardData.title}
                </p>
                <p style={{ fontSize: '13.5px', color: '#4E3A68', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                  “{envelope.awardData.citation}”
                </p>
              </div>
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
