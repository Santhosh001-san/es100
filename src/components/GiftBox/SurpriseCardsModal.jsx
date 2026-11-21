import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, RotateCcw, ChevronLeft, ChevronRight, Award, Coffee, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { boxContentsData } from '../../data/boxContents';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';

export const SurpriseCardsModal = ({ onClose }) => {
  const cards = boxContentsData.miniCards;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [discoveredIds, setDiscoveredIds] = useState([1]);

  // Card 1: Sparks State
  const [sparkIndex, setSparkIndex] = useState(0);

  // Card 2: Tangent Level State
  const [tangentLevelIndex, setTangentLevelIndex] = useState(0);

  // Card 3: Comfort State
  const [comfortMessageIndex, setComfortMessageIndex] = useState(0);
  const [isComfortBrewed, setIsComfortBrewed] = useState(false);

  // Card 4: Stamp State
  const [isStamped, setIsStamped] = useState(false);

  // Card 5: Starlight Wish State
  const [isWishReleased, setIsWishReleased] = useState(false);

  useEscapeKey(onClose, true);

  const currentCard = cards[activeCardIndex];

  const handleSelectCard = (idx) => {
    soundManager.playButtonClick();
    setActiveCardIndex(idx);
    setIsFlipped(false);
    const cardId = cards[idx].id;
    if (!discoveredIds.includes(cardId)) {
      const updated = [...discoveredIds, cardId];
      setDiscoveredIds(updated);
      if (updated.length === cards.length) {
        setTimeout(() => {
          soundManager.playFanfare();
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#C97A8F', '#845EC2', '#FFFDF9']
          });
        }, 300);
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = activeCardIndex === 0 ? cards.length - 1 : activeCardIndex - 1;
    handleSelectCard(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = activeCardIndex === cards.length - 1 ? 0 : activeCardIndex + 1;
    handleSelectCard(nextIdx);
  };

  const handleFlipCard = () => {
    soundManager.playButtonClick();
    setIsFlipped(!isFlipped);
  };

  // Interactive Action Handlers
  const handleNextSpark = () => {
    soundManager.playButtonClick();
    setSparkIndex((prev) => (prev + 1) % currentCard.sparksList.length);
  };

  const handleSelectTangent = (idx) => {
    soundManager.playButtonClick();
    setTangentLevelIndex(idx);
  };

  const handleBrewComfort = () => {
    soundManager.playButtonClick();
    setIsComfortBrewed(true);
    setComfortMessageIndex((prev) => (prev + 1) % currentCard.comfortMessages.length);
  };

  const handleApplyStamp = () => {
    soundManager.playFanfare();
    setIsStamped(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8B4789', '#D4AF37', '#FFFDF9']
    });
  };

  const handleReleaseWish = () => {
    soundManager.playFanfare();
    setIsWishReleased(true);
    confetti({
      particleCount: 85,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#FFF1B0', '#E5BE53', '#FFFFFF', '#C59B27']
    });
  };

  const isAllDiscovered = discoveredIds.length === cards.length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 10, 30, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #FFFDF9 0%, #FAF5ED 65%, #F4ECE0 100%)',
          borderRadius: '26px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 'clamp(24px, 4vw, 32px) clamp(14px, 4vw, 24px) 26px',
          boxShadow: '0 28px 70px rgba(0,0,0,0.4), 0 0 45px rgba(212, 175, 55, 0.25)',
          border: '2px solid rgba(212, 175, 55, 0.65)',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Universal Close Button (sticky pinned so it stays visible on mobile scroll) */}
        <CloseButton onClose={onClose} variant="gold" isSticky={true} top="14px" right="14px" ariaLabel="Close Surprise Cards" />

        {/* Section Header */}
        <div style={{ marginBottom: '14px', paddingLeft: '32px', paddingRight: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(212, 175, 55, 0.14)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#8C6716',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              fontFamily: "'Cinzel', serif",
              marginBottom: '8px'
            }}
          >
            <Sparkles size={13} />
            <span>COLLECTIBLE KEEPSAKE CARDS</span>
            <Sparkles size={13} />
          </div>

          <h3
            className="font-serif-luxury"
            style={{
              fontSize: 'clamp(22px, 3.8vw, 28px)',
              fontWeight: 800,
              color: '#34224C',
              margin: '0 0 6px',
              lineHeight: 1.25
            }}
          >
            Five Little Surprise Cards
          </h3>

          <p style={{ fontSize: '13.5px', color: '#685A7E', margin: 0, maxWidth: '500px', marginInline: 'auto' }}>
            Five unique keepsake cards crafted for Commander Estelle. Tap a card to inspect, flip to read, and explore its special interaction.
          </p>
        </div>

        {/* Discovery Progress Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '4px 16px',
            marginBottom: '18px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#38254E',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <span>
            Cards Discovered: <strong style={{ color: '#D4AF37' }}>{discoveredIds.length}</strong> / 5
          </span>
          {isAllDiscovered && (
            <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Check size={13} /> All 5 Unlocked!
            </span>
          )}
        </div>

        {/* 5 Collectible Cards Selector Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '18px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {cards.map((c, idx) => {
            const isSelected = activeCardIndex === idx;
            const isDiscovered = discoveredIds.includes(c.id);
            return (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectCard(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '16px',
                  border: isSelected ? `2px solid ${c.accent}` : '1.5px solid rgba(212, 175, 55, 0.35)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${c.color} 0%, #FFFFFF 100%)`
                    : 'rgba(255, 255, 255, 0.75)',
                  boxShadow: isSelected ? `0 6px 18px ${c.accent}35` : '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    fontFamily: "'Cinzel', serif",
                    color: c.accent
                  }}
                >
                  {c.numeral}
                </span>
                <span style={{ fontSize: '13px' }}>{c.seal}</span>
                <span style={{ fontSize: '11.5px', fontWeight: isSelected ? 700 : 600, color: '#38254E' }}>
                  {c.theme}
                </span>
                {isDiscovered && <Star size={11} color="#D4AF37" fill="#D4AF37" />}
              </motion.button>
            );
          })}
        </div>

        {/* Interactive Keepsake Card Container */}
        <div style={{ perspective: '1000px', maxWidth: '520px', margin: '0 auto 16px' }}>
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              /* CARD FRONT */
              <motion.div
                key={`front-${currentCard.id}`}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  background: `linear-gradient(135deg, ${currentCard.color} 0%, #FFFFFF 60%, ${currentCard.color} 100%)`,
                  border: `2px solid ${currentCard.accent}`,
                  borderRadius: '22px',
                  padding: '26px 22px',
                  boxShadow: `0 14px 34px ${currentCard.accent}25, 0 0 20px rgba(212, 175, 55, 0.15)`,
                  position: 'relative',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative Gold Filigree Corner Accents */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '12px',
                    fontSize: '10px',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 800,
                    color: currentCard.accent,
                    letterSpacing: '0.1em'
                  }}
                >
                  KEEPSAKE CARD № {currentCard.numeral}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    fontSize: '9px',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    color: currentCard.accent,
                    border: `1px dashed ${currentCard.accent}60`,
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}
                >
                  SPECIAL DISPATCH
                </div>

                {/* Center Medallion */}
                <div style={{ margin: '30px auto 16px' }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 35%, #FFF6D0 0%, ${currentCard.accent} 70%, #301705 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFDF9',
                      fontSize: '28px',
                      margin: '0 auto 12px',
                      boxShadow: `0 8px 20px ${currentCard.accent}40, 0 0 16px rgba(212, 175, 55, 0.3)`,
                      border: '2px solid rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <span>{currentCard.seal}</span>
                  </motion.div>

                  <h4
                    className="font-serif-luxury"
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#34224C',
                      margin: '0 0 6px'
                    }}
                  >
                    {currentCard.title}
                  </h4>

                  <p
                    style={{
                      fontSize: '13px',
                      fontStyle: 'italic',
                      color: currentCard.accent,
                      fontWeight: 600,
                      margin: 0
                    }}
                  >
                    “{currentCard.motto}”
                  </p>
                </div>

                {/* Bottom Prompt: Click to Flip */}
                <button
                  onClick={handleFlipCard}
                  className="btn-gold-luxury"
                  style={{
                    fontSize: '12px',
                    padding: '9px 20px',
                    margin: '12px auto 0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Tap to Flip & Read Secret Thought</span>
                </button>
              </motion.div>
            ) : (
              /* CARD BACK (REVEALED THOUGHT & INTERACTIVE EXPERIENCE) */
              <motion.div
                key={`back-${currentCard.id}`}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  background: '#FFFEFB',
                  border: `2px solid ${currentCard.accent}`,
                  borderRadius: '22px',
                  padding: '24px 20px',
                  boxShadow: `0 14px 34px ${currentCard.accent}25`,
                  position: 'relative',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span
                    className="font-cinzel"
                    style={{ fontSize: '11px', fontWeight: 800, color: currentCard.accent, letterSpacing: '0.08em' }}
                  >
                    {currentCard.numeral} • {currentCard.title}
                  </span>
                  <button
                    onClick={handleFlipCard}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentCard.accent,
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Flip Front</span>
                  </button>
                </div>

                {/* Main Evocative Quote */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${currentCard.color} 0%, #FFFFFF 100%)`,
                    borderRadius: '14px',
                    padding: '16px 18px',
                    border: `1px solid ${currentCard.goldTrim}60`,
                    marginBottom: '12px'
                  }}
                >
                  <p
                    className="font-cormorant"
                    style={{
                      fontSize: '18px',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#34224C',
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    “{currentCard.quote}”
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6E5D84',
                      fontStyle: 'italic',
                      marginTop: '8px',
                      marginBottom: 0,
                      borderTop: `1px dashed ${currentCard.goldTrim}50`,
                      paddingTop: '6px'
                    }}
                  >
                    ✦ {currentCard.note}
                  </p>
                </div>

                {/* UNIQUE INTERACTIVE FEATURE FOR EACH CARD */}

                {/* Card 1: Spontaneous Sparks Generator */}
                {currentCard.interactionType === 'sparks' && (
                  <div style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        background: '#FFF5F8',
                        border: '1px solid #E5A9B8',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '8px'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#C97A8F', display: 'block', marginBottom: '3px' }}>
                        SPONTANEOUS SPARK #{sparkIndex + 1}
                      </span>
                      <p style={{ fontSize: '13px', color: '#38254E', margin: 0, lineHeight: 1.45 }}>
                        {currentCard.sparksList[sparkIndex]}
                      </p>
                    </div>
                    <button
                      onClick={handleNextSpark}
                      className="btn-gold-luxury"
                      style={{ fontSize: '11.5px', padding: '7px 16px', width: '100%', justifyContent: 'center' }}
                    >
                      <Sparkles size={13} />
                      <span>Tap to Spark Another Thought ✦</span>
                    </button>
                  </div>
                )}

                {/* Card 2: Tangent Level Selector */}
                {currentCard.interactionType === 'tangents' && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {currentCard.tangentLevels.map((lvl, lIdx) => (
                        <button
                          key={lIdx}
                          onClick={() => handleSelectTangent(lIdx)}
                          style={{
                            flex: 1,
                            padding: '6px 4px',
                            borderRadius: '10px',
                            border: tangentLevelIndex === lIdx ? '1.5px solid #7B5E99' : '1px solid #D6C8E8',
                            background: tangentLevelIndex === lIdx ? '#7B5E99' : '#FFFFFF',
                            color: tangentLevelIndex === lIdx ? '#FFFFFF' : '#5C3E78',
                            fontWeight: 700,
                            fontSize: '10.5px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {lvl.badge}
                        </button>
                      ))}
                    </div>
                    <div
                      style={{
                        background: '#F8F3FC',
                        border: '1px solid #7B5E9940',
                        borderRadius: '12px',
                        padding: '10px 12px'
                      }}
                    >
                      <strong style={{ fontSize: '12px', color: '#5C3E78', display: 'block', marginBottom: '2px' }}>
                        {currentCard.tangentLevels[tangentLevelIndex].label}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#4E3A68' }}>
                        {currentCard.tangentLevels[tangentLevelIndex].desc}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card 3: Quiet Comfort Dispenser */}
                {currentCard.interactionType === 'comfort' && (
                  <div style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        background: '#FFFDF4',
                        border: '1px solid #D4AF3780',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '8px'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#B58A38', display: 'block', marginBottom: '3px' }}>
                        SANCTUARY CHECK-IN
                      </span>
                      <p style={{ fontSize: '13px', color: '#44321A', margin: 0, lineHeight: 1.45 }}>
                        {currentCard.comfortMessages[comfortMessageIndex]}
                      </p>
                    </div>
                    <button
                      onClick={handleBrewComfort}
                      className="btn-gold-luxury"
                      style={{ fontSize: '11.5px', padding: '7px 16px', width: '100%', justifyContent: 'center' }}
                    >
                      <Coffee size={13} />
                      <span>{isComfortBrewed ? 'Dispense Another Comfort Note ☕' : 'Pour a Cup of Calm ☕'}</span>
                    </button>
                  </div>
                )}

                {/* Card 4: Commander Seal Stamp */}
                {currentCard.interactionType === 'stamp' && (
                  <div style={{ marginBottom: '10px' }}>
                    {!isStamped ? (
                      <button
                        onClick={handleApplyStamp}
                        className="btn-gold-luxury"
                        style={{ fontSize: '12px', padding: '9px 18px', width: '100%', justifyContent: 'center' }}
                      >
                        <Award size={14} />
                        <span>⚡ Affix Commander Seal of Approval</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, rotate: -3 }}
                        animate={{ scale: 1, rotate: 0 }}
                        style={{
                          background: 'linear-gradient(135deg, #FAF0F8 0%, #FFFFFF 100%)',
                          border: '2px solid #8B4789',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ color: '#8B4789', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>
                          ★ {currentCard.stampDetails.sealName} ★
                        </div>
                        <strong style={{ fontSize: '12.5px', color: '#4E2452', display: 'block', margin: '2px 0' }}>
                          {currentCard.stampDetails.verdict}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#7E4D82' }}>
                          {currentCard.stampDetails.subnote}
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Card 5: Starlight Wish Release */}
                {currentCard.interactionType === 'wish' && (
                  <div style={{ marginBottom: '10px' }}>
                    {!isWishReleased ? (
                      <button
                        onClick={handleReleaseWish}
                        className="btn-gold-luxury"
                        style={{ fontSize: '12px', padding: '9px 18px', width: '100%', justifyContent: 'center' }}
                      >
                        <Sparkles size={14} />
                        <span>🌟 Release Golden Starlight Wish</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          background: 'linear-gradient(135deg, #FFF9EA 0%, #FAF0D8 100%)',
                          border: '2px solid #D4AF37',
                          borderRadius: '12px',
                          padding: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <p style={{ fontSize: '12.5px', fontStyle: 'italic', fontWeight: 700, color: '#44321A', margin: '0 0 6px' }}>
                          “{currentCard.wishQuote}”
                        </p>
                        <div
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            color: '#8C6716',
                            fontFamily: "'Cinzel', serif"
                          }}
                        >
                          {currentCard.wishBanner}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Carousel Prev/Next & Bottom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '520px', margin: '0 auto' }}>
          <button
            onClick={handlePrev}
            className="btn-lavender-luxury"
            style={{ fontSize: '12px', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={14} />
            <span>Prev Card</span>
          </button>

          <button
            onClick={handleFlipCard}
            style={{
              background: 'none',
              border: 'none',
              color: '#7B5E99',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'underline'
            }}
          >
            <RotateCcw size={13} />
            <span>{isFlipped ? 'View Front Cover' : 'View Secret Thought'}</span>
          </button>

          <button
            onClick={handleNext}
            className="btn-lavender-luxury"
            style={{ fontSize: '12px', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Next Card</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
