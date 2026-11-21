import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Award, Sparkles, ArrowRight, ArrowLeft, RotateCcw, Check, Crown, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizData } from '../../data/quiz';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../../components/Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';

const STORAGE_KEY = 'estelle_tactical_answers_v2';

export const QuizSection = ({ onProceedToEnvelopes }) => {
  // Store selected answers: { [qId]: { optionId: 'me' | 'commander', label: 'Me' | 'Commander', response: string, badge: string, responseIndex: number } }
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load quiz answers:', e);
    }
    return {};
  });

  // activeQuestionId: null (when viewing 5-question list) | 1..5 (when focused on a question)
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Close question view on Escape key
  useEscapeKey(() => {
    if (activeQuestionId !== null) {
      setActiveQuestionId(null);
    }
  }, activeQuestionId !== null);

  const activeQuestion = quizData.questions.find((q) => q.id === activeQuestionId);
  const currentAnswer = activeQuestionId ? selectedAnswers[activeQuestionId] : null;

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === quizData.questions.length;

  const handleSelectOption = (question, optionKey) => {
    soundManager.playQuizSuccess();

    const optData = question.options[optionKey];
    const prevAnswer = selectedAnswers[question.id];

    // Cycle response variations if user taps again, or pick first
    const nextResponseIndex =
      prevAnswer && prevAnswer.optionId === optionKey
        ? (prevAnswer.responseIndex + 1) % optData.responses.length
        : 0;

    const chosenResponse = optData.responses[nextResponseIndex];

    const updated = {
      ...selectedAnswers,
      [question.id]: {
        optionId: optionKey,
        label: optData.label,
        response: chosenResponse,
        badge: optData.badge,
        responseIndex: nextResponseIndex
      }
    };

    setSelectedAnswers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save quiz answer:', e);
    }

    // Celebratory sparkles
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#8B6FA9', '#F8D7E3', '#FFF9EA']
    });

    // If this selection completes all 5 questions, fire grand fanfare for Commander!
    if (Object.keys(updated).length === quizData.questions.length && answeredCount < quizData.questions.length) {
      setTimeout(() => {
        try { soundManager.playFanfare(); } catch {}
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.52 },
          colors: ['#D4AF37', '#FCECB9', '#9275B2', '#FFFDF9', '#E6C15E']
        });
      }, 500);
    }
  };

  const handleResetAll = () => {
    soundManager.playButtonClick();
    setSelectedAnswers({});
    setActiveQuestionId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleNextQuestion = () => {
    soundManager.playButtonClick();
    if (!activeQuestionId) return;
    const nextId = activeQuestionId >= quizData.questions.length ? 1 : activeQuestionId + 1;
    setActiveQuestionId(nextId);
  };

  const handlePrevQuestion = () => {
    soundManager.playButtonClick();
    if (!activeQuestionId) return;
    const prevId = activeQuestionId <= 1 ? quizData.questions.length : activeQuestionId - 1;
    setActiveQuestionId(prevId);
  };

  return (
    <section id="challenge" className="section-wrapper" style={{ position: 'relative' }}>
      <div className="content-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 243, 205, 0.65)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              marginBottom: '14px'
            }}
          >
            <HelpCircle size={14} color="#B38B29" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7A5B15',
                letterSpacing: '0.12em'
              }}
            >
              CHAPTER ONE • COMMANDER TACTICAL TEST
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
            Let's Test Your Commander Skills!
          </motion.h2>

          <p style={{ fontSize: '16px', color: '#6E5D84', lineHeight: 1.6, margin: 0 }}>
            Answer honestly, Commander Estelle. Every answer is classified and officially recorded!
          </p>

          {/* Progress Pill Bar */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '16px',
              background: 'rgba(255, 253, 249, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '999px',
              padding: '6px 18px',
              boxShadow: '0 4px 14px rgba(74, 53, 104, 0.08)'
            }}
          >
            <Sparkles size={13} color="#D4AF37" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.10em',
                color: '#5C3E78'
              }}
            >
              QUESTIONS ANSWERED: {answeredCount} / {quizData.questions.length}
            </span>

            {/* 5 Indicator Dots */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {quizData.questions.map((q) => {
                const isAnswered = !!selectedAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    title={`Question ${q.id}: ${isAnswered ? `Winner: Commander (Picked: ${selectedAnswers[q.id].label})` : 'Unanswered'}`}
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: isAnswered
                        ? 'linear-gradient(135deg, #D4AF37 0%, #FFE89E 100%)'
                        : 'rgba(123, 94, 153, 0.22)',
                      boxShadow: isAnswered ? '0 0 6px rgba(212, 175, 55, 0.6)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= MAIN INTERACTION AREA ================= */}
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {/* VIEW 1: THE FIVE QUESTIONS IN QUESTION-CARD FORMAT */}
            {activeQuestionId === null ? (
              <motion.div
                key="question-list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.32 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {quizData.questions.map((q, idx) => {
                  const ans = selectedAnswers[q.id];
                  const isAnswered = !!ans;

                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.4 }}
                      whileHover={{ scale: 1.015, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        soundManager.playButtonClick();
                        setActiveQuestionId(q.id);
                      }}
                      className="parchment-card"
                      style={{
                        padding: '24px 26px',
                        cursor: 'pointer',
                        background: isAnswered
                          ? 'linear-gradient(135deg, #FFFDF9 0%, #FCF8F0 50%, #FAF4E6 100%)'
                          : '#FFFDF9',
                        border: isAnswered
                          ? '2px solid rgba(212, 175, 55, 0.65)'
                          : '1.5px solid rgba(123, 94, 153, 0.22)',
                        boxShadow: isAnswered
                          ? '0 10px 28px rgba(212, 175, 55, 0.18)'
                          : '0 6px 20px rgba(74, 53, 104, 0.08)',
                        borderRadius: '20px',
                        position: 'relative',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {/* Top Bar inside card */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="font-cinzel"
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              letterSpacing: '0.14em',
                              color: isAnswered ? '#96741F' : '#7B5E99',
                              background: isAnswered
                                ? 'rgba(212, 175, 55, 0.15)'
                                : 'rgba(123, 94, 153, 0.10)',
                              padding: '3px 10px',
                              borderRadius: '999px'
                            }}
                          >
                            QUESTION {q.number}
                          </span>
                        </div>

                        {/* Status Badge: Always shows Winner: Commander! */}
                        {isAnswered ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'linear-gradient(135deg, #FFFDF5 0%, #FDF3D6 100%)',
                              border: '1.5px solid #D4AF37',
                              borderRadius: '999px',
                              padding: '3px 12px',
                              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)'
                            }}
                          >
                            <Crown size={12} color="#D4AF37" />
                            <span
                              className="font-cinzel"
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: '#5C4410',
                                letterSpacing: '0.06em'
                              }}
                            >
                              Winner: Commander 🏆
                            </span>
                            <span style={{ fontSize: '10px', color: '#8A6A1E', fontStyle: 'italic' }}>
                              ({ans.label})
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: '11.5px',
                              color: '#8A7A9E',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600
                            }}
                          >
                            <span>Tap to decide</span>
                            <ArrowRight size={13} color="#9275B2" />
                          </span>
                        )}
                      </div>

                      {/* Question Text with Exact Wording and Emojis */}
                      <h3
                        className="font-serif-luxury"
                        style={{
                          fontSize: '19.5px',
                          fontWeight: 700,
                          color: '#34224C',
                          lineHeight: 1.38,
                          margin: 0
                        }}
                      >
                        {q.question}
                      </h3>

                      {/* If Answered: Preview of funny playful response */}
                      {isAnswered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{
                            marginTop: '14px',
                            paddingTop: '12px',
                            borderTop: '1px dashed rgba(212, 175, 55, 0.35)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <Sparkles size={15} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '13.5px',
                                color: '#5C4410',
                                fontStyle: 'italic',
                                lineHeight: 1.45
                              }}
                            >
                              “{ans.response}”
                            </p>
                            <span
                              style={{
                                fontSize: '10.5px',
                                color: '#96741F',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                display: 'inline-block',
                                marginTop: '4px'
                              }}
                            >
                              Tap to re-test / view more reactions →
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                {/* ================= FINAL REVEAL (ALL 5 QUESTIONS ANSWERED) ================= */}
                {isAllAnswered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="parchment-card"
                    style={{
                      padding: '40px 32px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF8EA 45%, #FDF1D5 100%)',
                      border: '2.5px solid #D4AF37',
                      boxShadow: '0 20px 60px rgba(212, 175, 55, 0.28), 0 0 30px rgba(212, 175, 55, 0.2)',
                      borderRadius: '26px',
                      marginTop: '12px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Golden Trophy Icon with Glow */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, #FFF1B0 0%, #D4AF37 55%, #99741B 100%)',
                        margin: '0 auto 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFDF9',
                        boxShadow: '0 10px 30px rgba(212, 175, 55, 0.45), 0 0 20px rgba(212, 175, 55, 0.35)'
                      }}
                    >
                      <Award size={40} />
                    </motion.div>

                    {/* Header badge */}
                    <div
                      className="font-cinzel"
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        letterSpacing: '0.22em',
                        color: '#B38B29',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}
                    >
                      <span>✦</span>
                      <span>{quizData.finalVerdict.badge}</span>
                      <span>✦</span>
                    </div>

                    {/* Main Verdict Headline */}
                    <h3
                      className="font-serif-luxury"
                      style={{
                        fontSize: 'clamp(26px, 4vw, 34px)',
                        fontWeight: 800,
                        color: '#34224C',
                        marginBottom: '10px',
                        lineHeight: 1.25
                      }}
                    >
                      {quizData.finalVerdict.title}
                    </h3>

                    {/* Subtext */}
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#5C3E78',
                        fontWeight: 600,
                        maxWidth: '560px',
                        margin: '0 auto 20px',
                        lineHeight: 1.5
                      }}
                    >
                      {quizData.finalVerdict.subtext}
                    </p>

                    {/* Climax Quote Card */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        border: '1.5px solid rgba(212, 175, 55, 0.45)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        maxWidth: '560px',
                        margin: '0 auto 26px',
                        boxShadow: '0 6px 20px rgba(212, 175, 55, 0.12)'
                      }}
                    >
                      <p
                        className="font-cormorant"
                        style={{
                          margin: 0,
                          fontSize: '20px',
                          fontStyle: 'italic',
                          fontWeight: 700,
                          color: '#44321A',
                          lineHeight: 1.45
                        }}
                      >
                        {quizData.finalVerdict.quote}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <button onClick={handleResetAll} className="btn-lavender-luxury" style={{ fontSize: '12px', padding: '10px 22px' }}>
                        <RotateCcw size={14} />
                        <span>Play Again / Retake Test</span>
                      </button>

                      <a
                        href="#envelopes"
                        onClick={(e) => {
                          if (onProceedToEnvelopes) {
                            e.preventDefault();
                            onProceedToEnvelopes();
                          }
                        }}
                        className="btn-gold-luxury"
                        style={{ textDecoration: 'none', fontSize: '12.5px', padding: '10px 24px' }}
                      >
                        <span>Proceed to 10 Envelopes</span>
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* VIEW 2: ACTIVE QUESTION INTERACTIVE CARD (WITH 'ME' & 'COMMANDER' OPTIONS) */
              activeQuestion && (
                <motion.div
                  key={`question-focus-${activeQuestion.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -16 }}
                  transition={{ duration: 0.32 }}
                  className="parchment-card"
                  style={{
                    padding: '36px 30px',
                    position: 'relative',
                    borderRadius: '24px',
                    border: '2px solid rgba(212, 175, 55, 0.55)',
                    boxShadow: '0 20px 50px rgba(74, 53, 104, 0.14)'
                  }}
                >
                  {/* Universal Close Button pinned to top-right of question card */}
                  <CloseButton
                    onClose={() => {
                      soundManager.playButtonClick();
                      setActiveQuestionId(null);
                    }}
                    variant="gold"
                    top="18px"
                    right="18px"
                    ariaLabel="Return to question list"
                  />

                  {/* Top Header Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                      borderBottom: '1px dashed rgba(212, 175, 55, 0.35)',
                      paddingBottom: '14px',
                      paddingRight: '48px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <button
                      onClick={() => {
                        soundManager.playButtonClick();
                        setActiveQuestionId(null);
                      }}
                      className="btn-glass"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#5C3E78',
                        background: 'rgba(123, 94, 153, 0.1)',
                        border: '1px solid rgba(123, 94, 153, 0.25)',
                        borderRadius: '999px',
                        cursor: 'pointer'
                      }}
                      title="Return to all five questions"
                    >
                      <ArrowLeft size={13} color="#7B5E99" />
                      <span>All 5 Questions</span>
                    </button>

                    <span
                      className="font-cinzel"
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: '#B38B29'
                      }}
                    >
                      QUESTION {activeQuestion.number} OF 05
                    </span>
                  </div>

                  {/* The Exact Question Text */}
                  <h3
                    className="font-serif-luxury"
                    style={{
                      fontSize: 'clamp(21px, 3.2vw, 25px)',
                      fontWeight: 700,
                      color: '#34224C',
                      lineHeight: 1.35,
                      marginBottom: '26px',
                      textAlign: 'center'
                    }}
                  >
                    {activeQuestion.question}
                  </h3>

                  {/* Instruction Prompt */}
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <span
                      className="font-cinzel"
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        letterSpacing: '0.18em',
                        color: '#96741F'
                      }}
                    >
                      ✦ SELECT YOUR CANDIDATE ✦
                    </span>
                  </div>

                  {/* TWO CLICKABLE OPTIONS: ME & COMMANDER */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                      marginBottom: '22px'
                    }}
                  >
                    {/* OPTION 1: ME */}
                    {(() => {
                      const opt = activeQuestion.options.me;
                      const isSelected = currentAnswer?.optionId === 'me';

                      return (
                        <motion.button
                          type="button"
                          onClick={() => handleSelectOption(activeQuestion, 'me')}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #F8F2FC 0%, #EDE0F7 100%)'
                              : 'linear-gradient(135deg, #FFFDF9 0%, #FBF7F0 100%)',
                            border: isSelected
                              ? '2.5px solid #7B5E99'
                              : '1.5px solid rgba(123, 94, 153, 0.28)',
                            borderRadius: '18px',
                            padding: '20px 22px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isSelected
                              ? '0 8px 24px rgba(123, 94, 153, 0.25), 0 0 12px rgba(123, 94, 153, 0.2)'
                              : '0 4px 14px rgba(74, 53, 104, 0.06)',
                            position: 'relative',
                            transition: 'all 0.25s ease'
                          }}
                          aria-pressed={isSelected}
                        >
                          {/* Selection Checkmark */}
                          {isSelected && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '12px',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#7B5E99',
                                color: '#FFFDF9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(123, 94, 153, 0.4)'
                              }}
                            >
                              <Check size={13} strokeWidth={3} />
                            </span>
                          )}

                          <span
                            className="font-serif-luxury"
                            style={{
                              fontSize: '28px',
                              fontWeight: 800,
                              color: isSelected ? '#3B1F58' : '#34224C',
                              letterSpacing: '0.04em'
                            }}
                          >
                            Me
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              color: isSelected ? '#5C3E78' : '#8A7A9E',
                              fontWeight: 600
                            }}
                          >
                            {opt.subtitle}
                          </span>
                        </motion.button>
                      );
                    })()}

                    {/* OPTION 2: COMMANDER */}
                    {(() => {
                      const opt = activeQuestion.options.commander;
                      const isSelected = currentAnswer?.optionId === 'commander';

                      return (
                        <motion.button
                          type="button"
                          onClick={() => handleSelectOption(activeQuestion, 'commander')}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #FFF8E6 0%, #FCECB9 100%)'
                              : 'linear-gradient(135deg, #FFFDF9 0%, #FBF7F0 100%)',
                            border: isSelected
                              ? '2.5px solid #D4AF37'
                              : '1.5px solid rgba(212, 175, 55, 0.35)',
                            borderRadius: '18px',
                            padding: '20px 22px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isSelected
                              ? '0 8px 24px rgba(212, 175, 55, 0.35), 0 0 14px rgba(212, 175, 55, 0.25)'
                              : '0 4px 14px rgba(74, 53, 104, 0.06)',
                            position: 'relative',
                            transition: 'all 0.25s ease'
                          }}
                          aria-pressed={isSelected}
                        >
                          {/* Selection Crown & Checkmark */}
                          {isSelected && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '12px',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#D4AF37',
                                color: '#2E1903',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.45)'
                              }}
                            >
                              <Crown size={13} strokeWidth={2.5} />
                            </span>
                          )}

                          <span
                            className="font-serif-luxury"
                            style={{
                              fontSize: '28px',
                              fontWeight: 800,
                              color: isSelected ? '#5C4410' : '#34224C',
                              letterSpacing: '0.04em'
                            }}
                          >
                            Commander
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              color: isSelected ? '#8A6A1E' : '#8A7A9E',
                              fontWeight: 600
                            }}
                          >
                            {opt.subtitle}
                          </span>
                        </motion.button>
                      );
                    })()}
                  </div>

                  {/* INSTANT PLAYFUL HUMOROUS RESPONSE - ALWAYS PROCLAIMING COMMANDER AS WINNER */}
                  <AnimatePresence mode="wait">
                    {currentAnswer && (
                      <motion.div
                        key={`${activeQuestion.id}-${currentAnswer.optionId}-${currentAnswer.responseIndex}`}
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF8EA 100%)',
                          border: '1.5px solid rgba(212, 175, 55, 0.55)',
                          borderRadius: '16px',
                          padding: '18px 22px',
                          boxShadow: '0 8px 22px rgba(212, 175, 55, 0.16)',
                          marginBottom: '24px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px'
                          }}
                        >
                          <Crown size={15} color="#D4AF37" />
                          <span
                            className="font-cinzel"
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              letterSpacing: '0.12em',
                              color: '#96741F'
                            }}
                          >
                            OFFICIAL VERDICT • WINNER: COMMANDER! 🏆
                          </span>
                        </div>

                        <p
                          className="font-cormorant"
                          style={{
                            margin: 0,
                            fontSize: '19px',
                            color: '#44321A',
                            lineHeight: 1.5,
                            fontStyle: 'italic',
                            fontWeight: 600
                          }}
                        >
                          “{currentAnswer.response}”
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            paddingTop: '8px',
                            borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
                            fontSize: '11px',
                            color: '#9C7A28',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>✦ Tactical Role: {currentAnswer.badge}</span>
                          <span style={{ fontStyle: 'italic' }}>Tap option again for more funny commentary</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BOTTOM ACTION BAR: RETURN TO LIST & QUESTION CYCLING */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(123, 94, 153, 0.15)'
                    }}
                  >
                    {/* Return to 5-Question List Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setActiveQuestionId(null);
                      }}
                      className="btn-lavender-luxury"
                      style={{
                        padding: '10px 22px',
                        fontSize: '12.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <ArrowLeft size={14} />
                      <span>Return to 5-Question List</span>
                    </button>

                    {/* Next / Previous cycling */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handlePrevQuestion}
                        className="btn-glass"
                        style={{
                          padding: '8px 16px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#5C3E78',
                          background: 'rgba(123, 94, 153, 0.1)',
                          border: '1px solid rgba(123, 94, 153, 0.25)',
                          borderRadius: '999px',
                          cursor: 'pointer'
                        }}
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="btn-gold-luxury"
                        style={{
                          padding: '8px 18px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>Next Question</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
