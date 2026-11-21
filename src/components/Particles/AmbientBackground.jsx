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

    const glows = [
      { x: width * 0.2, y: height * 0.25, r: 280, color: 'rgba(232, 214, 248, 0.35)' },
      { x: width * 0.8, y: height * 0.65, r: 320, color: 'rgba(248, 215, 227, 0.3)' },
      { x: width * 0.5, y: height * 0.85, r: 260, color: 'rgba(255, 246, 218, 0.25)' }
    ];

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Soft Ambient Glowing Orbs
      glows.forEach((g) => {
        const radGrad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        radGrad.addColorStop(0, g.color);
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Delicate Floating Petals
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

      // 3. Delicate Sparkles
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.opacity += Math.sin(time * 5 + s.x) * s.pulseSpeed;
        const boundedOpacity = Math.max(0.1, Math.min(0.85, s.opacity));

        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${boundedOpacity})`;
        ctx.shadowColor = `rgba(${s.color}, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
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
  );
};
