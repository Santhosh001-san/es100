import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Heart, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audioSynth';

export const CelebrationSection = ({ onReplay }) => {
  const triggerCelebrationBurst = () => {
    soundManager.playFanfare();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#8B6FA9', '#F8D7E3', '#FFFDF9', '#E6DCF5']
    });
  };

  const stats = [
    { label: 'Days Celebrated', value: '100' },
    { label: 'Memories Archived', value: '05' },
    { label: 'Commander Test', value: 'S-Tier' },
    { label: 'Envelopes Discovered', value: '10/10' },
    { label: 'Connection Rating', value: 'Legendary' }
  ];

  return (
    <section
      id="celebration"
      className="section-wrapper"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 80px',
        overflow: 'hidden'
      }}
    >
      {/* Background radial celebratory glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 238, 180, 0.45) 0%, rgba(230, 215, 250, 0.3) 50%, transparent 75%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="content-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Big Celebration Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif-luxury"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            color: '#34224C',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}
        >
          Mission 100 Completed!
        </motion.h2>

        {/* Gratitude & Emotional Closing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-cormorant"
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontStyle: 'italic',
            color: '#654C7E',
            maxWidth: '680px',
            margin: '0 auto 40px',
            lineHeight: 1.5
          }}
        >
          “Thanks for being part of this little adventure.
          Here’s to every laugh, every random message, and everything waiting in the next chapter.”
        </motion.p>

        {/* Milestone Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            maxWidth: '850px',
            margin: '0 auto 48px'
          }}
        >
          {stats.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 253, 249, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                padding: '16px 22px',
                flex: '1 1 140px',
                boxShadow: '0 6px 18px rgba(74, 53, 104, 0.08)'
              }}
            >
              <span
                className="font-cinzel"
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#D4AF37',
                  display: 'block',
                  marginBottom: '2px'
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#7B6A8E',
                  fontWeight: 600
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Interactive Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Replay Experience Button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              if (onReplay) onReplay();
            }}
            className="btn-lavender-luxury"
            style={{ padding: '16px 36px', fontSize: '14px' }}
          >
            <RotateCcw size={16} />
            <span>Replay Surprise Experience</span>
          </button>

          {/* Celebrate More Confetti */}
          <button
            onClick={triggerCelebrationBurst}
            className="btn-gold-luxury"
            style={{ padding: '16px 36px', fontSize: '14px' }}
          >
            <Sparkles size={16} />
            <span>Celebrate Again!</span>
          </button>
        </motion.div>

        {/* Footer Note */}
        <div
          style={{
            marginTop: '65px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(123, 94, 153, 0.15)',
            fontSize: '12.5px',
            color: '#8A7A9E'
          }}
        >
          <p style={{ margin: 0 }}>
            Prepared with genuine appreciation & subtle affection for{' '}
            <strong style={{ color: '#543872' }}>Commander Estelle</strong>.
          </p>
          <p style={{ margin: '4px 0 0', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", fontSize: '14px' }}>
            Day 100 • The Unexpected Package • All rights to random conversations reserved.
          </p>
        </div>
      </div>
    </section>
  );
};
