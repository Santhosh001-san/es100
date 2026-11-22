import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/audioSynth';
import { CloseButton } from '../../Common/CloseButton';

export const Envelope10_FinalCelebration = ({ envelope, onClose }) => {
  const [isFinalIlluminated, setIsFinalIlluminated] = useState(false);

  // Trigger Final Illumination Confetti & fanfare
  const handleIlluminateFinal = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundManager.playFanfare();
    setIsFinalIlluminated(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#FFF1B0', '#F8E192', '#845EC2', '#FFFFFF']
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
        background: 'radial-gradient(ellipse at 50% 20%, #FFFDF7 0%, #FBF4E4 65%, #F4E8D0 100%)',
        borderRadius: '26px',
        maxWidth: '650px',
        width: '100%',
        margin: 'auto 0',
        padding: 'clamp(28px, 4.5vw, 40px) clamp(18px, 4vw, 32px) clamp(36px, 5vw, 48px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 50px rgba(212, 175, 55, 0.35)',
        border: '2px solid rgba(212, 175, 55, 0.75)',
        position: 'relative',
        textAlign: 'center',
        touchAction: 'pan-y'
      }}
    >
      {/* Universal Close Button (sticky so it stays visible on mobile scroll) */}
      <CloseButton
        onClose={onClose}
        variant="gold"
        isSticky={true}
        top="14px"
        right="14px"
        ariaLabel="Close Envelope 10"
      />

      {/* Top Envelope Header / Stamp */}
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
          letterSpacing: '0.12em',
          fontFamily: "'Cinzel', serif",
          marginBottom: '14px'
        }}
      >
        <span>ENVELOPE {envelope?.number || '10'}</span>
        <span>•</span>
        <span>{envelope?.category || 'Looking Forward'}</span>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-serif-luxury"
        style={{
          fontSize: 'clamp(22px, 3.5vw, 28px)',
          fontWeight: 700,
          color: '#34224C',
          marginBottom: '18px',
          lineHeight: 1.25
        }}
      >
        {envelope?.title || 'To Be Continued'}
      </motion.h3>

      {/* Unfolded Letter Parchment Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #FCF8F2 0%, #F8F1FC 100%)',
          borderRadius: '18px',
          padding: '24px 22px',
          border: '1.5px solid rgba(212, 175, 55, 0.35)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02), 0 6px 20px rgba(74, 53, 104, 0.06)',
          marginBottom: '22px',
          position: 'relative'
        }}
      >
        {/* Decorative Quote Mark */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '14px',
            fontSize: '48px',
            fontFamily: 'serif',
            color: 'rgba(212, 175, 55, 0.2)',
            lineHeight: 1,
            pointerEvents: 'none'
          }}
        >
          “
        </span>

        {/* Main Message with Cormorant Typography */}
        <p
          className="font-cormorant"
          style={{
            fontSize: 'clamp(19px, 2.8vw, 22px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#38254E',
            lineHeight: 1.6,
            margin: 0,
            position: 'relative',
            zIndex: 1,
            textAlign: 'left'
          }}
        >
          {envelope?.message ||
            "100 days feels like a significant milestone, but in many ways, it only feels like the opening chapter. Every conversation with you has a way of leaving things a little brighter than they were before. So this isn’t a conclusion at all—just a celebration of how far we’ve come, and a quiet, genuine wish for many more laughs, late-night theories, and unexpected moments together."}
        </p>

        {/* Subtext Footnote */}
        {envelope?.subtext && (
          <p
            style={{
              fontSize: '12.5px',
              color: '#7D6A94',
              fontStyle: 'italic',
              marginTop: '14px',
              marginBottom: 0,
              borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
              paddingTop: '10px',
              textAlign: 'left'
            }}
          >
            ✦ {envelope.subtext}
          </p>
        )}
      </motion.div>

      {/* Envelope 10: The Original "Illuminate The Road Ahead" Experience */}
      <div style={{ marginBottom: '24px' }}>
        {!isFinalIlluminated ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleIlluminateFinal}
            className="btn-gold-luxury"
            style={{
              fontSize: '13px',
              padding: '13px 28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.25)'
            }}
          >
            <Sparkles size={16} />
            <span>✦ Illuminate The Road Ahead ✦</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'linear-gradient(135deg, #FFF9EA 0%, #F5ECFF 100%)',
              border: '2px solid #D4AF37',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
              textAlign: 'center'
            }}
          >
            <p
              className="font-cormorant"
              style={{
                fontSize: '19px',
                fontStyle: 'italic',
                fontWeight: 700,
                color: '#44321A',
                marginBottom: '10px'
              }}
            >
              “{envelope?.finalAnimationData?.quote || "Here’s to the conversations still unwritten, the adventures still unplanned, and every shared laugh still to come."}”
            </p>
            <div
              className="font-cinzel"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #D4AF37 0%, #E8C86A 100%)',
                color: '#34224C',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.18em',
                padding: '6px 18px',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)'
              }}
            >
              {envelope?.finalAnimationData?.banner || '✦ TO BE CONTINUED ✦'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Button: Return to collection */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onClose}
          className="btn-lavender-luxury"
          style={{ padding: '10px 24px', fontSize: '12.5px', cursor: 'pointer' }}
        >
          <span>Keep Note & Return to Envelopes</span>
        </button>
      </div>
    </motion.div>
  );
};
