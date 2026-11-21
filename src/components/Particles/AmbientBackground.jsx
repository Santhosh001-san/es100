import React, { useEffect, useRef } from 'react';

/**
 * AmbientBackground
 * Ultra-smooth, battery and memory-friendly canvas rendering delicate floating sparkles,
 * soft glowing orbs, and subtle flower petals (cherry blossom & lavender flora).
 */
export const AmbientBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool: 24 gentle petals, 35 delicate sparkles, 6 ambient soft glows
    const petals = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.4 + 0.25,
      speedX: (Math.random() - 0.5) * 0.35,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.015,
      color: Math.random() > 0.4 ? 'rgba(244, 184, 205, 0.45)' : 'rgba(216, 195, 235, 0.4)'
    }));

    const sparkles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.8,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '255, 225, 140' : '230, 215, 255'
    }));

    let time = 0;
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(render);
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Delicate Floating Petals (Smooth 2D Bezier)
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.3;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        // Draw curved petal path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 3, p.size / 2, p.size);
        ctx.bezierCurveTo(-p.size / 3, p.size / 2, -p.size / 2, 0, 0, 0);
        ctx.fill();

        ctx.restore();
      });

      // 2. High-Performance Delicate Sparkles (GPU-accelerated dual-pass glow without expensive shadowBlur)
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.opacity += Math.sin(time * 5 + s.x) * s.pulseSpeed;
        const boundedOpacity = Math.max(0.1, Math.min(0.85, s.opacity));

        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Sparkle soft outer aura
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${boundedOpacity * 0.28})`;
        ctx.fill();

        // Sparkle luminous core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${boundedOpacity})`;
        ctx.fill();
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isRunning = true;
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: -1,
        // GPU-composited ambient background gradient glows (zero-cost rasterization)
        background: `
          radial-gradient(circle at 20% 25%, rgba(232, 214, 248, 0.32) 0%, transparent 45%),
          radial-gradient(circle at 80% 65%, rgba(248, 215, 227, 0.28) 0%, transparent 50%),
          radial-gradient(circle at 50% 85%, rgba(255, 246, 218, 0.22) 0%, transparent 45%)
        `
      }}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          opacity: 0.85
        }}
      />
    </div>
  );
};
