/**
 * Multi-Theme Royal Indian Wedding Music Generator & Player
 * Generates custom synthesized traditional music for each ceremony:
 * - Tilak (21 Nov): Sacred Vedic chants, meditative flute & temple bells
 * - Haldi & Matkor (24 Nov): Lively folk dholak rhythm & bright flute melody
 * - Wedding (25 Nov): Grand Royal Shehnai (Bhairavi / Yaman) with nagada resonance
 * - Mehendi (26 Nov): Peppy henna dance rhythms, ghungroo & festive sangeet
 */

class WeddingSoundtrack {
  constructor() {
    this.isPlaying = false;
    this.audioCtx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.timerId = null;
    this.rhythmTimerId = null;
    this.initialized = false;
    this.currentTheme = 'wedding'; // default theme

    // Traditional Indian Musical Scales
    this.scales = {
      // Royal Yaman / Bhairavi for Wedding
      wedding: [
        { freq: 277.18 }, // C#4 Sa
        { freq: 311.13 }, // D#4 Re
        { freq: 349.23 }, // F4 Ga
        { freq: 392.00 }, // G4 Teevra Ma
        { freq: 415.30 }, // G#4 Pa
        { freq: 466.16 }, // A#4 Dha
        { freq: 523.25 }, // C5 Ni
        { freq: 554.37 }  // C#5 Taar Sa
      ],
      // Meditative Bhairav / Shloka scale for Tilak
      tilak: [
        { freq: 261.63 }, // C4
        { freq: 277.18 }, // C#4 Komal Re
        { freq: 329.63 }, // E4 Shuddha Ga
        { freq: 349.23 }, // F4 Shuddha Ma
        { freq: 392.00 }, // G4 Pa
        { freq: 415.30 }, // G#4 Komal Dha
        { freq: 493.88 }, // B4 Shuddha Ni
        { freq: 523.25 }  // C5 Taar Sa
      ],
      // Bouncy folk Pahadi scale for Haldi & Matkor
      haldi: [
        { freq: 293.66 }, // D4 Sa
        { freq: 329.63 }, // E4 Re
        { freq: 369.99 }, // F#4 Ga
        { freq: 440.00 }, // A4 Pa
        { freq: 493.88 }, // B4 Dha
        { freq: 587.33 }  // D5 Taar Sa
      ],
      // Festive Peppy Sangeet scale for Mehendi
      mehendi: [
        { freq: 311.13 }, // Eb4 Sa
        { freq: 349.23 }, // F4 Re
        { freq: 392.00 }, // G4 Ga
        { freq: 415.30 }, // Ab4 Ma
        { freq: 466.16 }, // Bb4 Pa
        { freq: 523.25 }, // C5 Dha
        { freq: 622.25 }  // Eb5 Taar Sa
      ]
    };

    // Melody sequences per ceremony
    this.melodies = {
      wedding: [
        { note: 0, dur: 1.2 }, { note: 1, dur: 0.8 }, { note: 2, dur: 1.5 },
        { note: 3, dur: 1.0 }, { note: 4, dur: 2.0 }, { note: 3, dur: 0.8 },
        { note: 2, dur: 1.2 }, { note: 1, dur: 1.0 }, { note: 0, dur: 2.4 },
        { note: 4, dur: 1.2 }, { note: 5, dur: 1.0 }, { note: 6, dur: 1.2 },
        { note: 7, dur: 2.2 }, { note: 4, dur: 1.5 }, { note: 2, dur: 1.2 }, { note: 0, dur: 2.8 }
      ],
      tilak: [
        { note: 0, dur: 2.2 }, { note: 1, dur: 1.6 }, { note: 2, dur: 2.0 },
        { note: 4, dur: 2.5 }, { note: 3, dur: 1.4 }, { note: 2, dur: 1.8 },
        { note: 1, dur: 2.0 }, { note: 0, dur: 3.2 }
      ],
      haldi: [
        { note: 0, dur: 0.45 }, { note: 1, dur: 0.45 }, { note: 2, dur: 0.6 },
        { note: 3, dur: 0.5 },  { note: 2, dur: 0.45 }, { note: 1, dur: 0.45 },
        { note: 0, dur: 0.8 },  { note: 3, dur: 0.6 },  { note: 4, dur: 0.7 },
        { note: 5, dur: 1.1 },  { note: 3, dur: 0.5 },  { note: 2, dur: 0.8 }
      ],
      mehendi: [
        { note: 0, dur: 0.38 }, { note: 2, dur: 0.38 }, { note: 4, dur: 0.6 },
        { note: 3, dur: 0.38 }, { note: 2, dur: 0.38 }, { note: 4, dur: 0.65 },
        { note: 5, dur: 0.5 },  { note: 6, dur: 0.9 },  { note: 4, dur: 0.4 },
        { note: 2, dur: 0.4 },  { note: 0, dur: 0.85 }
      ]
    };

    this.themeNames = {
      wedding: "Grand Royal Shehnai (Shubh Vivah)",
      tilak: "Vedic Chants & Devotional Flute (Tilak)",
      haldi: "Lively Folk Dholak & Mangal Geet (Haldi & Matkor)",
      mehendi: "Peppy Henna Dance & Ghungroo (Mehendi)"
    };

    this.melodyIndex = 0;
  }

