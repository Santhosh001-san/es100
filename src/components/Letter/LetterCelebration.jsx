import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Mail } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import { CloseButton } from '../Common/CloseButton';

export const LetterCelebration = ({ onReplay, onReadLetter, onClose }) => {
  const canvasRef = useRef(null);

  // States: 'countdown' -> 'reveal'
  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(10);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Fireworks Animation Engine Ref
  const animRef = useRef({
    rockets: [],
    particles: [],
    ambientFlash: 0,
    ambientColor: 'rgba(212, 175, 55, 0)',
    animFrameId: null,
    lastLaunchTime: 0
  });

  // Countdown timer logic
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdown > 0) {
      soundManager.playButtonClick();
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 850);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished -> trigger main fireworks & celebration reveal
      setPhase('reveal');
      soundManager.playFanfare();

      // Show final message after initial fireworks burst
      const msgTimer = setTimeout(() => {
        setShowFinalMessage(true);
      }, 3000);
      return () => clearTimeout(msgTimer);
    }
  }, [phase, countdown]);

  // Realistic Fireworks Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 720);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Realistic firework color palette: champagne gold, deep metallic gold, warm amber, white-gold, subtle lavender
    const fireworkColors = [
      { r: 255, g: 244, b: 208 }, // Champagne
      { r: 253, g: 228, b: 139 }, // Warm Gold
      { r: 229, g: 184, b: 75 },  // Deep Gold
      { r: 255, g: 255, b: 255 }, // Brilliant White
      { r: 216, g: 180, b: 254 }, // Subtle Lavender
      { r: 243, g: 208, b: 255 }  // Lilac Pearl
    ];

    const createExplosion = (x, y, baseColor) => {
      const count = Math.floor(55 + Math.random() * 25);
      animRef.current.ambientFlash = 0.35;
      animRef.current.ambientColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, `;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 5.2;
        animRef.current.particles.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: baseColor,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.015,
          drag: 0.965,
          gravity: 0.085,
          flicker: Math.random() > 0.4
        });
      }
    };

    const launchRocket = () => {
      const x = width * (0.2 + Math.random() * 0.6);
      const targetY = height * (0.18 + Math.random() * 0.35);
      const vy = -(11 + Math.random() * 3.5);
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

      animRef.current.rockets.push({
        x,
        y: height,
        prevX: x,
        prevY: height,
        vx: (Math.random() - 0.5) * 1.5,
        vy,
        targetY,
        color
      });
    };

    let lastTime = performance.now();

    const loop = (currentTime) => {
      animRef.current.animFrameId = requestAnimationFrame(loop);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Semi-transparent fade creates natural motion blur
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Ambient Flash illumination
      if (animRef.current.ambientFlash > 0.01) {
        const grad = ctx.createRadialGradient(width / 2, height * 0.35, 10, width / 2, height * 0.35, width * 0.7);
        grad.addColorStop(0, animRef.current.ambientColor + animRef.current.ambientFlash * 0.45 + ')');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        animRef.current.ambientFlash *= 0.88;
      }

      // Auto-launch fireworks when in reveal phase
      if (phase === 'reveal') {
        if (currentTime - animRef.current.lastLaunchTime > 650 + Math.random() * 700) {
          launchRocket();
          animRef.current.lastLaunchTime = currentTime;
        }
      }

      // Update & Draw Rockets
      for (let i = animRef.current.rockets.length - 1; i >= 0; i--) {
        const r = animRef.current.rockets[i];
        r.prevX = r.x;
        r.prevY = r.y;
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.12; // gravity on rocket

        // Rocket streak
        ctx.beginPath();
        ctx.moveTo(r.prevX, r.prevY);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, 0.95)`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Rocket ember spark
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Explode condition
        if (r.vy >= -0.5 || r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          animRef.current.rockets.splice(i, 1);
        }
      }

      // Update & Draw Explosion Particles
      for (let i = animRef.current.particles.length - 1; i >= 0; i--) {
        const p = animRef.current.particles[i];
        p.prevX = p.x;
        p.prevY = p.y;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          animRef.current.particles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.6 : p.alpha;

        // Realistic spark streaks
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
        ctx.lineWidth = Math.max(1, p.alpha * 2.4);
        ctx.stroke();

        // Glowing spark head
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.alpha * 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animRef.current.animFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current.animFrameId) {
        cancelAnimationFrame(animRef.current.animFrameId);
      }
    };
  }, [phase]);

  const handleRestartCelebration = () => {
    soundManager.playButtonClick();
    setPhase('countdown');
    setCountdown(10);
    setShowFinalMessage(false);
    animRef.current.rockets = [];
    animRef.current.particles = [];
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #1A0C2E 0%, #0D0518 60%, #06020A 100%)',
        border: '2px solid rgba(212, 175, 55, 0.65)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 50px rgba(212, 175, 55, 0.25)',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center'
      }}
    >
      {/* Universal Close / Return Button */}
      <CloseButton onClose={onClose} variant="gold" top="18px" right="18px" ariaLabel="Close Celebration" />

      {/* Realistic Night Sky Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Ambient Lavender/Gold Night Sky Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 111, 169, 0.22) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 75%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* PHASE 1: CINEMATIC COUNTDOWN (10 -> 1) */}
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key="countdown-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                padding: '5px 18px',
                borderRadius: '20px',
                color: '#F5D061',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.16em',
                fontFamily: "'Cinzel', serif",
                marginBottom: '20px'
              }}
            >
              <Sparkles size={13} />
              <span>COMMENCING 100-DAY CEREMONY</span>
              <Sparkles size={13} />
            </div>

            <p style={{ fontSize: '15px', color: '#D8C7E8', marginBottom: '24px', letterSpacing: '0.04em' }}>
              Stand by, Commander Estelle...
            </p>

            {/* Glowing Golden Countdown Number */}
            <motion.div
              key={countdown}
              initial={{ scale: 1.35, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(5.5rem, 14vw, 8.5rem)',
                fontWeight: 900,
                fontFamily: "'Cinzel', serif",
                background: 'linear-gradient(180deg, #FFFDF8 0%, #FFE58F 45%, #D4AF37 80%, #99741B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(212, 175, 55, 0.6)',
                lineHeight: 1,
                margin: '10px 0'
              }}
            >
              {countdown}
            </motion.div>

            <span
              style={{
                fontSize: '12px',
                fontFamily: "'Cinzel', serif",
                color: '#B38B29',
                letterSpacing: '0.2em',
                fontWeight: 700
              }}
            >
              COUNTDOWN IN PROGRESS
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: MAIN CELEBRATION REVEAL */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            key="reveal-view"
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 10, maxWidth: '660px', width: '100%' }}
          >
            {/* Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(212, 175, 55, 0.16)',
                border: '1.5px solid rgba(212, 175, 55, 0.5)',
                color: '#FFE28A',
                padding: '6px 22px',
                borderRadius: '30px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.18em',
                fontFamily: "'Cinzel', serif",
                marginBottom: '16px',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)'
              }}
            >
              <Sparkles size={14} color="#FFE28A" />
              <span>OFFICIAL 100-DAY MILESTONE</span>
              <Sparkles size={14} color="#FFE28A" />
            </motion.div>

            {/* Impressive Golden "100 DAYS COMPLETED!" */}
            <div style={{ margin: '10px 0 16px' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220, delay: 0.1 }}
                style={{
                  fontSize: 'clamp(4.2rem, 11vw, 7.2rem)',
                  fontWeight: 900,
                  fontFamily: "'Cinzel', serif",
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF2B2 35%, #E5B84B 75%, #B8860B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 0.95,
                  letterSpacing: '0.02em',
                  filter: 'drop-shadow(0 0 35px rgba(212, 175, 55, 0.55))'
                }}
              >
                100
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-cinzel"
                style={{
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#FFE699',
                  textShadow: '0 2px 14px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.4)',
                  marginTop: '4px'
                }}
              >
                DAYS COMPLETED!
              </motion.div>
            </div>

            {/* Recipient Name: COMMANDER ESTELLE */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                color: '#FFFDF9',
                letterSpacing: '0.12em',
                marginBottom: '26px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.5)'
              }}
            >
              COMMANDER ESTELLE
            </motion.div>

            {/* PHASE 3: FINAL MESSAGES */}
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1.5px solid rgba(212, 175, 55, 0.45)',
                    borderRadius: '20px',
                    padding: '24px 22px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
                    marginBottom: '26px'
                  }}
                >
                  {/* First Final Message */}
                  <p
                    className="font-cormorant"
                    style={{
                      fontSize: 'clamp(18px, 2.8vw, 22px)',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#FFF7E6',
                      lineHeight: 1.55,
                      margin: '0 0 16px',
                      textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                    }}
                  >
                    “100 days down, and hopefully countless little moments still waiting to happen. Here's to more laughter, unexpected adventures, silly conversations and memories yet to be made.”
                  </p>

                  {/* Second Final Message / Climax Banner */}
                  <div
                    className="font-cinzel"
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(90deg, #D4AF37 0%, #FFE28A 50%, #D4AF37 100%)',
                      color: '#261238',
                      fontWeight: 900,
                      fontSize: 'clamp(11px, 2.2vw, 13.5px)',
                      letterSpacing: '0.14em',
                      padding: '8px 22px',
                      borderRadius: '25px',
                      boxShadow: '0 4px 18px rgba(212, 175, 55, 0.45)'
                    }}
                  >
                    THIS ISN'T THE END. JUST ANOTHER LITTLE BEGINNING.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar (Replay Celebration & Read Full Letter) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={handleRestartCelebration}
                className="btn-gold-luxury"
                style={{ fontSize: '12.5px', padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} />
                <span>Replay Celebration</span>
              </button>

              {onReadLetter && (
                <button
                  onClick={onReadLetter}
                  className="btn-lavender-luxury"
                  style={{
                    fontSize: '12.5px',
                    padding: '10px 22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: '#E8D5FF',
                    borderColor: 'rgba(212, 175, 55, 0.4)'
                  }}
                >
                  <Mail size={14} />
                  <span>Read Full Letter</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
