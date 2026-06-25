/**
 * announcer.ts
 * Street-Fighter / Mortal-Kombat style "Ready! … FIGHT!" voice system.
 *
 * Combines:
 *  • Web Speech API  – female voice, carefully tuned pitch/rate
 *  • Web Audio API   – synthesised SFX:
 *                       "Ready!" → sparkly rising chime
 *                       "FIGHT!" → war-cry osc + metallic ring + hall reverb
 */

// ─── AudioContext (lazy, singleton) ──────────────────────────────────────
let _ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
  }
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Synthetic convolution reverb — size controlled by decay (seconds). */
function makeReverb(ctx: AudioContext, decay: number): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * decay);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.8);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

/** Hard-clip waveshaper — turns clean oscillators into gritty distortion. */
function makeDistortion(ctx: AudioContext, amount: number): WaveShaperNode {
  const samples = 512;
  const curve   = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x  = (i * 2) / samples - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  const ws = ctx.createWaveShaper();
  ws.curve      = curve;
  ws.oversample = '4x';
  return ws;
}

// ─── "READY!" SFX ────────────────────────────────────────────────────────
// Sparkly ascending chime — builds sweet anticipation
function playReadySFX() {
  try {
    const ctx  = getCtx();
    const now  = ctx.currentTime;
    const verb = makeReverb(ctx, 0.25);
    verb.connect(ctx.destination);

    // Rising harmonic chime cascade
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, now + i * 0.07);
      osc.frequency.exponentialRampToValueAtTime(freq, now + i * 0.07 + 0.18);
      gain.gain.setValueAtTime(0,     now + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.28, now + i * 0.07 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.6);
      osc.connect(gain); gain.connect(verb);
      osc.start(now + i * 0.07);
      osc.stop(now  + i * 0.07 + 0.65);
    });

    // Hi-freq glitter burst
    const glitterLen = Math.floor(ctx.sampleRate * 0.22);
    const gBuf = ctx.createBuffer(1, glitterLen, ctx.sampleRate);
    const gd   = gBuf.getChannelData(0);
    for (let i = 0; i < glitterLen; i++) gd[i] = Math.random() * 2 - 1;
    const glitter  = ctx.createBufferSource();
    glitter.buffer = gBuf;
    const hiPass   = ctx.createBiquadFilter();
    hiPass.type            = 'highpass';
    hiPass.frequency.value = 5500;
    const gGain = ctx.createGain();
    gGain.gain.setValueAtTime(0.14, now);
    gGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    glitter.connect(hiPass); hiPass.connect(gGain); gGain.connect(ctx.destination);
    glitter.start(now);
  } catch (_) {}
}

// ─── "FIGHT!" SFX ────────────────────────────────────────────────────────
// War-cry oscillator + metallic ring + hall reverb + compressor
function playFightSFX() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // ── Master chain: compressor → destination ────────────────────────────
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value      = 3;
    comp.ratio.value     = 10;
    comp.attack.value    = 0.001;
    comp.release.value   = 0.12;
    comp.connect(ctx.destination);

    // ── Long epic hall reverb (separate tail send) ────────────────────────
    const verb = makeReverb(ctx, 1.1); // 1.1 s = arena echo
    verb.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = 1.5;
    master.connect(comp);

    const verbSend = ctx.createGain();
    verbSend.gain.value = 0.55;
    master.connect(verbSend);
    verbSend.connect(verb);

    // ── WAR-CRY OSCILLATOR — distorted "throat" battle-scream ────────────
    const cry     = ctx.createOscillator();
    const cryDist = makeDistortion(ctx, 380);
    const cryForm = ctx.createBiquadFilter();
    cryForm.type  = 'bandpass';
    cryForm.frequency.setValueAtTime(900, now);
    cryForm.frequency.exponentialRampToValueAtTime(600, now + 0.6);
    cryForm.Q.value = 2.5;
    const cryGain = ctx.createGain();

    cry.type = 'sawtooth';
    cry.frequency.setValueAtTime(85,  now);
    cry.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    cry.frequency.setValueAtTime(130, now + 0.08);
    cry.frequency.exponentialRampToValueAtTime(100, now + 0.7);

    cryGain.gain.setValueAtTime(0,    now);
    cryGain.gain.linearRampToValueAtTime(0.9, now + 0.03);
    cryGain.gain.setValueAtTime(0.75, now + 0.35);
    cryGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    cry.connect(cryDist); cryDist.connect(cryForm);
    cryForm.connect(cryGain); cryGain.connect(master);
    cry.start(now); cry.stop(now + 0.85);

    // ── METALLIC RING OVERTONE — sword-clash shimmer ──────────────────────
    const ring  = ctx.createOscillator();
    const rGain = ctx.createGain();
    ring.type = 'sawtooth';
    ring.frequency.setValueAtTime(1400, now);
    ring.frequency.exponentialRampToValueAtTime(320, now + 0.2);
    rGain.gain.setValueAtTime(0.35, now);
    rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    ring.connect(rGain); rGain.connect(master);
    ring.start(now); ring.stop(now + 0.25);

  } catch (_) {}
}

