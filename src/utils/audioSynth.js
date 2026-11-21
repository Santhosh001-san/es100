// Audio Synthesis Engine for "The Unexpected Package"
// Uses Web Audio API for rich, audible, high-quality music box & sound effects
// Supports procedural soundtrack AND custom MP3 audio playback

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.8; // Default 80% volume for clear audibility
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.activeOscillators = [];
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.customAudio = null;
    this.hasCustomTrack = false;
    this.customTrackName = 'Heartfelt Melody';
    this.echoDelay = null;
    this.echoFeedback = null;
    this.echoFilter = null;
    this.echoWetGain = null;
  }

  async init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music Gain (Loud & Clear, 0.9)
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // Spatial Stereo Reverb & Ambient Echo Bus for heartmelting warmth
        this.echoDelay = this.ctx.createDelay(1.5);
        this.echoDelay.delayTime.setValueAtTime(0.36, this.ctx.currentTime);

        this.echoFeedback = this.ctx.createGain();
        this.echoFeedback.gain.setValueAtTime(0.35, this.ctx.currentTime);

        this.echoFilter = this.ctx.createBiquadFilter();
        this.echoFilter.type = 'lowpass';
        this.echoFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);

        // Loop: delay -> filter -> feedback -> delay
        this.echoDelay.connect(this.echoFilter);
        this.echoFilter.connect(this.echoFeedback);
        this.echoFeedback.connect(this.echoDelay);

        // Wet signal to master
        this.echoWetGain = this.ctx.createGain();
        this.echoWetGain.gain.setValueAtTime(0.36, this.ctx.currentTime);
        this.echoFilter.connect(this.echoWetGain);
        this.echoWetGain.connect(this.masterGain);

        // SFX Gain (0.8)
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume error:', e);
      }
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    const effectiveVol = this.isMuted ? 0 : this.volume;

    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      } catch {
        this.masterGain.gain.value = effectiveVol;
      }
    }

    if (this.customAudio) {
      this.customAudio.volume = effectiveVol;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  // --- Sound Effects with boosted clarity ---

  playButtonClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (err) {
      console.warn(err);
    }
  }

  playRibbonUntie() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Soft whoosh
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(3600, now + 0.3);
      filter.Q.value = 2.5;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);

      // Chimes
      [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const t = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playGiftOpen() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.055;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + 0.75);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playEnvelopeOpen() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.07);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);

      [659.25, 880, 1174.66].forEach((f, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const t = now + 0.05 + i * 0.06;

        o.type = 'sine';
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        o.connect(g);
        g.connect(this.sfxGain);
        o.start(t);
        o.stop(t + 0.36);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playQuizSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.36);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playStarChime(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Celestial crystal bell arpeggio (C#6 - E6 - G#6 - C#7)
      const freqs = [1108.73, 1318.51, 1661.22, 2217.46].map(f => f * pitchMultiplier);
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.75);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playSealBreak() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.58);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.50, d: 0.35 },
        { f: 880.00, d: 0.15 },
        { f: 1046.50, d: 0.65 }
      ];

      let offset = 0;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + offset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + n.d + 0.05);

        offset += n.d * 0.85;
      });
    } catch (err) {
      console.warn(err);
    }
  }

  // --- Beautiful Acoustic Music Box / Celeste Synthesizer Note Generator ---
  playMusicBoxTone(freq, time, duration = 2.4, velocity = 0.35) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Octave harmonic shimmer for luxury music box / chime resonance
      const harmonicOsc = this.ctx.createOscillator();
      const harmonicGain = this.ctx.createGain();

      // Soft crystalline sparkle (3x harmonic, delicate)
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();

      // Warm tone shaping filter (soft, romantic, zero harshness)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      harmonicOsc.type = 'sine';
      harmonicOsc.frequency.setValueAtTime(freq * 2, time);

      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(freq * 3, time);

      const attack = 0.010;
      const peak = Math.max(0.08, Math.min(0.55, velocity));

      // Primary note envelope - natural bell curve
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peak, time + attack);
      gain.gain.exponentialRampToValueAtTime(peak * 0.42, time + 0.24);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      // Octave harmonic shimmer envelope
      harmonicGain.gain.setValueAtTime(0.0001, time);
      harmonicGain.gain.linearRampToValueAtTime(peak * 0.35, time + attack);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.75);

      // Sparkle envelope
      sparkleGain.gain.setValueAtTime(0.0001, time);
      sparkleGain.gain.linearRampToValueAtTime(peak * 0.12, time + attack);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.45);

      osc.connect(gain);
      gain.connect(filter);

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(filter);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(filter);

      filter.connect(this.musicGain);

      // Feed softly into spatial echo reverb bus for lush, dreamy ambient reverberation
      if (this.echoDelay) {
        filter.connect(this.echoDelay);
      }

      osc.start(time);
      osc.stop(time + duration + 0.15);

      harmonicOsc.start(time);
      harmonicOsc.stop(time + duration * 0.8);

      sparkleOsc.start(time);
      sparkleOsc.stop(time + duration * 0.5);

      this.activeOscillators.push(osc, harmonicOsc, sparkleOsc);
      setTimeout(() => {
        this.activeOscillators = this.activeOscillators.filter(o => o !== osc && o !== harmonicOsc && o !== sparkleOsc);
      }, (duration + 0.3) * 1000);
    } catch (e) {
      console.warn(e);
    }
  }

  // Warm, Ethereal Ambient Chord Pad (gives deep emotional, heartmelting resonance)
  playAmbientPad(frequencies, time, duration = 3.6, volume = 0.085) {
    if (!this.ctx || this.isMuted) return;
    frequencies.forEach((freq) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.7);
        gain.gain.exponentialRampToValueAtTime(volume * 0.75, time + duration * 0.75);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + duration + 0.1);

        this.activeOscillators.push(osc);
        setTimeout(() => {
          this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
        }, (duration + 0.2) * 1000);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  // Deep Warm Acoustic Bass Note
  playBassTone(freq, time, duration = 2.8, velocity = 0.32) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(velocity, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + duration + 0.1);

      this.activeOscillators.push(osc);
      setTimeout(() => {
        this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
      }, (duration + 0.2) * 1000);
    } catch (e) {
      console.warn(e);
    }
  }

  // --- Procedural Soundtrack: "Heartfelt Melody for Commander" ---
  // Beautiful, heartmelting 16-bar music-box lullaby in F Major & D Minor
  async startAmbientMusic() {
    if (this.hasCustomTrack && this.customAudio) {
      try {
        await this.customAudio.play();
        this.isMusicPlaying = true;
        return;
      } catch (e) {
        console.warn('Custom audio playback failed, falling back to synth:', e);
      }
    }

    await this.init();
    if (!this.ctx) return;
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // 16 Emotional, Heartmelting Bars in F Major & D Minor
    const songBars = [
      // Bar 1: F(add9) - Tender Awakening
      {
        bass: 87.31, // F2
        pad: [174.61, 261.63, 392.00],
        arpeggios: [{ f: 261.63, t: 0.4 }, { f: 349.23, t: 0.8 }, { f: 440.00, t: 1.2 }, { f: 523.25, t: 1.6 }],
        melody: [{ f: 523.25, t: 0.0, d: 1.1 }, { f: 659.25, t: 0.8, d: 0.9 }, { f: 783.99, t: 1.6, d: 1.1 }, { f: 698.46, t: 2.4, d: 1.6 }]
      },
      // Bar 2: Dm9 - Quiet Reflection & Longing
      {
        bass: 73.42, // D2
        pad: [146.83, 220.00, 349.23],
        arpeggios: [{ f: 220.00, t: 0.4 }, { f: 293.66, t: 0.8 }, { f: 349.23, t: 1.2 }, { f: 440.00, t: 1.6 }],
        melody: [{ f: 659.25, t: 0.0, d: 1.1 }, { f: 587.33, t: 0.8, d: 0.9 }, { f: 523.25, t: 1.6, d: 1.1 }, { f: 440.00, t: 2.4, d: 1.5 }]
      },
      // Bar 3: Bbmaj9 - Starry Night & Little Smiles
      {
        bass: 58.27, // Bb1
        pad: [233.08, 293.66, 349.23],
        arpeggios: [{ f: 174.61, t: 0.4 }, { f: 233.08, t: 0.8 }, { f: 293.66, t: 1.2 }, { f: 349.23, t: 1.6 }],
        melody: [{ f: 587.33, t: 0.0, d: 0.9 }, { f: 698.46, t: 0.8, d: 0.9 }, { f: 880.00, t: 1.6, d: 1.2 }, { f: 783.99, t: 2.4, d: 1.6 }]
      },
      // Bar 4: C9sus4 -> C7 - Gentle Sigh
      {
        bass: 65.41, // C2
        pad: [130.81, 196.00, 349.23],
        arpeggios: [{ f: 196.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 329.63, t: 1.2 }, { f: 392.00, t: 1.6 }],
        melody: [{ f: 783.99, t: 0.0, d: 0.8 }, { f: 698.46, t: 0.8, d: 0.8 }, { f: 659.25, t: 1.6, d: 1.0 }, { f: 587.33, t: 2.2, d: 0.6 }, { f: 523.25, t: 2.6, d: 1.4 }]
      },
      // Bar 5: Fadd9 - Pure Tenderness
      {
        bass: 87.31, // F2
        pad: [174.61, 220.00, 261.63],
        arpeggios: [{ f: 220.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 349.23, t: 1.2 }, { f: 440.00, t: 1.6 }],
        melody: [{ f: 440.00, t: 0.0, d: 0.8 }, { f: 523.25, t: 0.6, d: 0.8 }, { f: 698.46, t: 1.2, d: 1.2 }, { f: 659.25, t: 2.0, d: 0.8 }, { f: 698.46, t: 2.6, d: 1.3 }]
      },
      // Bar 6: Dm9 / A - Unspoken Warmth
      {
        bass: 73.42, // D2
        pad: [146.83, 174.61, 261.63],
        arpeggios: [{ f: 174.61, t: 0.4 }, { f: 220.00, t: 0.8 }, { f: 261.63, t: 1.2 }, { f: 329.63, t: 1.6 }],
        melody: [{ f: 698.46, t: 0.0, d: 1.0 }, { f: 880.00, t: 0.8, d: 1.0 }, { f: 783.99, t: 1.6, d: 1.0 }, { f: 659.25, t: 2.4, d: 1.5 }]
      },
      // Bar 7: Gm9 - A Little Keepsake
      {
        bass: 98.00, // G2
        pad: [196.00, 233.08, 293.66],
        arpeggios: [{ f: 293.66, t: 0.4 }, { f: 349.23, t: 0.8 }, { f: 466.16, t: 1.2 }, { f: 587.33, t: 1.6 }],
        melody: [{ f: 587.33, t: 0.0, d: 0.9 }, { f: 698.46, t: 0.8, d: 0.9 }, { f: 932.33, t: 1.6, d: 1.2 }, { f: 880.00, t: 2.4, d: 1.5 }]
      },
      // Bar 8: C7sus4 -> C7 - Promise of Tomorrow
      {
        bass: 65.41, // C2
        pad: [130.81, 196.00, 233.08],
        arpeggios: [{ f: 329.63, t: 0.4 }, { f: 392.00, t: 0.8 }, { f: 466.16, t: 1.2 }, { f: 523.25, t: 1.6 }],
        melody: [{ f: 783.99, t: 0.0, d: 0.9 }, { f: 880.00, t: 0.8, d: 0.8 }, { f: 783.99, t: 1.4, d: 0.8 }, { f: 659.25, t: 2.0, d: 0.8 }, { f: 523.25, t: 2.6, d: 1.4 }]
      },
      // Bar 9: Bbmaj9 - SOARING CLIMAX (Tears of Joy)
      {
        bass: 58.27, // Bb1
        pad: [116.54, 174.61, 293.66, 440.00],
        arpeggios: [{ f: 293.66, t: 0.4 }, { f: 349.23, t: 0.8 }, { f: 440.00, t: 1.2 }, { f: 523.25, t: 1.6 }],
        melody: [{ f: 587.33, t: 0.0, d: 0.8 }, { f: 698.46, t: 0.6, d: 0.8 }, { f: 1046.50, t: 1.2, d: 1.4 }, { f: 932.33, t: 2.2, d: 1.8 }]
      },
      // Bar 10: Am7 - Tender Reflection
      {
        bass: 110.00, // A2
        pad: [110.00, 164.81, 261.63, 392.00],
        arpeggios: [{ f: 261.63, t: 0.4 }, { f: 329.63, t: 0.8 }, { f: 392.00, t: 1.2 }, { f: 440.00, t: 1.6 }],
        melody: [{ f: 880.00, t: 0.0, d: 1.0 }, { f: 783.99, t: 0.8, d: 0.9 }, { f: 698.46, t: 1.6, d: 1.0 }, { f: 659.25, t: 2.4, d: 1.5 }]
      },
      // Bar 11: Gm9 - Laughter Through Ordinary Days
      {
        bass: 98.00, // G2
        pad: [98.00, 146.83, 233.08, 349.23],
        arpeggios: [{ f: 233.08, t: 0.4 }, { f: 293.66, t: 0.8 }, { f: 349.23, t: 1.2 }, { f: 392.00, t: 1.6 }],
        melody: [{ f: 698.46, t: 0.0, d: 0.9 }, { f: 587.33, t: 0.8, d: 0.9 }, { f: 783.99, t: 1.6, d: 1.1 }, { f: 698.46, t: 2.4, d: 1.5 }]
      },
      // Bar 12: Fmaj9 / A - Safe Haven
      {
        bass: 87.31, // F2
        pad: [87.31, 130.81, 220.00, 329.63],
        arpeggios: [{ f: 220.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 329.63, t: 1.2 }, { f: 349.23, t: 1.6 }],
        melody: [{ f: 659.25, t: 0.0, d: 1.0 }, { f: 523.25, t: 0.8, d: 0.9 }, { f: 587.33, t: 1.6, d: 1.0 }, { f: 523.25, t: 2.4, d: 1.6 }]
      },
      // Bar 13: Bbmaj9 - 100 Days of Starlight
      {
        bass: 58.27, // Bb1
        pad: [116.54, 146.83, 174.61, 261.63],
        arpeggios: [{ f: 174.61, t: 0.4 }, { f: 220.00, t: 0.8 }, { f: 293.66, t: 1.2 }, { f: 349.23, t: 1.6 }],
        melody: [{ f: 698.46, t: 0.0, d: 0.8 }, { f: 783.99, t: 0.6, d: 0.8 }, { f: 880.00, t: 1.2, d: 1.0 }, { f: 1046.50, t: 2.0, d: 1.8 }]
      },
      // Bar 14: Dm9 - Deep In My Heart
      {
        bass: 73.42, // D2
        pad: [146.83, 220.00, 261.63, 329.63],
        arpeggios: [{ f: 220.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 329.63, t: 1.2 }, { f: 349.23, t: 1.6 }],
        melody: [{ f: 880.00, t: 0.0, d: 0.9 }, { f: 698.46, t: 0.8, d: 0.9 }, { f: 587.33, t: 1.6, d: 0.9 }, { f: 659.25, t: 2.4, d: 1.5 }]
      },
      // Bar 15: C7sus4 -> C7 - Always Here For You
      {
        bass: 65.41, // C2
        pad: [130.81, 196.00, 233.08, 293.66],
        arpeggios: [{ f: 196.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 329.63, t: 1.2 }, { f: 392.00, t: 1.6 }],
        melody: [{ f: 783.99, t: 0.0, d: 0.8 }, { f: 659.25, t: 0.7, d: 0.8 }, { f: 698.46, t: 1.4, d: 0.8 }, { f: 783.99, t: 2.1, d: 1.4 }]
      },
      // Bar 16: F(add9) / C - Stay Happy, Commander
      {
        bass: 87.31, // F2
        pad: [87.31, 130.81, 220.00, 392.00],
        arpeggios: [{ f: 220.00, t: 0.4 }, { f: 261.63, t: 0.8 }, { f: 329.63, t: 1.2 }, { f: 392.00, t: 1.6 }],
        melody: [{ f: 880.00, t: 0.0, d: 0.8 }, { f: 783.99, t: 0.6, d: 0.8 }, { f: 698.46, t: 1.2, d: 1.0 }, { f: 523.25, t: 2.0, d: 1.2 }, { f: 349.23, t: 2.6, d: 2.2 }]
      }
    ];

    let currentBar = 0;
    const barDuration = 3.2; // 3.2s per bar, gentle 75 BPM unhurried emotional tempo

    const scheduleBar = () => {
      if (!this.isMusicPlaying || !this.ctx) return;

      const baseTime = Math.max(this.ctx.currentTime + 0.05, 0.05);
      const bar = songBars[currentBar % songBars.length];

      // 1. Warm ethereal ambient chord pad (fills the air with rich emotion)
      if (bar.pad && bar.pad.length > 0) {
        this.playAmbientPad(bar.pad, baseTime, barDuration + 0.5, 0.08);
      }

      // 2. Play deep warm acoustic bass
      if (bar.bass) {
        this.playBassTone(bar.bass, baseTime, 3.0, 0.30);
      }

      // 3. Play gentle accompaniment arpeggio
      if (bar.arpeggios) {
        bar.arpeggios.forEach((note) => {
          this.playMusicBoxTone(note.f, baseTime + note.t, 2.0, 0.24);
        });
      }

      // 4. Play expressive heartmelting lead melody
      if (bar.melody) {
        bar.melody.forEach((note) => {
          this.playMusicBoxTone(note.f, baseTime + note.t, note.d || 1.6, 0.38);
        });
      }

      currentBar++;
      this.musicTimer = setTimeout(scheduleBar, barDuration * 1000);
    };

    scheduleBar();
  }

  stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }

    if (this.customAudio) {
      this.customAudio.pause();
    }

    // Stop lingering oscillators gracefully
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    });
    this.activeOscillators = [];
  }

  async toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopAmbientMusic();
      return false;
    } else {
      await this.startAmbientMusic();
      return true;
    }
  }

  // Load a local custom audio file (MP3 / WAV) from the device
  loadCustomAudioFile(file) {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    const url = URL.createObjectURL(file);
    this.customAudio = new Audio(url);
    this.customAudio.loop = true;
    this.customAudio.volume = this.isMuted ? 0 : this.volume;
    this.hasCustomTrack = true;
    this.customTrackName = file.name.replace(/\.[^/.]+$/, '').slice(0, 18);

    if (this.isMusicPlaying) {
      this.stopAmbientMusic();
      this.startAmbientMusic();
    }
    return this.customTrackName;
  }
}

export const soundManager = new SoundManager();
