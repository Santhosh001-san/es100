import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';

export const InteractiveEnvelopeCard = ({ envelope, isOpened, index, onTriggerOpen }) => {
  const cardRef = useRef(null);

  // General States
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Envelope-Specific States
  // 03: Light reflection tracking
  const [lightPos, setLightPos] = useState({ x: 110, y: 115 });
  // 05: Stardust particles
  const [stardust, setStardust] = useState([]);
  // 06: Petals
  const [petals, setPetals] = useState([]);
  // 08: Magic ripple
  const [rippleActive, setRippleActive] = useState(false);
  // 09: Spotlight tracking
  const [spotlightPos, setSpotlightPos] = useState({ x: 110, y: 115 });

  // Pointer drag tracking refs to cleanly separate DRAG from CLICK
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);

  // Tone styling
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

  // Trigger Open Sequence
  const triggerOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    // Envelope 08: Ripple animation trigger
    if (envelope.id === 8) {
      setRippleActive(true);
    }

    // Envelope 06: Petals trigger
    if (envelope.id === 6) {
      const newPetals = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        left: 20 + Math.random() * 60,
        delay: i * 0.1,
        color: i % 2 === 0 ? '#E8C5D8' : '#D97D95'
      }));
      setPetals(newPetals);
    }

    // Envelope 02: Sound and haptic
    soundManager.playEnvelopeOpen();

    // After animation plays smoothly on card, trigger full modal reveal
    const timer = setTimeout(() => {
      onTriggerOpen();
      setIsOpening(false);
      setRippleActive(false);
      setPetals([]);
    }, envelope.id === 8 ? 550 : 420);

    return () => clearTimeout(timer);
  }, [envelope.id, isOpening, onTriggerOpen]);

  // Pointer Down: Start tracking drag vs click
  const handlePointerDown = (e) => {
    // Only handle primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now()
    };
    hasMovedRef.current = false;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
  };

  // Pointer Move: Update envelope-specific physics
  const handlePointerMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      // Envelope 03: Light reflection tracking
      if (envelope.id === 3) {
        setLightPos({ x: relX, y: relY });
      }

      // Envelope 09: Spotlight tracking
      if (envelope.id === 9) {
        setSpotlightPos({ x: relX, y: relY });
      }

      // Envelope 05: Stardust emitter on pointer move
      if (envelope.id === 5) {
        if (Math.random() > 0.45 && stardust.length < 8) {
          const id = Date.now() + Math.random();
          const starChars = ['✦', '★', '✨', '•'];
          const char = starChars[Math.floor(Math.random() * starChars.length)];
          setStardust((prev) => [...prev.slice(-6), { id, x: relX, y: relY, char }]);
          setTimeout(() => {
            setStardust((prev) => prev.filter((s) => s.id !== id));
          }, 700);
        }
      }
    }

    if (!isDragging) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (Math.hypot(dx, dy) > 7) {
      hasMovedRef.current = true;
    }

    // Controlled displacement based on envelope type
    if (envelope.id === 6) {
      // Horizontal rotation only
      setDragOffset({ x: Math.max(-45, Math.min(45, dx)), y: 0 });
    } else if (envelope.id === 7) {
      // Pick-up elevation with limited movement
      setDragOffset({ x: Math.max(-30, Math.min(30, dx * 0.4)), y: Math.max(-35, Math.min(10, dy * 0.4)) });
    } else {
      // General gentle drag response
      setDragOffset({
        x: Math.max(-35, Math.min(35, dx * 0.35)),
        y: Math.max(-35, Math.min(35, dy * 0.35))
      });
    }
  };

  // Pointer Up: Decide click or spring reset
  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(false);

    if (!hasMovedRef.current) {
      // Clean click detected!
      triggerOpen();
    }

    // Spring return to resting position
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Compute 3D Transform and CSS styles for the specific envelope
  const getEnvelope3DStyle = () => {
    const { x, y } = dragOffset;

    switch (envelope.id) {
      case 1:
        // Envelope 01: Golden Arrival (subtle 3D tilt tracking pointer)
        return {
          transform: isOpening
            ? 'scale(1.05) translateZ(30px)'
            : isDragging
            ? `perspective(800px) translate3d(${x}px, ${y}px, 0) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`
            : isHovered
            ? 'perspective(800px) translateY(-8px) scale(1.02)'
            : 'perspective(800px) translate3d(0, 0, 0)',
          boxShadow: isHovered || isOpening
            ? '0 16px 40px rgba(123, 94, 153, 0.22), 0 0 22px rgba(212, 175, 55, 0.55)'
            : isOpened
            ? `0 8px 24px ${tone.shadow}`
            : `0 14px 34px ${tone.shadow}, 0 0 16px rgba(212, 175, 55, 0.12)`,
          borderColor: isHovered || isOpening ? 'rgba(212, 175, 55, 0.85)' : undefined
        };

      case 2:
        // Envelope 02: The Floating Surprise (resting float + spring drag)
        return {
          transform: isOpening
            ? 'translateY(-28px) rotate(-3deg) scale(1.04)'
            : isDragging
            ? `translate3d(${x}px, ${y}px, 0) rotate(${x * 0.1}deg)`
            : undefined, // uses CSS animation envelopeFloatRest when idle
          boxShadow: isOpening
            ? '0 24px 50px rgba(217, 125, 149, 0.3), 0 0 25px rgba(255, 235, 180, 0.5)'
            : undefined
        };

      case 3:
        // Envelope 03: The Light Within (luminous edge travel & light reflection)
        return {
          transform: isOpening
            ? 'scale(1.04) translateY(-6px)'
            : isDragging
            ? `translate3d(${x}px, ${y}px, 0)`
            : isHovered
            ? 'translateY(-6px) scale(1.02)'
            : undefined,
          boxShadow: isOpening
            ? '0 0 35px rgba(212, 175, 55, 0.7), inset 0 0 20px rgba(255, 240, 180, 0.4)'
            : undefined
        };

      case 4:
        // Envelope 04: The Unfolding Story (angle inspection drag)
        return {
          transform: isOpening
            ? 'perspective(900px) rotateX(0deg) scale(1.04)'
            : isDragging
            ? `perspective(800px) rotateX(${-y * 0.45}deg) rotateY(${x * 0.45}deg) scale(1.02)`
            : isHovered
            ? 'perspective(800px) rotateX(4deg) translateY(-6px)'
            : undefined
        };

      case 6:
        // Envelope 06: The Petal Reveal (horizontal rotation drag)
        return {
          transform: isOpening
            ? 'scale(1.03) translateY(-6px)'
            : isDragging
            ? `perspective(800px) rotateY(${x * 0.6}deg)`
            : isHovered
            ? 'translateY(-6px) rotateY(-4deg)'
            : undefined
        };

      case 7:
        // Envelope 07: The Secret Dispatch (physical pick-up lift)
        return {
          transform: isOpening
            ? 'translateY(-20px) scale(1.05)'
            : isDragging
            ? `translate3d(${x}px, ${y - 12}px, 0) scale(1.05) rotate(${x * 0.08}deg)`
            : isHovered
            ? 'translateY(-8px) scale(1.03)'
            : undefined,
          boxShadow: isDragging
            ? '0 26px 55px rgba(74, 53, 104, 0.32), 0 0 20px rgba(212, 175, 55, 0.2)'
            : undefined
        };

      case 8:
        // Envelope 08: The Magic Ripple (seal pressed ripple)
        return {
          transform: isOpening
            ? 'scale(1.03)'
            : isDragging
            ? `translate3d(${x}px, ${y}px, 0)`
            : isHovered
            ? 'translateY(-6px)'
            : undefined
        };

      case 9:
        // Envelope 09: The Memory Unlocked (spotlight focus)
        return {
          transform: isOpening
            ? 'scale(1.05) translateY(-6px)'
            : isDragging
            ? `translate3d(${x}px, ${y}px, 0)`
            : isHovered
            ? 'translateY(-6px) scale(1.02)'
            : undefined,
          boxShadow: isOpening
            ? '0 20px 50px rgba(197, 155, 39, 0.35), 0 0 35px rgba(212, 175, 55, 0.55)'
            : undefined
        };

      case 10:
        // Envelope 10: The Final Celebration (grand 3D rotation & sheen)
        return {
          transform: isOpening
            ? 'scale(1.06) translateY(-8px)'
            : isDragging
            ? `perspective(800px) translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.3}deg)`
            : isHovered
            ? 'perspective(800px) translateY(-8px) rotateY(4deg) scale(1.03)'
            : undefined,
          boxShadow: isHovered || isOpening
            ? '0 20px 50px rgba(212, 175, 55, 0.45), 0 0 30px rgba(212, 175, 55, 0.6)'
            : `0 14px 34px ${tone.shadow}, 0 0 22px rgba(212, 175, 55, 0.25)`
        };

      default:
        // Envelope 05 and fallback
        return {
          transform: isOpening
            ? 'scale(1.04) translateY(-6px)'
            : isDragging
            ? `translate3d(${x}px, ${y}px, 0)`
            : isHovered
            ? 'translateY(-6px)'
            : undefined
        };
    }
  };

  const dynamic3DStyle = getEnvelope3DStyle();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDragging) setDragOffset({ x: 0, y: 0 });
      }}
      className={`envelope-card-interactive ${
        envelope.id === 2 && !isDragging && !isOpening ? 'envelope-float-resting' : ''
      }`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
        borderRadius: '20px',
        background: tone.bg,
        border: tone.border,
        boxShadow: isOpened
          ? `0 8px 24px ${tone.shadow}, 0 2px 6px rgba(0,0,0,0.04)`
          : `0 14px 34px ${tone.shadow}, 0 0 20px rgba(212, 175, 55, 0.12)`,
        padding: '22px 18px 18px',
        minHeight: '232px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        transition: isDragging
          ? 'none'
          : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease',
        ...dynamic3DStyle
      }}
    >
      {/* =========================================================================
          ENVELOPE-SPECIFIC INTERACTIVE OVERLAYS
          ========================================================================= */}

      {/* Envelope 03: Interactive Surface Light Reflection */}
      {envelope.id === 3 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle 110px at ${lightPos.x}px ${lightPos.y}px, rgba(255, 244, 200, 0.48) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 3,
            transition: 'opacity 0.2s ease',
            opacity: isHovered || isDragging || isOpening ? 1 : 0.4
          }}
        />
      )}

      {/* Envelope 03: Golden Light Beam on Opening */}
      {envelope.id === 3 && isOpening && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '22px',
            background: 'linear-gradient(90deg, #D4AF37, #FFF5D0, #D4AF37, #FFE58F)',
            backgroundSize: '250% 100%',
            animation: 'borderLightBeam 0.7s linear infinite',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.85
          }}
        />
      )}

      {/* Envelope 05: Interactive Stardust Trail */}
      {envelope.id === 5 &&
        stardust.map((star) => (
          <span
            key={star.id}
            className="stardust-particle"
            style={{
              position: 'absolute',
              left: `${star.x}px`,
              top: `${star.y}px`,
              fontSize: '12px',
              color: '#D4AF37',
              pointerEvents: 'none',
              zIndex: 6,
              filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.8))',
              animation: 'stardustParticleFade 0.75s ease-out forwards'
            }}
          >
            {star.char}
          </span>
        ))}

      {/* Envelope 05: Starburst Pulse from Wax Seal on Click */}
      {envelope.id === 5 && isOpening && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 235, 145, 0.95)',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.8)',
            animation: 'starburstPulse 0.6s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 6
          }}
        />
      )}

      {/* Envelope 06: Delicate Falling Flower Petals */}
      {envelope.id === 6 &&
        petals.map((petal) => (
          <div
            key={petal.id}
            className="petal-falling"
            style={{
              position: 'absolute',
              top: '-10px',
              left: `${petal.left}%`,
              width: '12px',
              height: '16px',
              borderRadius: '50% 0 50% 50%',
              background: petal.color,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              pointerEvents: 'none',
              zIndex: 6,
              animation: `petalDriftDown 1.1s cubic-bezier(0.25, 1, 0.5, 1) ${petal.delay}s forwards`
            }}
          />
        ))}

      {/* Envelope 08: Golden Seal Ripple Wave */}
      {envelope.id === 8 && rippleActive && (
        <div
          className="seal-ripple-wave"
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid #D4AF37',
            background: 'radial-gradient(circle, rgba(255, 235, 145, 0.45) 0%, transparent 70%)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
            pointerEvents: 'none',
            zIndex: 5,
            animation: 'sealRippleRing 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* Envelope 09: Soft Spotlight Tracking Cursor / Finger */}
      {envelope.id === 9 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle 125px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.42) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 3,
            transition: 'opacity 0.25s ease',
            opacity: isHovered || isDragging || isOpening ? 1 : 0.35
          }}
        />
      )}

      {/* Envelope 10: Grand Birthday Invitation Champagne-Gold & Lavender Light Trails */}
      {envelope.id === 10 && (
        <div
          className="light-trail-orbit"
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '22px',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(212, 175, 55, 0.85) 25%, transparent 50%, rgba(132, 94, 194, 0.75) 75%, transparent 100%)',
            animation: 'lightTrailOrbit 3.2s linear infinite',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* =========================================================================
          REALISTIC ENVELOPE PHYSICAL FOLDS & FLAP
          ========================================================================= */}

      {/* Realistic Envelope Triangular Flap Fold (3D Opening Animation) */}
      <motion.div
        animate={{
          rotateX: isOpening ? 180 : 0
        }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        style={{
          transformOrigin: 'top center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '76px',
          background: `linear-gradient(to bottom, rgba(255,255,255,0.75), ${tone.pocketFold})`,
          clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
          zIndex: 3,
          pointerEvents: 'none'
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

      {/* =========================================================================
          ENVELOPE CONTENT: NUMBER BADGE, STAMP, WAX SEAL, TITLE
          ========================================================================= */}

      {/* Card Header: Number Badge + Vintage Postmark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 4
        }}
      >
        {/* Number Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.88)',
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
            background: 'rgba(255,255,255,0.55)',
            transform: 'rotate(-2deg)'
          }}
        >
          {envelope.stampText}
        </div>
      </div>

      {/* Center: Wax Seal & Title */}
      <div style={{ textAlign: 'center', margin: '16px 0 10px', position: 'relative', zIndex: 4 }}>
        {/* Embossed Wax Seal */}
        <motion.div
          animate={
            isOpening && envelope.id === 8
              ? { scale: [1, 0.86, 1.15] }
              : isOpening && (envelope.id === 1 || envelope.id === 10)
              ? { scale: 1.15, filter: 'drop-shadow(0 0 16px #D4AF37)' }
              : isHovered
              ? { scale: 1.1, rotate: 3 }
              : { scale: 1, rotate: 0 }
          }
          transition={{ type: 'spring', stiffness: 380, damping: 16 }}
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
          {/* Wax Rim Relief */}
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
  );
};