// ─── Voice priority list ──────────────────────────────────────────────────
const FEMALE_PRIORITY = [
  'Google UK English Female',
  'Google US English Female',
  'Microsoft Zira Desktop - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Samantha',
  'Karen',
  'Moira',
  'Tessa',
  'Victoria',
  'Fiona',
  'en-US-Neural2-F',
  'en-GB-Neural2-A',
];

function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of FEMALE_PRIORITY) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  return (
    voices.find(v =>
      /female|woman|girl|zira|samantha|karen|moira|tessa|victoria|fiona|veena|joanna|salli|kimberly|kendra|ivy|aria|jenny|libby|nadia|lucia/i.test(v.name)
    ) ?? null
  );
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Call on first user gesture (Play button click) to warm up
 * AudioContext + voice list before the game starts.
 */
export function warmUpAnnouncer() {
  try {
    window.speechSynthesis?.getVoices();
    getCtx();
  } catch (_) {}
}

/** "Ready!" — sparkly chime + bright female TTS. */
export function announceReady(): Promise<void> {
  return new Promise(resolve => {
    try {
      playReadySFX();
      const synth = window.speechSynthesis;

      const fire = (voices: SpeechSynthesisVoice[]) => {
        const utter = new SpeechSynthesisUtterance('Ready!');
        const voice = pickFemaleVoice(voices);
        if (voice) utter.voice = voice;
        utter.pitch  = 1.28;
        utter.rate   = 0.60;
        utter.volume = 1;
        utter.onend  = () => resolve();
        synth.cancel();
        synth.speak(utter);
        setTimeout(resolve, 1400);
      };

      const voices = synth.getVoices();
      if (voices.length > 0) {
        fire(voices);
      } else {
        synth.addEventListener('voiceschanged', () => fire(synth.getVoices()), { once: true });
        setTimeout(() => fire(synth.getVoices()), 400);
      }
    } catch (_) { resolve(); }
  });
}

/** "FIGHT!" — war-cry SFX + deep powerful female TTS. */
export function announceFight(): Promise<void> {
  return new Promise(resolve => {
    try {
      playFightSFX();
      const synth = window.speechSynthesis;

      const fire = (voices: SpeechSynthesisVoice[]) => {
        const utter = new SpeechSynthesisUtterance('Fight!');
        const voice = pickFemaleVoice(voices);
        if (voice) utter.voice = voice;
        utter.pitch  = 0.65;
        utter.rate   = 0.44;
        utter.volume = 1;
        utter.onend  = () => resolve();
        synth.cancel();
        synth.speak(utter);
        setTimeout(resolve, 1500);
      };

      const voices = synth.getVoices();
      if (voices.length > 0) {
        fire(voices);
      } else {
        synth.addEventListener('voiceschanged', () => fire(synth.getVoices()), { once: true });
        setTimeout(() => fire(synth.getVoices()), 400);
      }
    } catch (_) { resolve(); }
  });
}
