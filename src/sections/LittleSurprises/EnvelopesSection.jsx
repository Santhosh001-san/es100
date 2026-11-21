import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, CheckCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { envelopesData } from '../../data/envelopes';
import { SurpriseEnvelope } from '../../components/Envelopes/SurpriseEnvelope';
import { soundManager } from '../../utils/audioSynth';

export const EnvelopesSection = ({ onProceedToFinalLetter }) => {
  const [openedEnvelopeIds, setOpenedEnvelopeIds] = useState([]);

  const handleOpenEnvelope = (id) => {
    if (!openedEnvelopeIds.includes(id)) {
      const updated = [...openedEnvelopeIds, id];
      setOpenedEnvelopeIds(updated);

      if (updated.length === envelopesData.length) {
        // All 10 envelopes opened! Celebrate with fanfare
        setTimeout(() => {
          soundManager.playFanfare();
          confetti({
            particleCount: 140,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#845EC2', '#E29578', '#FFFDF9', '#E6DCF5']
          });
        }, 500);
      }
    }
  };

  const openedCount = openedEnvelopeIds.length;
  const isAllOpened = openedCount === envelopesData.length;

  return (
    <section id="envelopes" className="section-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="content-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(230, 215, 250, 0.65)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(123, 94, 153, 0.25)',
              marginBottom: '14px'
            }}
          >
            <Mail size={14} color="#7B5E99" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#5C3E78',
                letterSpacing: '0.12em'
              }}
            >
              CHAPTER TWO • TEN SURPRISE ENVELOPES
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-luxury"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: '#34224C',
              lineHeight: 1.2,
              marginBottom: '12px'
            }}
          >
            A Few Little Things for You
          </motion.h2>

          <p style={{ fontSize: '16px', color: '#6E5D84', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            Ten individual envelopes, sealed with gold wax and stamped for Commander Estelle. Each holds a distinct thought, reminder, or award. Tap each wax seal to reveal what is inside!
          </p>

          {/* Progress Tracker Pill */}
          <div
            style={{
              marginTop: '22px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 253, 249, 0.92)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '30px',
              padding: '8px 24px',
              boxShadow: '0 4px 18px rgba(74, 53, 104, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#D4AF37" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#38254E', letterSpacing: '0.04em' }}>
                Envelopes Opened: <strong style={{ color: '#D4AF37', fontSize: '15px' }}>{openedCount}</strong> / 10
              </span>
            </div>

            {isAllOpened && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
                  paddingLeft: '10px'
                }}
              >
                <CheckCheck size={15} /> All 10 Unsealed!
              </span>
            )}
          </div>
        </div>

        {/* 10 Envelopes Grid - Responsive & Organized */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '24px',
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {envelopesData.map((envelope, index) => (
            <SurpriseEnvelope
              key={envelope.id}
              envelope={envelope}
              index={index}
              isOpened={openedEnvelopeIds.includes(envelope.id)}
              onOpen={handleOpenEnvelope}
            />
          ))}
        </div>

        {/* Completion Cue Linking to Chapter 3: The Final Letter */}
        <AnimatePresence>
          {isAllOpened && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                marginTop: '48px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FAF4FF 0%, #FFF9EB 100%)',
                border: '2px solid rgba(212, 175, 55, 0.6)',
                borderRadius: '24px',
                padding: '32px 24px',
                maxWidth: '680px',
                margin: '48px auto 0',
                boxShadow: '0 16px 40px rgba(212, 175, 55, 0.25)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#B38B29',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: '8px'
                }}
              >
                <Sparkles size={14} />
                <span>ALL 10 ENVELOPES UNSEALED</span>
                <Sparkles size={14} />
              </div>

              <h3
                className="font-serif-luxury"
                style={{ fontSize: '24px', fontWeight: 800, color: '#34224C', marginBottom: '10px' }}
              >
                Every Little Note Has Been Discovered!
              </h3>

              <p style={{ fontSize: '15px', color: '#685A7E', marginBottom: '22px', lineHeight: 1.5, maxWidth: '540px', margin: '0 auto 22px' }}>
                There is still one more piece waiting for you. The final sealed letter and special surprise await in Chapter Three.
              </p>

              <a
                href="#letter"
                onClick={(e) => {
                  if (onProceedToFinalLetter) {
                    e.preventDefault();
                    onProceedToFinalLetter();
                  }
                }}
                className="btn-gold-luxury"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  padding: '12px 28px'
                }}
              >
                <span>Proceed to The Final Letter</span>
                <ArrowRight size={15} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
