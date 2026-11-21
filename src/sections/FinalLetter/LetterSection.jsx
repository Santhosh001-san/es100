import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { UnfoldingLetter } from '../../components/Letter/UnfoldingLetter';
import { SecretBonusModal } from '../../components/BonusGift/SecretBonusModal';

export const LetterSection = () => {
  return (
    <section id="letter" className="section-wrapper" style={{ position: 'relative' }}>
      <div className="content-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(248, 220, 230, 0.65)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(217, 125, 149, 0.3)',
              marginBottom: '14px'
            }}
          >
            <Sparkles size={14} color="#D97D95" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#9E4663',
                letterSpacing: '0.12em'
              }}
            >
              CHAPTER THREE • THE FINAL LETTER
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
            One Last Little Surprise
          </motion.h2>

          <p style={{ fontSize: '16px', color: '#6E5D84', lineHeight: 1.6 }}>
            Sealed with champagne gold. A quiet reflection from the person on the other side of your screen.
          </p>
        </div>

        {/* The Unfolding Letter */}
        <UnfoldingLetter />

        {/* Secret Bonus Gift (Unlocked below the letter) */}
        <SecretBonusModal />
      </div>
    </section>
  );
};
