import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ChevronLeft, ChevronRight, Check, Search, Filter, Eye } from 'lucide-react';
import { starsData, constellationThemes } from '../../data/stars';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'estelle_discovered_stars';

export const StarsUniverse = ({ onBackToGift, onContinueToScrapbook }) => {
  // Discovered stars stored persistently in localStorage
  const [discoveredStars, setDiscoveredStars] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch (e) {
      console.warn('Failed to load discovered stars:', e);
    }
    return new Set();
  });

  const [selectedStarId, setSelectedStarId] = useState(null);
  const [activeConstellation, setActiveConstellation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUndiscoveredOnly, setFilterUndiscoveredOnly] = useState(false);
  const canvasRef = useRef(null);

  // Sync discovered stars to localStorage
  const markAsDiscovered = (id) => {
    setDiscoveredStars((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Failed to save discovered stars:', e);
      }

      // If all 100 stars discovered, fire celebratory gold confetti!
      if (next.size === 100) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3E5AB', '#9275B2', '#EAE2F6']
        });
      }

      return next;
    });
  };

  // Open star card modal and mark discovered
  const handleStarClick = (star) => {
    try {
      const pitchMultiplier = 0.9 + (star.id % 10) * 0.03;
      soundManager.playStarChime(pitchMultiplier);
    } catch {
      // Audio fallback
    }
    markAsDiscovered(star.id);
    setSelectedStarId(star.id);
  };

  // Close star card modal with Escape key
  useEscapeKey(() => {
    if (selectedStarId !== null) {
      setSelectedStarId(null);
    } else if (onBackToGift) {
      onBackToGift();
    }
  }, true);

  // Keyboard navigation between stars when modal is open
  useEffect(() => {
    if (selectedStarId === null) return;
    const handleKeyNav = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextId = selectedStarId >= 100 ? 1 : selectedStarId + 1;
        markAsDiscovered(nextId);
        setSelectedStarId(nextId);
        try { soundManager.playStarChime(1.05); } catch {}
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevId = selectedStarId <= 1 ? 100 : selectedStarId - 1;
        markAsDiscovered(prevId);
        setSelectedStarId(prevId);
        try { soundManager.playStarChime(0.95); } catch {}
      }
    };
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [selectedStarId]);

  // Selected star object
  const selectedStar = useMemo(() => {
    if (!selectedStarId) return null;
    return starsData.find((s) => s.id === selectedStarId) || null;
  }, [selectedStarId]);

  // Filtered stars list
  const filteredStars = useMemo(() => {
    return starsData.filter((star) => {
      // Constellation filter
      if (activeConstellation !== 'all' && star.constellation !== activeConstellation) {
        return false;
      }
      // Undiscovered filter
      if (filterUndiscoveredOnly && discoveredStars.has(star.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNum = star.number.includes(query) || star.id.toString() === query;
        const matchesTitle = star.title.toLowerCase().includes(query);
        const matchesMsg = star.message.toLowerCase().includes(query);
        const matchesCat = star.category.toLowerCase().includes(query);
        if (!matchesNum && !matchesTitle && !matchesMsg && !matchesCat) return false;
      }
      return true;
    });
  }, [activeConstellation, filterUndiscoveredOnly, searchQuery, discoveredStars]);

  // Constellation discovery statistics
  const constellationStats = useMemo(() => {
    const stats = {};
    const ranges = {
      Aurora: [1, 20],
      Nebula: [21, 40],
      Solis: [41, 60],
      Polaris: [61, 80],
      Zenith: [81, 100]
    };
    Object.entries(ranges).forEach(([cName, [start, end]]) => {
      let count = 0;
      for (let i = start; i <= end; i++) {
        if (discoveredStars.has(i)) count++;
      }
      stats[cName] = { count, total: end - start + 1 };
    });
    return stats;
  }, [discoveredStars]);

  // Subtle ambient background canvas for celestial starlight depth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 70 soft drifting cosmic particles
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? 'rgba(212, 175, 55,' : 'rgba(214, 186, 245,'
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(frame * p.twinkleSpeed));
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalDiscovered = discoveredStars.size;
  const progressPercent = Math.min(100, Math.round((totalDiscovered / 100) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        backgroundColor: '#0A0518',
        backgroundImage: `
          radial-gradient(ellipse at 50% 12%, rgba(58, 29, 94, 0.65) 0%, rgba(20, 10, 36, 0.85) 45%, #080314 100%),
          radial-gradient(circle at 15% 45%, rgba(139, 111, 169, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 85% 65%, rgba(212, 175, 55, 0.12) 0%, transparent 45%)
        `,
        color: '#FAF5EB',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Ambient background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          background: 'rgba(10, 5, 24, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
          flexShrink: 0,
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Subtle Back to Gift Box Button */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            if (onBackToGift) onBackToGift();
          }}
          className="btn-glass"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#E8DAF5',
            background: 'rgba(67, 46, 93, 0.55)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '999px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
          }}
          aria-label="Back to your gift"
        >
          <ArrowLeft size={14} color="#D4AF37" />
          <span>BACK TO YOUR GIFT</span>
        </button>

        {/* Right side: Discovery Progress Badge & Universal Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Discovery Progress Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(25, 14, 44, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '999px',
              padding: '6px 16px',
              boxShadow: '0 4px 18px rgba(212, 175, 55, 0.15)'
            }}
          >
            <Sparkles size={14} color="#D4AF37" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#F4E8C1'
              }}
            >
              {totalDiscovered} / 100 STARS DISCOVERED
            </span>

            {/* Mini progress bar */}
            <div
              style={{
                width: '70px',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D4AF37 0%, #FFE89E 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {/* Prominent Golden Close Button to exit Stars Universe */}
          <CloseButton
            onClose={() => {
              if (onBackToGift) onBackToGift();
            }}
            variant="gold"
            isAbsolute={false}
            ariaLabel="Close Stars Universe and return to gift"
          />
        </div>
      </header>

      {/* ================= CELESTIAL HEADER SECTION ================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '20px 16px 12px',
          flexShrink: 0
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '10px', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.18em' }}>
              ✦ HIDDEN CELESTIAL UNIVERSE ✦
            </span>
          </div>

          <h2
            className="font-cinzel"
            style={{
              fontSize: 'clamp(24px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '0.16em',
              background: 'linear-gradient(135deg, #FFFDF8 0%, #F5DE88 45%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 6px'
            }}
          >
            100 LITTLE STARS
          </h2>

          <p
            className="font-serif-luxury"
            style={{
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              color: '#D8CCE5',
              fontStyle: 'italic',
              margin: '0 auto',
              maxWidth: '560px',
              lineHeight: 1.5
            }}
          >
            “A hundred little surprises, waiting to be discovered.”
          </p>
        </motion.div>

        {/* Filter Pills Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px',
            maxWidth: '920px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {constellationThemes.map((c) => {
            const isSelected = activeConstellation === c.id;
            const stats = c.id === 'all' ? null : constellationStats[c.id];

            return (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveConstellation(c.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 700 : 500,
                  letterSpacing: '0.04em',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(146, 117, 178, 0.3) 100%)'
                    : 'rgba(30, 16, 50, 0.65)',
                  border: isSelected
                    ? '1.5px solid #D4AF37'
                    : '1px solid rgba(139, 111, 169, 0.25)',
                  color: isSelected ? '#FFF8E6' : '#C5B5D8',
                  boxShadow: isSelected ? '0 0 14px rgba(212, 175, 55, 0.28)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: c.color,
                    boxShadow: `0 0 6px ${c.color}`
                  }}
                />
                <span>{c.name}</span>
                {stats && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: stats.count === stats.total ? '#E2B155' : '#9E8EB5',
                      fontWeight: 600,
                      marginLeft: '2px'
                    }}
                  >
                    ({stats.count}/{stats.total})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Search & Toggle Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px'
          }}
        >
          {/* Quick Search input */}
          <div
            style={{
              position: 'relative',
              width: '210px',
              display: 'inline-block'
            }}
          >
            <Search
              size={13}
              color="#A392BD"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Find star # / name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '5px 10px 5px 28px',
                fontSize: '11px',
                background: 'rgba(25, 12, 42, 0.75)',
                border: '1px solid rgba(139, 111, 169, 0.35)',
                borderRadius: '999px',
                color: '#FFF8E6',
                outline: 'none'
              }}
            />
          </div>

          {/* Undiscovered only toggle */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setFilterUndiscoveredOnly(!filterUndiscoveredOnly);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              background: filterUndiscoveredOnly ? 'rgba(212, 175, 55, 0.22)' : 'rgba(30, 16, 50, 0.65)',
              border: filterUndiscoveredOnly ? '1px solid #D4AF37' : '1px solid rgba(139, 111, 169, 0.25)',
              color: filterUndiscoveredOnly ? '#FFE89E' : '#B8A6CE',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Filter size={11} />
            <span>{filterUndiscoveredOnly ? 'Showing Undiscovered' : 'Show Undiscovered Only'}</span>
          </button>
        </div>
      </div>

      {/* ================= INTERACTIVE STAR MAP GRID ================= */}
      <main
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px 40px',
          maxWidth: '1180px',
          width: '100%',
          margin: '0 auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212, 175, 55, 0.4) transparent'
        }}
      >
        {filteredStars.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#B6A6CB'
            }}
          >
            <Sparkles size={28} color="#D4AF37" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '15px', fontStyle: 'italic', margin: 0 }}>
              No stars match your filter.
            </p>
            <button
              onClick={() => {
                setActiveConstellation('all');
                setSearchQuery('');
                setFilterUndiscoveredOnly(false);
              }}
              style={{
                marginTop: '14px',
                padding: '6px 16px',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #D4AF37',
                color: '#FFE89E',
                borderRadius: '999px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
              gap: '12px',
              justifyContent: 'center'
            }}
          >
            {filteredStars.map((star) => {
              const isDiscovered = discoveredStars.has(star.id);
              const isSelected = selectedStarId === star.id;

              return (
                <motion.button
                  key={star.id}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStarClick(star)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1.08',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 4px',
                    borderRadius: '14px',
                    background: isDiscovered
                      ? 'linear-gradient(145deg, rgba(46, 26, 74, 0.85) 0%, rgba(32, 16, 54, 0.9) 100%)'
                      : 'linear-gradient(145deg, rgba(24, 12, 42, 0.6) 0%, rgba(14, 6, 26, 0.75) 100%)',
                    border: isSelected
                      ? '2px solid #FFE89E'
                      : isDiscovered
                      ? '1.5px solid rgba(212, 175, 55, 0.6)'
                      : '1px solid rgba(139, 111, 169, 0.28)',
                    boxShadow: isSelected
                      ? '0 0 24px rgba(255, 232, 158, 0.6), inset 0 0 12px rgba(212, 175, 55, 0.3)'
                      : isDiscovered
                      ? '0 4px 16px rgba(0, 0, 0, 0.35), 0 0 10px rgba(212, 175, 55, 0.22)'
                      : '0 2px 8px rgba(0, 0, 0, 0.25)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  title={`Star #${star.number}: ${star.title} (${star.category})`}
                  aria-label={`Star ${star.number}: ${star.title}`}
                >
                  {/* Subtle starlight glow / flare */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '32%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: isDiscovered ? '38px' : '22px',
                      height: isDiscovered ? '38px' : '22px',
                      borderRadius: '50%',
                      background: isDiscovered
                        ? 'radial-gradient(circle, rgba(255, 232, 158, 0.5) 0%, rgba(212, 175, 55, 0.2) 50%, transparent 80%)'
                        : 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                      filter: 'blur(2px)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Star Icon Glyph */}
                  <div
                    style={{
                      position: 'relative',
                      fontSize: isDiscovered ? '20px' : '17px',
                      lineHeight: 1,
                      color: isDiscovered ? '#FFE89E' : '#B8A6CE',
                      filter: isDiscovered ? 'drop-shadow(0 0 6px rgba(255, 225, 120, 0.75))' : 'none',
                      marginBottom: '4px',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {isDiscovered ? '★' : '✦'}
                  </div>

                  {/* Star Number */}
                  <span
                    className="font-cinzel"
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: isDiscovered ? '#F4E8C1' : '#9F8CB8'
                    }}
                  >
                    #{star.number}
                  </span>

                  {/* Tiny Discovered Badge / Check */}
                  {isDiscovered ? (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #D4AF37 0%, #FFE89E 100%)',
                        color: '#2A183C',
                        boxShadow: '0 0 6px rgba(212, 175, 55, 0.6)'
                      }}
                    >
                      <Check size={8} strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '5px',
                        fontSize: '8px',
                        color: 'rgba(212, 175, 55, 0.35)'
                      }}
                    >
                      •
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Bottom subtle return & scrapbook link */}
        <div
          style={{
            marginTop: '36px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <button
            onClick={() => {
              soundManager.playButtonClick();
              if (onBackToGift) onBackToGift();
            }}
            className="btn-gold-luxury"
            style={{
              padding: '10px 24px',
              fontSize: '12.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={14} />
            <span>RETURN TO 3D GIFT BOX</span>
          </button>

          {onContinueToScrapbook && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                if (onBackToGift) onBackToGift();
                setTimeout(() => {
                  if (onContinueToScrapbook) onContinueToScrapbook();
                }, 300);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#C7B6DC',
                fontSize: '12px',
                fontStyle: 'italic',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              Continue downward to Commander challenge →
            </button>
          )}
        </div>
      </main>

      {/* ================= FLOATING GLASS-AND-PAPER MESSAGE CARD MODAL ================= */}
      <AnimatePresence>
        {selectedStar && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1500,
              background: 'rgba(12, 6, 24, 0.78)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedStarId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '520px',
                width: '95%',
                maxHeight: '90vh',
                overflowY: 'auto',
                // Premium floating glass-and-paper combination
                background: 'linear-gradient(150deg, rgba(255, 253, 248, 0.98) 0%, rgba(247, 241, 255, 0.96) 65%, rgba(255, 249, 238, 0.98) 100%)',
                borderRadius: '24px',
                padding: '28px 24px 24px',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                boxShadow: `
                  0 24px 60px rgba(10, 4, 22, 0.55),
                  0 0 0 4px rgba(212, 175, 55, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9)
                `,
                color: '#34224C',
                textAlign: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Universal Close Button */}
              <CloseButton
                onClose={() => setSelectedStarId(null)}
                variant="gold"
                top="14px"
                right="14px"
                ariaLabel="Close star message"
              />

              {/* Top Constellation & Category Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    background: 'rgba(118, 86, 150, 0.1)',
                    border: '1px solid rgba(118, 86, 150, 0.25)',
                    color: '#654484'
                  }}
                >
                  ✦ CONSTELLATION {selectedStar.constellation.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    background: 'rgba(212, 175, 55, 0.14)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    color: '#8E6D1C'
                  }}
                >
                  {selectedStar.category}
                </span>
              </div>

              {/* Radiant Star Icon and Number */}
              <div
                style={{
                  position: 'relative',
                  width: '54px',
                  height: '54px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFF9EA 0%, #F5DE88 50%, #D4AF37 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
                  border: '2px solid #FFFFFF'
                }}
              >
                <span style={{ fontSize: '24px', color: '#68450A', lineHeight: 1 }}>★</span>
              </div>

              <span
                className="font-cinzel"
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#9C7A28',
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                STAR #{selectedStar.number} OF 100
              </span>

              {/* Star Title */}
              <h3
                className="font-serif-luxury"
                style={{
                  fontSize: '21px',
                  fontWeight: 700,
                  color: '#34224C',
                  margin: '0 0 14px',
                  lineHeight: 1.3
                }}
              >
                {selectedStar.title}
              </h3>

              {/* Message Paper Card */}
              <div
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: 'inset 0 1px 4px rgba(118, 86, 150, 0.06)',
                  marginBottom: '18px'
                }}
              >
                <p
                  className="font-serif-luxury"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#4B3861',
                    margin: 0,
                    fontStyle: 'italic'
                  }}
                >
                  “{selectedStar.message}”
                </p>
              </div>

              {/* Dedication footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
                  fontSize: '11px',
                  color: '#8A7A9E'
                }}
              >
                <span style={{ fontStyle: 'italic' }}>
                  Dedicated to Commander Estelle
                </span>
                <span style={{ fontWeight: 600, color: '#654484' }}>
                  Day 100 Edition
                </span>
              </div>

              {/* Modal Prev / Next Navigation Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: '16px'
                }}
              >
                <button
                  onClick={() => {
                    const prevId = selectedStar.id <= 1 ? 100 : selectedStar.id - 1;
                    markAsDiscovered(prevId);
                    setSelectedStarId(prevId);
                    try { soundManager.playStarChime(0.95); } catch {}
                  }}
                  className="btn-glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#5C3E78',
                    background: 'rgba(244, 238, 252, 0.8)',
                    border: '1px solid rgba(118, 86, 150, 0.25)',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>Prev Star</span>
                </button>

                <span style={{ fontSize: '11px', color: '#A392BD' }}>
                  Use ← → keys
                </span>

                <button
                  onClick={() => {
                    const nextId = selectedStar.id >= 100 ? 1 : selectedStar.id + 1;
                    markAsDiscovered(nextId);
                    setSelectedStarId(nextId);
                    try { soundManager.playStarChime(1.05); } catch {}
                  }}
                  className="btn-glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#5C3E78',
                    background: 'rgba(244, 238, 252, 0.8)',
                    border: '1px solid rgba(118, 86, 150, 0.25)',
                    cursor: 'pointer'
                  }}
                >
                  <span>Next Star</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
