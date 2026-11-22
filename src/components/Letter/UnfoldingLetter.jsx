import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, PartyPopper } from 'lucide-react';
import { letterData } from '../../data/letter';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { LetterCelebration } from './LetterCelebration';

// Helper to tastefully highlight key words: 100 days, family, friends, memories, happiness
const renderHighlightedText = (text) => {
  if (!text) return null;
  const regex = /(100 days|family|friends|memories|happiness)/gi;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    if (
      lower === '100 days' ||
      lower === 'family' ||
      lower === 'friends' ||
      lower === 'memories' ||
      lower === 'happiness'
    ) {
      return (
        <span key={i} className="gold-word-highlight">
          {part}
        </span>
      );
    }
    return part;
  });
};

export const UnfoldingLetter = ({ onLetterRead, onClose }) => {
  // Modes: 'clasp' | 'unlocking' | 'celebration' | 'letter'
  const [mode, setMode] = useState('clasp');
  const [revealedParagraphs, setRevealedParagraphs] = useState(0);

  // Click on "UNLOCK THE FINAL CELEBRATION" or the Magical Star Clasp
  const handleUnlockCelebration = () => {
    if (mode !== 'clasp') return;

    soundManager.playStarChime(1.25);
    setMode('unlocking');

    // Tiny elegant golden star particles and lavender shimmer burst
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.52 },
      colors: ['#D4AF37', '#FFF8DB', '#BA93E6', '#F3E8FF', '#FFFFFF', '#ECC864']
    });

    // Invitation unfolds smoothly with light trail before starting celebration
    setTimeout(() => {
      setMode('celebration');
    }, 700);
  };

  const handleClose = () => {
    soundManager.playButtonClick();
    setMode('clasp');
    setRevealedParagraphs(0);
    if (onClose) onClose();
  };

  const handleViewLetter = () => {
    soundManager.playButtonClick();
    setMode('letter');

    // Stagger paragraph reveals smoothly
    letterData.paragraphs.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedParagraphs((prev) => Math.max(prev, idx + 1));
        if (idx === letterData.paragraphs.length - 1 && onLetterRead) {
          onLetterRead();
        }
      }, 300 + idx * 400);
    });
  };

  const handleBackToCelebration = () => {
    soundManager.playButtonClick();
    setMode('celebration');
  };

  useEscapeKey(handleClose, mode !== 'clasp');

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {/* 1. THE FINAL INVITATION WITH THE MAGICAL STAR CLASP */}
        {(mode === 'clasp' || mode === 'unlocking') && (
          <motion.div
            key="clasp-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="parchment-card"
            style={{
              padding: 'clamp(44px, 6vw, 64px) clamp(20px, 4vw, 36px)',
              textAlign: 'center',
              background: 'radial-gradient(ellipse at 50% 25%, #FFFDF9 0%, #FAF4EB 60%, #F5ECDD 100%)',
              border: '2px solid rgba(212, 175, 55, 0.65)',
              boxShadow: '0 20px 50px rgba(74, 53, 104, 0.18), 0 0 35px rgba(186, 147, 230, 0.25)',
              borderRadius: '26px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {onClose && (
              <CloseButton
                onClose={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  onClose();
                }}
                variant="gold"
                top="16px"
                right="16px"
                ariaLabel="Close Final Invitation"
              />
            )}

            {/* Traveling Light Trail on Unlocking */}
            {mode === 'unlocking' && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '200%', opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 245, 200, 0.7) 45%, rgba(186, 147, 230, 0.6) 55%, transparent 100%)',
                  transform: 'skewX(-25deg)',
                  pointerEvents: 'none',
                  zIndex: 20
                }}
              />
            )}

            {/* ==============================================================
                THE MAGICAL STAR CLASP (3D Faceted Champagne-Gold Clasp with Lavender Glow)
                ============================================================== */}
            <div
              onClick={handleUnlockCelebration}
              className="magical-star-clasp-container"
              style={{
                position: 'relative',
                width: '92px',
                height: '92px',
                margin: '0 auto 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: mode === 'clasp' ? 'pointer' : 'default'
              }}
            >
              {/* Subtle Ambient Lavender Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.55, 0.85, 0.55]
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(186, 147, 230, 0.5) 0%, rgba(212, 175, 55, 0.25) 45%, transparent 70%)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none'
                }}
              />

              {/* 3D Champagne-Gold Star Clasp */}
              <motion.div
                animate={
                  mode === 'unlocking'
                    ? { rotate: 360, scale: 1.3, opacity: [1, 1, 0] }
                    : { rotate: [0, 4, -4, 0], scale: 1 }
                }
                transition={
                  mode === 'unlocking'
                    ? { duration: 0.68, ease: 'easeInOut' }
                    : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.14, rotate: 15 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '84px',
                  height: '84px',
                  position: 'relative',
                  filter: 'drop-shadow(0 8px 18px rgba(74, 53, 104, 0.35)) drop-shadow(0 0 16px rgba(212, 175, 55, 0.65))'
                }}
              >
                <svg width="84" height="84" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="starGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFDF7" />
                      <stop offset="30%" stopColor="#F8E5A1" />
                      <stop offset="60%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#96741F" />
                    </linearGradient>
                    <linearGradient id="starGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E5C365" />
                      <stop offset="50%" stopColor="#B38B29" />
                      <stop offset="100%" stopColor="#6E4F0E" />
                    </linearGradient>
                    <radialGradient id="starCoreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="45%" stopColor="#FFF2B8" />
                      <stop offset="80%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#7A560E" />
                    </radialGradient>
                  </defs>

                  {/* 8-Pointed Star Clasp Primary Facets */}
                  <polygon points="50,4 58,38 96,50 58,62 50,96 42,62 4,50 42,38" fill="url(#starGoldLight)" />
                  {/* Diagonal Secondary Facets */}
                  <polygon points="50,18 64,36 82,50 64,64 50,82 36,64 18,50 36,36" fill="url(#starGoldDark)" opacity="0.88" />
                  {/* Fine Shading Ridges */}
                  <polygon points="50,4 50,50 58,38" fill="#FFF9E0" opacity="0.65" />
                  <polygon points="96,50 50,50 58,62" fill="#805B10" opacity="0.5" />
                  <polygon points="50,96 50,50 42,62" fill="#6B4B0A" opacity="0.6" />
                  <polygon points="4,50 50,50 42,38" fill="#FFF4C2" opacity="0.5" />
                  {/* Inner Metallic Medallion Ring with Micro-Perforations */}
                  <circle cx="50" cy="50" r="19" fill="url(#starCoreGlow)" stroke="#FFFDF8" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(212, 175, 55, 0.85)" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Central Diamond Starlet */}
                  <polygon points="50,38 54,47 62,50 54,53 50,62 46,53 38,50 46,47" fill="#FFFFFF" />
                  <circle cx="50" cy="50" r="2.5" fill="#FFE27A" />
                </svg>
              </motion.div>
            </div>

            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                color: '#B38B29',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              THE CENTENNIAL INVITATION • PRIVATE
            </span>

            <h3
              className="font-serif-luxury"
              style={{
                fontSize: 'clamp(24px, 4vw, 30px)',
                fontWeight: 700,
                color: '#34224C',
                marginBottom: '10px'
              }}
            >
              For Commander Estelle
            </h3>

            <p style={{ fontSize: '14.5px', color: '#7E6E92', marginBottom: '26px' }}>
              Touch the magical star clasp to unfold the invitation and begin the 100-day celebration.
            </p>

            <button
              onClick={handleUnlockCelebration}
              className="btn-gold-luxury"
              style={{
                fontSize: '13px',
                padding: '13px 30px',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4), 0 0 20px rgba(186, 147, 230, 0.35)'
              }}
            >
              <Sparkles size={16} />
              <span>UNLOCK THE FINAL CELEBRATION</span>
            </button>
          </motion.div>
        )}

        {/* 2. REALISTIC 100-DAY CELEBRATION (COUNTDOWN -> FIREWORKS -> MAIN REVEAL -> AUTO-UNFOLD) */}
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

        {/* 3. UPGRADED FINAL CELEBRATION LETTER — EMOTIONAL, FUNNY & KEEPSAKE PARCHMENT */}
        {mode === 'letter' && (
          <motion.div
            key="letter-screen"
            initial={{ opacity: 0, scaleY: 0.3, rotateX: -24, y: 20 }}
            animate={{ opacity: 1, scaleY: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="keepsake-parchment-glow"
            style={{
              transformOrigin: 'top center',
              perspective: '1200px',
              background: 'linear-gradient(145deg, #FFFDF8 0%, #FAF5EA 50%, #F6EEDC 100%)',
              borderRadius: '24px',
              padding: 'clamp(36px, 6vw, 56px) clamp(20px, 5vw, 46px)',
              border: '2px solid rgba(212, 175, 55, 0.55)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 70px rgba(52, 34, 76, 0.16), 0 0 45px rgba(212, 175, 55, 0.28)'
            }}
          >
            {/* Delicate Golden Shimmer Sweep Animation on Opening */}
            <div className="keepsake-unfold-shimmer" />

            {/* Universal Close Button (sticky so it stays visible on mobile scroll) */}
            <CloseButton
              onClose={handleClose}
              ariaLabel="Close celebration letter"
              variant="gold"
              isSticky={true}
              top="16px"
              right="16px"
            />

            {/* Delicate Inner Dashed Gold Perimeter */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                border: '1px dashed rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                pointerEvents: 'none'
              }}
            />

            {/* 4 Ornate Golden Filigree Corner Ornaments (SVG) */}
            <svg
              width="38"
              height="38"
              viewBox="0 0 42 42"
              fill="none"
              style={{ position: 'absolute', top: '14px', left: '14px', pointerEvents: 'none' }}
            >
              <path d="M4 38V12C4 7.58172 7.58172 4 12 4H38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 32V14C10 11.7909 11.7909 10 14 10H32" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
              <path d="M22 6L23.5 10.5L28 12L23.5 13.5L22 18L20.5 13.5L16 12L20.5 10.5L22 6Z" fill="#D4AF37" opacity="0.8" />
            </svg>

            <svg
              width="38"
              height="38"
              viewBox="0 0 42 42"
              fill="none"
              style={{ position: 'absolute', top: '14px', right: '14px', pointerEvents: 'none', transform: 'scaleX(-1)' }}
            >
              <path d="M4 38V12C4 7.58172 7.58172 4 12 4H38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 32V14C10 11.7909 11.7909 10 14 10H32" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
              <path d="M22 6L23.5 10.5L28 12L23.5 13.5L22 18L20.5 13.5L16 12L20.5 10.5L22 6Z" fill="#D4AF37" opacity="0.8" />
            </svg>

            <svg
              width="38"
              height="38"
              viewBox="0 0 42 42"
              fill="none"
              style={{ position: 'absolute', bottom: '14px', left: '14px', pointerEvents: 'none', transform: 'scaleY(-1)' }}
            >
              <path d="M4 38V12C4 7.58172 7.58172 4 12 4H38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 32V14C10 11.7909 11.7909 10 14 10H32" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
              <path d="M22 6L23.5 10.5L28 12L23.5 13.5L22 18L20.5 13.5L16 12L20.5 10.5L22 6Z" fill="#D4AF37" opacity="0.8" />
            </svg>

            <svg
              width="38"
              height="38"
              viewBox="0 0 42 42"
              fill="none"
              style={{ position: 'absolute', bottom: '14px', right: '14px', pointerEvents: 'none', transform: 'scale(-1, -1)' }}
            >
              <path d="M4 38V12C4 7.58172 7.58172 4 12 4H38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 32V14C10 11.7909 11.7909 10 14 10H32" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
              <path d="M22 6L23.5 10.5L28 12L23.5 13.5L22 18L20.5 13.5L16 12L20.5 10.5L22 6Z" fill="#D4AF37" opacity="0.8" />
            </svg>

            {/* GOLDEN 100-DAY MEDALLION EMBLEM */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ textAlign: 'center', marginBottom: '16px' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #FFF2B2 0%, #D4AF37 55%, #99741B 100%)',
                  boxShadow: '0 6px 18px rgba(212, 175, 55, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
                  border: '2px solid #FFF8DC',
                  color: '#3A2002',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 900,
                  fontSize: '17px',
                  letterSpacing: '0.04em',
                  position: 'relative'
                }}
              >
                100
                {/* Decorative Ribbon Tails */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-7px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '4px'
                  }}
                >
                  <div style={{ width: '7px', height: '12px', background: '#B8860B', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }} />
                  <div style={{ width: '7px', height: '12px', background: '#B8860B', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }} />
                </div>
              </div>
            </motion.div>

            {/* DECORATIVE HEADING: “THE FINAL CELEBRATION” */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '26px' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#B38018',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: '6px'
                }}
              >
                <span style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                <span>✦ DAY 100 KEEPSAKE DISPATCH ✦</span>
                <span style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
              </div>

              <h2
                className="font-cinzel"
                style={{
                  fontSize: 'clamp(1.5rem, 3.4vw, 2.2rem)',
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  background: 'linear-gradient(135deg, #4A2E05 0%, #B8860B 40%, #E5BE53 60%, #6E4506 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '4px 0 8px',
                  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.25))'
                }}
              >
                {letterData.title}
              </h2>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 16px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  fontSize: '10.5px',
                  color: '#8A6214',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  fontFamily: "'Cinzel', serif"
                }}
              >
                <Sparkles size={11} color="#B38018" />
                <span>SPECIAL COMMENDATION FOR COMMANDER ESTELLE</span>
                <Sparkles size={11} color="#B38018" />
              </div>
            </motion.div>

            {/* SALUTATION */}
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-serif-luxury"
              style={{
                fontSize: 'clamp(22px, 3.2vw, 26px)',
                fontWeight: 700,
                color: '#34224C',
                marginBottom: '18px',
                paddingRight: '36px'
              }}
            >
              {letterData.salutation}
            </motion.h3>

            {/* STAGGERED PARAGRAPHS WITH TASTEFUL GOLD HIGHLIGHTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {letterData.paragraphs.map((p, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{
                    opacity: revealedParagraphs > idx ? 1 : 0,
                    y: revealedParagraphs > idx ? 0 : 14
                  }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="font-cormorant"
                  style={{
                    fontSize: 'clamp(18px, 2.2vw, 21px)',
                    lineHeight: 1.75,
                    color: '#382848',
                    margin: 0
                  }}
                >
                  {renderHighlightedText(p)}
                </motion.p>
              ))}
            </div>

            {/* MILESTONE BANNER PLAQUE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: revealedParagraphs >= letterData.paragraphs.length ? 1 : 0,
                scale: revealedParagraphs >= letterData.paragraphs.length ? 1 : 0.96
              }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                margin: '30px 0 24px',
                background: 'linear-gradient(135deg, rgba(255, 248, 230, 0.96) 0%, rgba(254, 241, 204, 0.96) 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.65)',
                borderRadius: '16px',
                padding: '16px 20px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.22)'
              }}
            >
              <div
                className="font-cinzel"
                style={{
                  fontSize: 'clamp(12px, 2.2vw, 14.5px)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#66450A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={15} color="#D4AF37" />
                <span>{letterData.milestoneBanner}</span>
                <Sparkles size={15} color="#D4AF37" />
              </div>
            </motion.div>

            {/* CLOSING BLESSING & AUTHENTIC HANDWRITTEN SIGNATURE */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: revealedParagraphs >= letterData.paragraphs.length ? 1 : 0,
                y: revealedParagraphs >= letterData.paragraphs.length ? 0 : 15
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px dashed rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              <div>
                <p
                  className="font-serif-luxury"
                  style={{
                    fontSize: 'clamp(19px, 3vw, 23px)',
                    fontWeight: 700,
                    color: '#9E4663',
                    marginBottom: '16px'
                  }}
                >
                  {letterData.closingGreeting}
                </p>

                {/* Handwritten Signature */}
                <div style={{ marginTop: '12px' }}>
                  <p
                    className="font-handwriting"
                    style={{
                      fontSize: 'clamp(28px, 4.4vw, 36px)',
                      color: '#4B2A6B',
                      lineHeight: 1.3,
                      margin: 0,
                      transform: 'rotate(-2deg)',
                      display: 'inline-block',
                      textAlign: 'left'
                    }}
                  >
                    {letterData.signaturePrefix}<br />
                    <span style={{ fontSize: 'clamp(34px, 5.2vw, 42px)', color: '#5C2D84', fontWeight: 700 }}>
                      {letterData.signatureAuthor}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Replay Celebration & Re-seal */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleBackToCelebration}
                  className="btn-gold-luxury"
                  style={{ fontSize: '12px', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <PartyPopper size={14} />
                  <span>Replay Celebration</span>
                </button>
                <button
                  onClick={handleClose}
                  className="btn-lavender-luxury"
                  style={{ fontSize: '12px', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={14} />
                  <span>Return to Envelopes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
