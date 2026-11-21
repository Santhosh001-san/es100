import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, PartyPopper } from 'lucide-react';
import { letterData } from '../../data/letter';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { LetterCelebration } from './LetterCelebration';

export const UnfoldingLetter = ({ onLetterRead }) => {
  // Modes: 'sealed' | 'breaking' | 'celebration' | 'letter'
  const [mode, setMode] = useState('sealed');
  const [revealedParagraphs, setRevealedParagraphs] = useState(0);

  // Click on "BREAK GOLDEN WAX SEAL" button
  const handleOpenLetter = () => {
    if (mode !== 'sealed') return;

    soundManager.playSealBreak();
    setMode('breaking');

    // Golden wax seal fracture burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFF4D0', '#E5B84B', '#FFFFFF']
    });

    // Realistic seal fracture and flap lift transition
    setTimeout(() => {
      setMode('celebration');
    }, 650);
  };

  const handleClose = () => {
    soundManager.playButtonClick();
    setMode('sealed');
    setRevealedParagraphs(0);
  };

  const handleViewLetter = () => {
    soundManager.playButtonClick();
    setMode('letter');

    // Stagger paragraph reveals
    letterData.paragraphs.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedParagraphs((prev) => Math.max(prev, idx + 1));
        if (idx === letterData.paragraphs.length - 1 && onLetterRead) {
          onLetterRead();
        }
      }, 400 + idx * 600);
    });
  };

  const handleBackToCelebration = () => {
    soundManager.playButtonClick();
    setMode('celebration');
  };

  useEscapeKey(handleClose, mode !== 'sealed');

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {/* 1. EXACT PRESERVED SEALED DISPATCH SCREEN */}
        {(mode === 'sealed' || mode === 'breaking') && (
          <motion.div
            key="sealed-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            whileHover={mode === 'sealed' ? { scale: 1.02 } : {}}
            whileTap={mode === 'sealed' ? { scale: 0.98 } : {}}
            onClick={handleOpenLetter}
            className="parchment-card"
            style={{
              padding: '60px 30px',
              textAlign: 'center',
              cursor: mode === 'sealed' ? 'pointer' : 'default',
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 16px 40px rgba(74, 53, 104, 0.14)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Golden Wax Seal (with realistic fracture animation on click) */}
            <div style={{ position: 'relative', width: '74px', height: '74px', margin: '0 auto 20px' }}>
              {mode === 'breaking' ? (
                <>
                  {/* Left fracture fragment */}
                  <motion.div
                    initial={{ x: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: -18, rotate: -15, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="wax-seal"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '74px',
                      height: '74px',
                      clipPath: 'polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)',
                      fontSize: '2rem'
                    }}
                  >
                    {letterData.waxSealMonogram}
                  </motion.div>

                  {/* Right fracture fragment */}
                  <motion.div
                    initial={{ x: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: 18, rotate: 15, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="wax-seal"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '74px',
                      height: '74px',
                      clipPath: 'polygon(55% 0%, 100% 0%, 100% 100%, 45% 100%)',
                      fontSize: '2rem'
                    }}
                  >
                    {letterData.waxSealMonogram}
                  </motion.div>
                </>
              ) : (
                <div
                  className="wax-seal"
                  style={{
                    width: '74px',
                    height: '74px',
                    margin: '0 auto',
                    fontSize: '2rem'
                  }}
                >
                  {letterData.waxSealMonogram}
                </div>
              )}
            </div>

            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#B38B29',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              SEALED DISPATCH • PRIVATE
            </span>

            <h3
              className="font-serif-luxury"
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#34224C',
                marginBottom: '10px'
              }}
            >
              For Commander Estelle
            </h3>

            <p style={{ fontSize: '14.5px', color: '#7E6E92', marginBottom: '24px' }}>
              Click the golden seal to break it open and unfold the letter.
            </p>

            <button className="btn-gold-luxury" style={{ pointerEvents: 'none' }}>
              <Sparkles size={16} />
              <span>Break Golden Wax Seal</span>
            </button>
          </motion.div>
        )}

        {/* 2. REALISTIC 100-DAY CELEBRATION (COUNTDOWN -> FIREWORKS -> MAIN REVEAL -> FINAL MESSAGES) */}
        {mode === 'celebration' && (
          <motion.div
            key="celebration-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <LetterCelebration
              onReplay={() => {}}
              onReadLetter={handleViewLetter}
              onClose={handleClose}
            />
          </motion.div>
        )}

        {/* 3. OPTIONAL UNFOLDED LETTER VIEW */}
        {mode === 'letter' && (
          <motion.div
            key="letter-screen"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              background: '#FFFDF9',
              borderRadius: '20px',
              padding: 'clamp(36px, 5vw, 50px) clamp(18px, 4vw, 42px)',
              boxShadow: '0 20px 50px rgba(74, 53, 104, 0.16)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              position: 'relative'
            }}
          >
            {/* Universal Close Button (sticky pinned so it stays visible on mobile scroll) */}
            <CloseButton
              onClose={handleClose}
              ariaLabel="Close and re-seal letter"
              variant="gold"
              isSticky={true}
              top="14px"
              right="14px"
            />

            {/* Golden corner flourishes */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '28px',
                height: '28px',
                borderTop: '2px solid rgba(212, 175, 55, 0.5)',
                borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                borderTopLeftRadius: '6px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                width: '28px',
                height: '28px',
                borderBottom: '2px solid rgba(212, 175, 55, 0.5)',
                borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                borderBottomLeftRadius: '6px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '28px',
                height: '28px',
                borderBottom: '2px solid rgba(212, 175, 55, 0.5)',
                borderRight: '2px solid rgba(212, 175, 55, 0.5)',
                borderBottomRightRadius: '6px'
              }}
            />

            {/* Letterhead Date & Monogram */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                paddingBottom: '16px',
                marginBottom: '28px',
                paddingRight: '45px'
              }}
            >
              <span
                className="font-cinzel"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#B38B29',
                  letterSpacing: '0.12em'
                }}
              >
                DAY 100 CORRESPONDENCE
              </span>

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#B38B29',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                {letterData.waxSealMonogram}
              </div>
            </div>

            {/* Salutation */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="font-serif-luxury"
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#34224C',
                marginBottom: '20px',
                paddingRight: '40px'
              }}
            >
              {letterData.salutation}
            </motion.h3>

            {/* Staggered Paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {letterData.paragraphs.map((p, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: revealedParagraphs > idx ? 1 : 0,
                    y: revealedParagraphs > idx ? 0 : 12
                  }}
                  transition={{ duration: 0.65 }}
                  className="font-cormorant"
                  style={{
                    fontSize: '21px',
                    lineHeight: 1.7,
                    color: '#443555'
                  }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Closing Greeting & Signature */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: revealedParagraphs >= letterData.paragraphs.length ? 1 : 0,
                y: revealedParagraphs >= letterData.paragraphs.length ? 0 : 15
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                marginTop: '36px',
                paddingTop: '20px',
                borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <p
                  className="font-serif-luxury"
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#9E4663',
                    marginBottom: '8px'
                  }}
                >
                  {letterData.closingGreeting}
                </p>

                <p
                  className="font-cormorant"
                  style={{
                    fontSize: '20px',
                    fontStyle: 'italic',
                    color: '#654C7E',
                    marginBottom: '16px'
                  }}
                >
                  “{letterData.closingReflection}”
                </p>

                <p
                  className="font-handwriting"
                  style={{
                    fontSize: '26px',
                    color: '#5C3E78',
                    fontWeight: 700,
                    margin: 0
                  }}
                >
                  {letterData.signature}
                </p>
              </div>

              {/* Action buttons: Return to Celebration / Re-seal */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleBackToCelebration}
                  className="btn-gold-luxury"
                  style={{ fontSize: '12px', padding: '9px 18px' }}
                >
                  <PartyPopper size={14} />
                  <span>Back to Celebration</span>
                </button>
                <button
                  onClick={handleClose}
                  className="btn-lavender-luxury"
                  style={{ fontSize: '12px', padding: '9px 18px' }}
                >
                  <ArrowLeft size={14} />
                  <span>Re-seal Dispatch</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
