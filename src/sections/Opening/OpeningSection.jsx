import React from 'react';
import { motion } from 'framer-motion';
import { ThreeGiftBox } from '../../components/GiftBox/ThreeGiftBox';
import { Sparkles } from 'lucide-react';

export const OpeningSection = ({ onExploreMore, onUnwrapComplete }) => {
  const handleExplore = onExploreMore || onUnwrapComplete;

  return (
    <section
      id="opening"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '70px 16px 50px',
        overflow: 'hidden'
      }}
    >
      {/* Soft Ambient Radial Glow Behind Box */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '680px',
          height: '680px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230, 215, 250, 0.65) 0%, rgba(248, 225, 235, 0.4) 45%, rgba(255, 255, 255, 0) 75%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '820px', width: '100%' }}>
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 253, 249, 0.9)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '9999px',
            padding: '5px 16px',
            boxShadow: '0 4px 15px rgba(123, 94, 153, 0.1)',
            marginBottom: '8px'
          }}
        >
          <Sparkles size={13} color="#D4AF37" />
          <span
            className="font-cinzel"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#5C3E78'
            }}
          >
            CONFIDENTIAL TRANSMISSION • DAY 100
          </span>
          <Sparkles size={13} color="#D4AF37" />
        </motion.div>

        {/* Grand Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif-luxury"
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#34224C',
            marginBottom: '4px'
          }}
        >
          The Unexpected Package
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: '#6E5D84',
            maxWidth: '560px',
            margin: '0 auto 12px',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 600
          }}
        >
          “A little surprise. A hundred little moments. And something special in between.”
        </motion.p>

        {/* Delivery Tag Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            display: 'inline-block',
            background: 'rgba(255, 253, 249, 0.94)',
            borderRadius: '16px',
            padding: '10px 24px',
            boxShadow: '0 6px 20px rgba(74, 53, 104, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            marginBottom: '8px'
          }}
        >
          <span
            className="font-cinzel"
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: '#D4AF37',
              display: 'block'
            }}
          >
            SPECIAL DELIVERY!
          </span>
          <span className="font-serif-luxury" style={{ fontSize: '16px', fontWeight: 700, color: '#38254E' }}>
            To: Commander Estelle
          </span>
          <span style={{ fontSize: '11.5px', color: '#7E6E92', display: 'block' }}>
            From: <strong style={{ color: '#523770' }}>Yours Lovingly, Silly Goose</strong>
          </span>
        </motion.div>

        {/* Photorealistic 3D Three.js Gift Box with opening animation & miniature world */}
        <ThreeGiftBox onExploreMore={handleExplore} />
      </div>
    </section>
  );
};
