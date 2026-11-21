import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Award, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';

export const SurpriseEnvelope = ({ envelope, isOpened, onOpen, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Special Interactive States
  const [isAwardRevealed, setIsAwardRevealed] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [activeTokenDay, setActiveTokenDay] = useState(null);
  const [isFinalIlluminated, setIsFinalIlluminated] = useState(false);

  const handleClick = () => {
    if (!isOpened) {
      soundManager.playEnvelopeOpen();
      onOpen(envelope.id);
    } else {
      soundManager.playButtonClick();
    }
    setIsModalOpen(true);
  };

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundManager.playButtonClick();
    setIsModalOpen(false);
  };

  useEscapeKey(handleClose, isModalOpen);

  // Envelope tone styling
  const getToneStyle = (tone) => {
    switch (tone) {
      case 'plum':
        return {
          bg: 'linear-gradient(135deg, #F8EEFA 0%, #EFE1F5 100%)',
          border: '1.5px solid rgba(132, 94, 194, 0.35)',
          shadow: 'rgba(92, 53, 140, 0.16)',
          accent: '#734B9C',
          pocketFold: 'rgba(132, 94, 194, 0.12)'
        };
      case 'blush':
        return {
          bg: 'linear-gradient(135deg, #FFF1F5 0%, #FCE2E9 100%)',
          border: '1.5px solid rgba(217, 125, 149, 0.35)',
          shadow: 'rgba(217, 125, 149, 0.16)',
          accent: '#A84C66',
          pocketFold: 'rgba(217, 125, 149, 0.12)'
        };
      case 'ivory':
        return {
          bg: 'linear-gradient(135deg, #FFFCF5 0%, #F8F1E2 100%)',
          border: '1.5px solid rgba(181, 138, 56, 0.35)',
          shadow: 'rgba(181, 138, 56, 0.16)',
          accent: '#96741F',
          pocketFold: 'rgba(181, 138, 56, 0.12)'
        };
      case 'champagne':
        return {
          bg: 'linear-gradient(135deg, #FFF9EA 0%, #FDF1D5 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          shadow: 'rgba(212, 175, 55, 0.20)',
          accent: '#A67C1E',
          pocketFold: 'rgba(212, 175, 55, 0.14)'
        };
      case 'gold':
        return {
          bg: 'linear-gradient(135deg, #FFF7E3 0%, #FBEBCA 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.55)',
          shadow: 'rgba(212, 175, 55, 0.25)',
          accent: '#9E741B',
          pocketFold: 'rgba(212, 175, 55, 0.18)'
        };
      case 'lavender':
      default:
        return {
          bg: 'linear-gradient(135deg, #F8F3FC 0%, #EFE5FA 100%)',
          border: '1.5px solid rgba(123, 94, 153, 0.35)',
          shadow: 'rgba(123, 94, 153, 0.16)',
          accent: '#6E4C8E',
          pocketFold: 'rgba(123, 94, 153, 0.12)'
        };
    }
  };

  const tone = getToneStyle(envelope.envelopeTone);

  // Trigger Chaos Award Confetti
  const handleRevealAward = () => {
    soundManager.playFanfare();
    setIsAwardRevealed(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#845EC2', '#D4AF37', '#FFFDF9', '#D97D95']
    });
  };

  // Trigger Final Illumination Confetti
  const handleIlluminateFinal = () => {
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
    <>
      {/* 3D Realistic Interactive Envelope Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="envelope-card-interactive"
        style={{
          cursor: 'pointer',
          position: 'relative',
          borderRadius: '20px',
          background: tone.bg,
          border: tone.border,
          boxShadow: isOpened
            ? `0 8px 24px ${tone.shadow}, 0 2px 6px rgba(0,0,0,0.04)`
            : `0 14px 34px ${tone.shadow}, 0 0 20px rgba(212, 175, 55, 0.12)`,
          padding: '22px 18px 18px',
          minHeight: '230px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Realistic Envelope Triangular Flap Fold */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '76px',
            background: `linear-gradient(to bottom, rgba(255,255,255,0.7), ${tone.pocketFold})`,
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
            zIndex: 2,
            pointerEvents: 'none',
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Diagonal Envelope Bottom Pocket Folds */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.4), transparent)',
            clipPath: 'polygon(0% 100%, 50% 30%, 100% 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Card Header: Number Badge + Vintage Postmark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 4 }}>
          {/* Number Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: `1px solid ${tone.accent}40`,
              borderRadius: '12px',
              padding: '3px 8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: tone.accent,
                letterSpacing: '0.08em'
              }}
            >
              № {envelope.number}
            </span>
          </div>

          {/* Vintage Postmark Stamp */}
          <div
            style={{
              border: `1px dashed ${tone.accent}55`,
              borderRadius: '8px',
              padding: '2px 7px',
              fontSize: '8.5px',
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              color: tone.accent,
              letterSpacing: '0.06em',
              background: 'rgba(255,255,255,0.5)',
              transform: 'rotate(-2deg)'
            }}
          >
            {envelope.stampText}
          </div>
        </div>

        {/* Center: Wax Seal & Title */}
        <div style={{ textAlign: 'center', margin: '18px 0 10px', position: 'relative', zIndex: 4 }}>
          {/* Embossed Wax Seal */}
          <motion.div
            whileHover={{ scale: 1.12, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 32% 32%, #FFF4C2 0%, ${envelope.sealColor} 65%, #3B1E05 100%)`,
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFDF9',
              boxShadow: isOpened
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 6px 16px rgba(181, 138, 56, 0.4), 0 0 14px rgba(212, 175, 55, 0.3)',
              fontSize: '20px',
              fontFamily: "'Cinzel', serif",
              border: '2px solid rgba(255, 255, 255, 0.65)',
              position: 'relative'
            }}
          >
            {/* Wax rim relief */}
            <div
              style={{
                position: 'absolute',
                inset: '3px',
                borderRadius: '50%',
                border: '1px dashed rgba(255,255,255,0.4)',
                pointerEvents: 'none'
              }}
            />
            <span>{envelope.sealEmblem}</span>
          </motion.div>

          {/* Envelope Title */}
          <h4
            className="font-serif-luxury"
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#34224C',
              margin: '0 0 4px',
              lineHeight: 1.25
            }}
          >
            {envelope.title}
          </h4>

          {/* Category Tag */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#7B6B8E',
              display: 'block'
            }}
          >
            {envelope.category}
          </span>
        </div>

        {/* Footer: Seal Status & Tap Prompt */}
        <div
          style={{
            paddingTop: '10px',
            borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 4
          }}
        >
          {isOpened ? (
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} /> OPENED
            </span>
          ) : (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#B38B29',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} /> SEALED
            </span>
          )}

          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isOpened ? '#6A5387' : tone.accent,
              textDecoration: 'underline'
            }}
          >
            {isOpened ? 'Read Again' : 'Tap to Open'}
          </span>
        </div>
      </motion.div>

      {/* Expanded Modal showing the unfolded letter & unique interaction */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20, 10, 30, 0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFEFA',
                borderRadius: '26px',
                maxWidth: '620px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '36px 28px 28px',
                boxShadow: '0 28px 70px rgba(0,0,0,0.4), 0 0 40px rgba(212, 175, 55, 0.25)',
                border: '2px solid rgba(212, 175, 55, 0.65)',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              {/* Universal Close Button */}
              <CloseButton
                onClose={handleClose}
                variant="gold"
                top="18px"
                right="18px"
                ariaLabel={`Close Envelope ${envelope.number}`}
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
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#96741F',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: '14px'
                }}
              >
                <span>ENVELOPE {envelope.number}</span>
                <span>•</span>
                <span>{envelope.category}</span>
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
                {envelope.title}
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
                  marginBottom: '20px',
                  position: 'relative'
                }}
              >
                {/* Decorative Quote Marks */}
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
                  {envelope.message}
                </p>

                {/* Subtext Footnote */}
                {envelope.subtext && (
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

              {/* UNIQUE INTERACTIVE EXPERIENCES FOR SPECIFIC ENVELOPES */}

              {/* Envelope 04: The Chaos Award */}
              {envelope.interactiveType === 'award' && (
                <div style={{ marginBottom: '22px' }}>
                  {!isAwardRevealed ? (
                    <button
                      onClick={handleRevealAward}
                      className="btn-gold-luxury"
                      style={{ fontSize: '12.5px', padding: '10px 22px' }}
                    >
                      <Award size={15} />
                      <span>Break Seal to Reveal Official Citation</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        background: 'radial-gradient(circle at 50% 20%, #FFFDF5 0%, #F5ECFF 100%)',
                        border: '2px solid #845EC2',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        boxShadow: '0 8px 25px rgba(132, 94, 194, 0.25)',
                        textAlign: 'center'
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
                          marginBottom: '6px'
                        }}
                      >
                        <Award size={16} />
                        <span>{envelope.awardData.badge}</span>
                      </div>
                      <h4
                        className="font-serif-luxury"
                        style={{ fontSize: '18px', fontWeight: 800, color: '#34224C', margin: '4px 0' }}
                      >
                        {envelope.awardData.recipient}
                      </h4>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#A84C66', marginBottom: '8px' }}>
                        {envelope.awardData.title}
                      </p>
                      <p style={{ fontSize: '13px', color: '#4E3A68', lineHeight: 1.5, margin: 0 }}>
                        “{envelope.awardData.citation}”
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Envelope 06: The What-If Envelope */}
              {envelope.interactiveType === 'choices' && (
                <div style={{ marginBottom: '22px', textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#5C3E78',
                      display: 'block',
                      marginBottom: '10px',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    SELECT NEXT DIRECTIVE:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {envelope.choicesData.map((choice) => {
                      const isSelected = selectedChoiceId === choice.id;
                      return (
                        <div key={choice.id}>
                          <button
                            onClick={() => {
                              soundManager.playButtonClick();
                              setSelectedChoiceId(choice.id);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              border: isSelected
                                ? '1.5px solid #4B6584'
                                : '1px solid rgba(75, 101, 132, 0.25)',
                              background: isSelected
                                ? 'rgba(75, 101, 132, 0.12)'
                                : 'rgba(255, 255, 255, 0.8)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '13px', color: '#2C3A4E', display: 'block' }}>
                                {choice.label}
                              </strong>
                              <span style={{ fontSize: '11.5px', color: '#6A7B94' }}>{choice.desc}</span>
                            </div>
                            <Compass size={16} color={isSelected ? '#4B6584' : '#94A3B8'} />
                          </button>

                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{
                                background: '#F0F4F8',
                                borderLeft: '3px solid #4B6584',
                                borderRadius: '0 8px 8px 0',
                                padding: '10px 14px',
                                marginTop: '4px',
                                fontSize: '12.5px',
                                color: '#2B3E50',
                                lineHeight: 1.45
                              }}
                            >
                              ✦ {choice.response}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Envelope 08: A Little Challenge */}
              {envelope.interactiveType === 'challenge' && (
                <div style={{ marginBottom: '22px', textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#5C3E78',
                      display: 'block',
                      marginBottom: '10px',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    COMMANDER DIAGNOSTIC:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {envelope.challengeData.map((item, qIdx) => (
                      <div
                        key={item.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(139, 111, 169, 0.2)'
                        }}
                      >
                        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#38254E', margin: '0 0 8px' }}>
                          {item.question}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {item.options.map((opt, oIdx) => {
                            const isChosen = challengeAnswers[item.id] === opt.text;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  soundManager.playButtonClick();
                                  setChallengeAnswers((prev) => ({ ...prev, [item.id]: opt.text }));
                                }}
                                style={{
                                  fontSize: '11px',
                                  padding: '5px 12px',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  border: isChosen
                                    ? '1.5px solid #8B6FA9'
                                    : '1px solid rgba(139, 111, 169, 0.3)',
                                  background: isChosen ? '#8B6FA9' : '#FFFFFF',
                                  color: isChosen ? '#FFFFFF' : '#5C3E78',
                                  fontWeight: isChosen ? 700 : 500,
                                  transition: 'all 0.2s'
                                }}
                              >
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {Object.keys(challengeAnswers).length === envelope.challengeData.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: '12px',
                        background: 'linear-gradient(135deg, #FAF4FF 0%, #FFF9EB 100%)',
                        border: '1.5px solid #8B6FA9',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        textAlign: 'center'
                      }}
                    >
                      <strong style={{ fontSize: '13px', color: '#5C3E78', display: 'block', marginBottom: '4px' }}>
                        ★ Assessment Complete: Grade Commander Estelle
                      </strong>
                      <span style={{ fontSize: '12px', color: '#4E3A68' }}>
                        Diagnosis: 100% Unpredictable, highly resilient, and extraordinarily entertaining company.
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Envelope 09: The Time Capsule */}
              {envelope.interactiveType === 'timecapsule' && (
                <div style={{ marginBottom: '22px', textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#B38B29',
                      display: 'block',
                      marginBottom: '10px',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    TAP ARCHIVAL TOKENS:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {envelope.tokens.map((tok) => {
                      const isActive = activeTokenDay === tok.day;
                      return (
                        <button
                          key={tok.day}
                          onClick={() => {
                            soundManager.playButtonClick();
                            setActiveTokenDay(isActive ? null : tok.day);
                          }}
                          style={{
                            background: isActive ? '#FAF2DC' : '#FFFFFF',
                            border: isActive ? '1.5px solid #C59B27' : '1px solid rgba(197, 155, 39, 0.3)',
                            borderRadius: '10px',
                            padding: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#C59B27', display: 'block' }}>
                            {tok.day}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#38254E' }}>
                            {tok.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {activeTokenDay && (
                    <motion.div
                      key={activeTokenDay}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: '10px',
                        background: '#FFFDF5',
                        border: '1px solid rgba(197, 155, 39, 0.4)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        fontSize: '12.5px',
                        color: '#44321A',
                        lineHeight: 1.5
                      }}
                    >
                      {envelope.tokens.find((t) => t.day === activeTokenDay)?.summary}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Envelope 10: To Be Continued */}
              {envelope.interactiveType === 'celebration' && (
                <div style={{ marginBottom: '22px' }}>
                  {!isFinalIlluminated ? (
                    <button
                      onClick={handleIlluminateFinal}
                      className="btn-gold-luxury"
                      style={{ fontSize: '13px', padding: '12px 26px' }}
                    >
                      <Sparkles size={16} />
                      <span>✦ Illuminate The Road Ahead ✦</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
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
                        “{envelope.finalAnimationData.quote}”
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
                        {envelope.finalAnimationData.banner}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Action Button: Return to collection */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleClose}
                  className="btn-lavender-luxury"
                  style={{ padding: '10px 24px', fontSize: '12.5px' }}
                >
                  <span>Keep Note & Return to Envelopes</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
