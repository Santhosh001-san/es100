import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';

export const CloseButton = ({
  onClose,
  ariaLabel = 'Close window',
  style = {},
  variant = 'gold', // 'gold' | 'dark-gold' | 'lavender' | 'white'
  size = 20,
  top = '16px',
  right = '16px',
  isAbsolute = true,
  isFixed = false,
  isSticky = false
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    try {
      soundManager.playButtonClick();
    } catch {
      // audio gracefully handled
    }
    if (onClose) onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return {
          background: 'rgba(255, 255, 255, 0.98)',
          border: '2px solid rgba(123, 94, 153, 0.45)',
          color: '#341E4C',
          boxShadow: '0 6px 20px rgba(74, 53, 104, 0.22)'
        };
      case 'dark-gold':
        return {
          background: 'rgba(26, 12, 42, 0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid #D4AF37',
          color: '#FFE89E',
          boxShadow: '0 6px 22px rgba(0, 0, 0, 0.55), 0 0 16px rgba(212, 175, 55, 0.4)'
        };
      case 'lavender':
        return {
          background: 'rgba(244, 238, 252, 0.98)',
          border: '2px solid rgba(123, 94, 153, 0.45)',
          color: '#492E66',
          boxShadow: '0 6px 20px rgba(74, 53, 104, 0.2)'
        };
      case 'gold':
      default:
        return {
          background: 'linear-gradient(135deg, #FFFDF6 0%, #FCECB9 45%, #E5BE53 100%)',
          border: '2px solid #D4AF37',
          color: '#2E1903',
          boxShadow: '0 6px 22px rgba(0, 0, 0, 0.42), 0 0 16px rgba(212, 175, 55, 0.48)'
        };
    }
  };

  const variantStyles = getVariantStyles();

  if (isSticky) {
    const stickyTop = style.top || top || '12px';
    const stickyRight = style.right || right || '12px';
    return (
      <div
        style={{
          position: 'sticky',
          top: stickyTop,
          zIndex: style.zIndex || 1700,
          display: 'flex',
          justifyContent: 'flex-end',
          height: 0,
          overflow: 'visible',
          pointerEvents: 'none',
          width: '100%',
          marginBottom: 0
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            marginRight: `max(0px, calc(${stickyRight} - 12px))`,
            marginTop: '-6px'
          }}
        >
          <motion.button
            type="button"
            onClick={handleClick}
            aria-label={ariaLabel}
            title="Close (or press Esc)"
            whileHover={{ scale: 1.14, rotate: 90 }}
            whileTap={{ scale: 0.90 }}
            transition={{ type: 'spring', damping: 15, stiffness: 350 }}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              minWidth: '42px',
              minHeight: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              touchAction: 'manipulation',
              outline: 'none',
              ...variantStyles,
              ...style,
              top: undefined,
              right: undefined
            }}
          >
            <X size={size} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    );
  }

  const positionMode = style.position || (isFixed ? 'fixed' : isAbsolute ? 'absolute' : 'relative');

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      title="Close (or press Esc)"
      whileHover={{ scale: 1.14, rotate: 90 }}
      whileTap={{ scale: 0.90 }}
      transition={{ type: 'spring', damping: 15, stiffness: 350 }}
      style={{
        position: positionMode,
        top: positionMode !== 'relative' ? (style.top || top) : undefined,
        right: positionMode !== 'relative' ? (style.right || right) : undefined,
        width: '42px',
        height: '42px',
        minWidth: '42px',
        minHeight: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        zIndex: style.zIndex || 1700,
        touchAction: 'manipulation',
        outline: 'none',
        ...variantStyles,
        ...style
      }}
    >
      <X size={size} strokeWidth={2.5} />
    </motion.button>
  );
};
