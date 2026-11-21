import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Sliders, GripVertical, Music, ChevronDown } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';

export const MusicController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Hidden/minimized by default as requested
  const [trackName, setTrackName] = useState('Heartfelt Melody');
  const fileInputRef = useRef(null);
  const constraintsRef = useRef(null);

  const handleTogglePlay = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const playing = await soundManager.toggleMusic();
      setIsPlaying(playing);
    } catch (err) {
      console.warn('Playback error:', err);
    }
  };

  const handleToggleMute = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    soundManager.setVolume(val / 100);
    if (isMuted && val > 0) {
      soundManager.toggleMute();
      setIsMuted(false);
    }
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = soundManager.loadCustomAudioFile(file);
      setTrackName(name);
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Invisible full-viewport constraints container so the Atmosphere box stays within the screen */}
      <div
        ref={constraintsRef}
        style={{
          position: 'fixed',
          inset: '16px',
          pointerEvents: 'none',
          zIndex: 999
        }}
      />

      {/* Draggable Atmosphere Floating Widget */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={constraintsRef}
        whileDrag={{
          scale: 1.05,
          cursor: 'grabbing',
          boxShadow: '0 20px 45px rgba(74, 53, 104, 0.35)'
        }}
        title="Atmosphere Music • Drag and place anywhere"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 950,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <AnimatePresence mode="wait">
          {/* MINIMIZED STATE: Small, elegant circular floating dot/icon */}
          {isMinimized ? (
            <motion.button
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                soundManager.playButtonClick();
                setIsMinimized(false);
              }}
              title={isPlaying ? "Atmosphere Music Playing • Click to open" : "Atmosphere Music • Click to open"}
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying
                  ? '0 6px 20px rgba(212, 175, 55, 0.45), 0 0 0 3px rgba(212, 175, 55, 0.2)'
                  : '0 4px 16px rgba(74, 53, 104, 0.22)',
                border: isPlaying ? '1.5px solid rgba(212, 175, 55, 0.75)' : '1.5px solid rgba(212, 175, 55, 0.4)',
                background: isPlaying
                  ? 'linear-gradient(135deg, #FFF9EA 0%, #F5DE88 50%, #D4AF37 100%)'
                  : 'rgba(255, 253, 249, 0.95)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                color: isPlaying ? '#2E1E3D' : '#72538F',
                transition: 'all 0.25s ease'
              }}
              aria-label="Open atmosphere music player"
            >
              <Music size={18} className={isPlaying ? 'animate-pulse' : ''} />

              {/* Tiny active playing pulse dot at top-right corner */}
              {isPlaying && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    border: '1.5px solid #FFFFFF',
                    boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)'
                  }}
                />
              )}
            </motion.button>
          ) : (
            /* EXPANDED STATE: Full atmosphere controls with minimize toggle */
            <motion.div
              key="expanded"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-panel"
              style={{
                borderRadius: '30px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 32px rgba(74, 53, 104, 0.18)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                background: 'rgba(255, 253, 249, 0.96)',
                backdropFilter: 'blur(12px)',
                transition: 'box-shadow 0.25s ease'
              }}
            >
              {/* Draggable Grip Handle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B8A6CB',
                  cursor: 'grab',
                  padding: '0 2px 0 0',
                  opacity: 0.85
                }}
                title="Drag to place anywhere on screen"
              >
                <GripVertical size={16} />
              </div>

              {/* Toggle Music Play / Pause */}
              <button
                onClick={handleTogglePlay}
                onPointerDown={(e) => e.stopPropagation()}
                title={isPlaying ? 'Pause Ambient Soundtrack' : 'Play Gentle Ambient Soundtrack'}
                style={{
                  background: isPlaying ? 'var(--gold-gradient)' : 'linear-gradient(135deg, #8B6FA9 0%, #6E4F8E 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  minWidth: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isPlaying ? '#382806' : '#FFFDF9',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
                  transition: 'all 0.25s ease'
                }}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: '2px' }} />}
              </button>

              {/* Status label / Now Playing */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '105px',
                  cursor: 'grab'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#967BB6', fontWeight: 700 }}>
                    {isPlaying ? 'Now Playing' : 'Atmosphere'}
                  </span>
                  {/* Animated Equalizer Waves when music is playing */}
                  {isPlaying && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '11px' }}>
                      <motion.span
                        animate={{ height: ['3px', '11px', '5px', '9px', '3px'] }}
                        transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: '2px', background: '#D4AF37', borderRadius: '1px' }}
                      />
                      <motion.span
                        animate={{ height: ['7px', '3px', '11px', '6px', '7px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        style={{ width: '2px', background: '#D4AF37', borderRadius: '1px' }}
                      />
                      <motion.span
                        animate={{ height: ['5px', '10px', '3px', '8px', '5px'] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        style={{ width: '2px', background: '#D4AF37', borderRadius: '1px' }}
                      />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#382845', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                  {trackName}
                </span>
              </div>

              {/* Expand volume controls & custom audio uploader */}
              {isExpanded && (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{
                      width: '75px',
                      accentColor: '#D4AF37',
                      cursor: 'pointer'
                    }}
                    title={`Volume: ${isMuted ? 0 : volume}%`}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#7B5E99', minWidth: '30px' }}>
                    {isMuted ? '0%' : `${volume}%`}
                  </span>

                  {/* Upload Custom Audio File */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={handleCustomAudioUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Custom MP3 Track"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#8E6D1C',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    <Music size={12} />
                    <span>Custom MP3</span>
                  </button>
                </div>
              )}

              {/* Volume / Mute toggle */}
              <button
                onClick={handleToggleMute}
                onPointerDown={(e) => e.stopPropagation()}
                title={isMuted ? 'Unmute All Sound' : 'Mute Sound'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isMuted ? '#C97A8F' : '#6A4D88',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '50%'
                }}
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>

              {/* Expand Slider Toggle */}
              <button
                onClick={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Toggle Volume Slider & Track Options"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8A7A9E',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '50%'
                }}
              >
                <Sliders size={15} />
              </button>

              {/* Minimize / Hide Button */}
              <button
                onClick={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  soundManager.playButtonClick();
                  setIsMinimized(true);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Hide Atmosphere Player"
                style={{
                  background: 'rgba(123, 94, 153, 0.12)',
                  border: 'none',
                  color: '#8A7A9E',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  marginLeft: '2px',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Hide music player"
              >
                <ChevronDown size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