  initAudio() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.audioCtx = new AudioContextClass();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.38, this.audioCtx.currentTime);

      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(2600, this.audioCtx.currentTime);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.audioCtx.destination);

      this.startDrone();
      this.initialized = true;
    } catch (err) {
      console.warn("Web Audio initialization skipped:", err);
    }
  }

  startDrone() {
    if (!this.audioCtx) return;
    this.droneGain = this.audioCtx.createGain();
    this.droneGain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    this.droneGain.connect(this.masterGain);

    const baseFreqs = [138.59, 207.65, 277.18];
    baseFreqs.forEach(freq => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const f = this.audioCtx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(300, this.audioCtx.currentTime);

      osc.connect(f);
      f.connect(this.droneGain);
      osc.start();
    });
  }

  playPercussionHit(type = 'dholak') {
    if (!this.audioCtx || !this.isPlaying) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    if (type === 'dholak_bass') {
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    } else if (type === 'ghungroo') {
      // Ghungroo high chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1900 + Math.random() * 400, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    } else {
      // Dholak treble slap
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playShehnaiNote(freq, duration, timbre = 'shehnai') {
    if (!this.audioCtx || !this.isPlaying) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    if (timbre === 'flute') {
      osc1.type = 'sine';
      osc2.type = 'triangle';
    } else {
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
    }

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.002, now);

    // Expressive vibrato (gamak/meend)
    const vibrato = this.audioCtx.createOscillator();
    const vibratoGain = this.audioCtx.createGain();
    const vibSpeed = timbre === 'flute' ? 4.5 : 5.4;
    vibrato.frequency.setValueAtTime(vibSpeed, now);
    vibratoGain.gain.setValueAtTime(timbre === 'flute' ? 1.5 : 2.8, now);
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);
    vibrato.start();

    // Envelope
    const attack = timbre === 'flute' ? 0.2 : 0.12;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.2, now + attack);
    noteGain.gain.setValueAtTime(0.18, now + duration * 0.7);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const bp = this.audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(timbre === 'flute' ? 880 : 1250, now);
    bp.Q.setValueAtTime(1.4, now);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(bp);
    bp.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);
  }

  playTempleBell() {
    if (!this.audioCtx || !this.isPlaying) return;
    const now = this.audioCtx.currentTime;
    const bellOsc = this.audioCtx.createOscillator();
    const bellGain = this.audioCtx.createGain();

    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(1108.73, now);
    bellGain.gain.setValueAtTime(0.08, now);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    bellOsc.connect(bellGain);
    bellGain.connect(this.masterGain);
    bellOsc.start(now);
    bellOsc.stop(now + 2.6);
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;

    const currentMelody = this.melodies[this.currentTheme] || this.melodies.wedding;
    const currentScale = this.scales[this.currentTheme] || this.scales.wedding;

    const item = currentMelody[this.melodyIndex % currentMelody.length];
    const freq = currentScale[item.note % currentScale.length].freq;
    const duration = item.dur;

    const timbre = (this.currentTheme === 'tilak') ? 'flute' : 'shehnai';
    this.playShehnaiNote(freq, duration, timbre);

    // Accompanying instruments according to ceremony
    if (this.currentTheme === 'tilak') {
      if (this.melodyIndex === 0 || this.melodyIndex === 4) {
        this.playTempleBell();
      }
    } else if (this.currentTheme === 'haldi') {
      // Lively Dholak pattern
      this.playPercussionHit('dholak_bass');
      setTimeout(() => this.playPercussionHit('dholak_treble'), duration * 400);
    } else if (this.currentTheme === 'mehendi') {
      // Ghungroo & Sangeet beat
      this.playPercussionHit('ghungroo');
      setTimeout(() => this.playPercussionHit('dholak_bass'), duration * 300);
      setTimeout(() => this.playPercussionHit('ghungroo'), duration * 600);
    } else {
      // Wedding: occasional temple chime & soft nagada
      if (this.melodyIndex % 4 === 0) {
        this.playPercussionHit('dholak_bass');
      }
      if (this.melodyIndex === 0) {
        this.playTempleBell();
      }
    }

    this.melodyIndex = (this.melodyIndex + 1) % currentMelody.length;

    this.timerId = setTimeout(() => {
      this.scheduleNextNote();
    }, duration * 950);
  }

  setTheme(themeName) {
    if (!this.melodies[themeName]) return;
    if (this.currentTheme === themeName && this.isPlaying) return;

    this.currentTheme = themeName;
    this.melodyIndex = 0;

    // Dispatch custom event to notify UI
    window.dispatchEvent(new CustomEvent('weddingThemeChanged', {
      detail: {
        theme: themeName,
        title: this.themeNames[themeName]
      }
    }));

    if (this.isPlaying) {
      clearTimeout(this.timerId);
      this.scheduleNextNote();
    }
  }

  toggle() {
    try {
      if (!this.initialized) {
        this.initAudio();
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn("AudioContext resume/init error:", e);
      return false;
    }

    if (!this.audioCtx) return false;

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(0.36, this.audioCtx.currentTime);
      }
      this.scheduleNextNote();
    } else {
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
      }
      clearTimeout(this.timerId);
    }

    return this.isPlaying;
  }
}

window.weddingSoundtrack = new WeddingSoundtrack();
