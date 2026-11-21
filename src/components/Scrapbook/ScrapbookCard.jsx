import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, ArrowLeft, Trash2 } from 'lucide-react';
import { MemoryIllustration } from './MemoryIllustrations';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';

export const ScrapbookCard = ({ memory, customPhoto, onCustomPhotoChange, onDeletePhoto, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    soundManager.playButtonClick();
    setIsOpen(true);
  };

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundManager.playButtonClick();
    setIsOpen(false);
  };

  // Support Escape key to close modal
  useEscapeKey(handleClose, isOpen);

  const currentPhoto = customPhoto || memory.customPhoto;

  return (
    <>
      {/* Scrapbook Polaroid Card in Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        whileHover={{ y: -8, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
        onClick={handleCardClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          background: '#FFFDF9',
          borderRadius: '16px',
          padding: '16px 16px 22px',
          boxShadow: isHovered
            ? '0 20px 45px rgba(74, 53, 104, 0.18)'
            : '0 10px 30px rgba(74, 53, 104, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
        }}
      >
        {/* Washi Tape Strip at top */}
        <div
          className="washi-tape"
          style={{
            background: index % 2 === 0 ? 'rgba(230, 215, 250, 0.75)' : 'rgba(248, 220, 230, 0.75)',
            border: '1px dashed rgba(123, 94, 153, 0.2)'
          }}
        />

        {/* Golden Pin/Paperclip */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '18px',
            width: '10px',
            height: '22px',
            borderRadius: '6px',
            border: '2px solid #D4AF37',
            transform: 'rotate(20deg)',
            opacity: 0.7
          }}
        />

        {/* Polaroid Photo Frame */}
        <div
          style={{
            width: '100%',
            height: '240px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#F5F0EB',
            position: 'relative',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt={memory.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
            />
          ) : (
            <MemoryIllustration type={memory.svgIllustration} color={memory.themeColor} />
          )}

          {/* Card Number Badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(43, 31, 58, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#FFF7DB',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: "'Cinzel', serif",
              border: '1px solid rgba(212, 175, 55, 0.4)'
            }}
          >
            CARD {memory.cardNumber}
          </div>

          {/* Badge Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(255, 253, 249, 0.92)',
              color: '#5C3E78',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {memory.badge}
          </div>
        </div>

        {/* Polaroid Bottom Caption area */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <h3
            className="font-cinzel"
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#38254E',
              letterSpacing: '0.06em',
              marginBottom: '4px'
            }}
          >
            {memory.title}
          </h3>

          <p
            className="font-handwriting"
            style={{
              fontSize: '18px',
              color: '#7B5E99',
              lineHeight: 1.25,
              marginBottom: '10px'
            }}
          >
            “{memory.tagline}”
          </p>

          <span
            style={{
              fontSize: '11px',
              color: '#A090B4',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <Sparkles size={12} color="#D4AF37" />
            Click to read reflection
          </span>
        </div>
      </motion.div>

      {/* Expanded Modal View for Card */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(38, 25, 52, 0.68)',
              backdropFilter: 'blur(8px)',
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFDF9',
                borderRadius: '24px',
                maxWidth: '740px',
                width: '95%',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '1.5px solid rgba(212, 175, 55, 0.55)',
                position: 'relative',
                padding: '32px'
              }}
            >
              {/* Universal Close Button */}
              <CloseButton onClose={handleClose} variant="gold" top="18px" right="18px" ariaLabel={`Close ${memory.title}`} />

              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingRight: '45px' }}>
                <span
                  className="font-cinzel"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#D4AF37',
                    background: 'rgba(212, 175, 55, 0.12)',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}
                >
                  CARD {memory.cardNumber} • {memory.badge}
                </span>
                <span style={{ fontSize: '12px', color: '#8A7A9E' }}>
                  {memory.stampText}
                </span>
              </div>

              {/* Title & Tagline */}
              <h2
                className="font-serif-luxury"
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#34224C',
                  marginBottom: '6px',
                  paddingRight: '45px'
                }}
              >
                {memory.title}
              </h2>

              <p
                className="font-handwriting"
                style={{
                  fontSize: '22px',
                  color: '#9E4663',
                  marginBottom: '20px',
                  paddingRight: '35px'
                }}
              >
                “{memory.tagline}”
              </p>

              {/* Image Container with upload option */}
              <div
                style={{
                  width: '100%',
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#F5EFFB',
                  position: 'relative',
                  marginBottom: '24px',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}
              >
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={memory.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <MemoryIllustration type={memory.svgIllustration} color={memory.themeColor} />
                )}

                {/* In-Browser Photo Replacement & Delete Controls */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 10
                  }}
                >
                  {/* Delete Photo Button (visible only when custom photo is active) */}
                  {currentPhoto && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this photo and restore the original illustration?')) {
                          soundManager.playButtonClick();
                          if (onDeletePhoto) onDeletePhoto(memory.id);
                        }
                      }}
                      style={{
                        background: 'rgba(168, 50, 78, 0.92)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFFDF9',
                        padding: '8px 14px',
                        borderRadius: '24px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid rgba(255, 180, 200, 0.55)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        transition: 'all 0.2s ease'
                      }}
                      title="Delete custom photo and restore illustration"
                    >
                      <Trash2 size={13} color="#FFFDF9" />
                      <span>Delete</span>
                    </button>
                  )}

                  {/* Upload / Change Photo Button */}
                  <label
                    style={{
                      background: 'rgba(43, 31, 58, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFDF9',
                      padding: '8px 14px',
                      borderRadius: '24px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(212, 175, 55, 0.55)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      transition: 'all 0.2s ease'
                    }}
                    title="Upload a photo from your device"
                  >
                    <Camera size={13} color="#D4AF37" />
                    <span>{currentPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          soundManager.playButtonClick();
                          if (onCustomPhotoChange) {
                            await onCustomPhotoChange(memory.id, file);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Extended Story / Reflection */}
              <div
                style={{
                  background: 'rgba(247, 243, 252, 0.7)',
                  borderRadius: '16px',
                  padding: '20px',
                  borderLeft: '4px solid #7B5E99',
                  marginBottom: '20px'
                }}
              >
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#7B5E99',
                    marginBottom: '8px'
                  }}
                >
                  Commander Archive Reflection
                </h4>
                <p style={{ fontSize: '15px', color: '#443555', lineHeight: 1.65 }}>
                  {memory.reflection}
                </p>
              </div>

              {/* Tactical Detail Note */}
              <div
                style={{
                  background: 'rgba(255, 248, 230, 0.8)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px dashed rgba(212, 175, 55, 0.5)',
                  fontSize: '13px',
                  color: '#7A5B15',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Sparkles size={16} color="#D4AF37" />
                <span>{memory.detailNote}</span>
              </div>

              {/* Bottom Back / Close Button */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleClose}
                  className="btn-lavender-luxury"
                  style={{ fontSize: '13px', padding: '10px 24px' }}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Scrapbook</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
