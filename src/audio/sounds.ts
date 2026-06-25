let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
  }
  if (sharedCtx.state === 'suspended') sharedCtx.resume();
  return sharedCtx;
}

function closeCtxLater(delay: number) {
  setTimeout(() => {
    if (sharedCtx && sharedCtx.state !== 'closed') {
      try { sharedCtx.close(); } catch (_) {}
      sharedCtx = null;
    }
  }, delay);
}

export function playWerewolfClawSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, t);
    masterGain.connect(ctx.destination);

    const whooshDuration = 0.22;
    const whooshBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * whooshDuration), ctx.sampleRate);
    const whooshData = whooshBuffer.getChannelData(0);
    for (let i = 0; i < whooshData.length; i++) whooshData[i] = Math.random() * 2 - 1;

    const whooshSource = ctx.createBufferSource();
    whooshSource.buffer = whooshBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(400, t);
    bandpass.frequency.exponentialRampToValueAtTime(5000, t + whooshDuration);
    bandpass.Q.value = 0.8;

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.0, t);
    whooshGain.gain.linearRampToValueAtTime(1.1, t + 0.04);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, t + whooshDuration);

    whooshSource.connect(bandpass);
    bandpass.connect(whooshGain);
    whooshGain.connect(masterGain);
    whooshSource.start(t);
    whooshSource.stop(t + whooshDuration);

    const crackBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const crackData = crackBuffer.getChannelData(0);
    for (let i = 0; i < crackData.length; i++) crackData[i] = Math.random() * 2 - 1;

    const crackSource = ctx.createBufferSource();
    crackSource.buffer = crackBuffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 3500;

    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.85, t + 0.03);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    crackSource.connect(highpass);
    highpass.connect(crackGain);
    crackGain.connect(masterGain);
    crackSource.start(t + 0.03);
    crackSource.stop(t + 0.11);

    closeCtxLater(500);
  } catch (e) {}
}

export function playDarkBibleSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, t);
    masterGain.connect(ctx.destination);

    const revLen = Math.floor(ctx.sampleRate * 0.9);
    const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 1.8);
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = revBuf;
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.55, t);
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);

    function crackAt(startT: number, vol: number) {
      const dur = 0.055;
      const bLen = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bLen; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 5000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, startT);
      g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
      src.connect(hp); hp.connect(g); g.connect(masterGain);
      src.start(startT); src.stop(startT + dur + 0.01);
    }

    crackAt(t, 1.2);

    const arcDur = 0.13;
    const arcBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * arcDur), ctx.sampleRate);
    const arcD = arcBuf.getChannelData(0);
    for (let i = 0; i < arcD.length; i++) arcD[i] = Math.random() * 2 - 1;
    const arcSrc = ctx.createBufferSource();
    arcSrc.buffer = arcBuf;
    const arcBP = ctx.createBiquadFilter();
    arcBP.type = 'bandpass';
    arcBP.frequency.setValueAtTime(3000, t + 0.005);
    arcBP.frequency.exponentialRampToValueAtTime(9000, t + arcDur);
    arcBP.Q.value = 1.2;
    const arcGain = ctx.createGain();
    arcGain.gain.setValueAtTime(0.9, t + 0.005);
    arcGain.gain.exponentialRampToValueAtTime(0.001, t + arcDur);
    arcSrc.connect(arcBP); arcBP.connect(arcGain); arcGain.connect(masterGain);
    arcSrc.start(t + 0.005); arcSrc.stop(t + arcDur + 0.01);

    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(110, t + 0.04);
    boomOsc.frequency.exponentialRampToValueAtTime(38, t + 0.55);
    boomGain.gain.setValueAtTime(0, t + 0.04);
    boomGain.gain.linearRampToValueAtTime(1.15, t + 0.07);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.60);
    boomOsc.connect(boomGain);
    boomGain.connect(masterGain);
    boomGain.connect(reverb);
    boomOsc.start(t + 0.04);
    boomOsc.stop(t + 0.65);

    const rumbleDur = 0.5;
    const rBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * rumbleDur), ctx.sampleRate);
    const rD = rBuf.getChannelData(0);
    for (let i = 0; i < rD.length; i++) rD[i] = Math.random() * 2 - 1;
    const rSrc = ctx.createBufferSource();
    rSrc.buffer = rBuf;
    const rLP = ctx.createBiquadFilter();
    rLP.type = 'lowpass';
    rLP.frequency.value = 140;
    const rGain = ctx.createGain();
    rGain.gain.setValueAtTime(0, t + 0.04);
    rGain.gain.linearRampToValueAtTime(0.55, t + 0.10);
    rGain.gain.exponentialRampToValueAtTime(0.001, t + rumbleDur);
    rSrc.connect(rLP); rLP.connect(rGain); rGain.connect(masterGain);
    rSrc.start(t + 0.04); rSrc.stop(t + rumbleDur + 0.02);

    crackAt(t + 0.13, 0.38);
    crackAt(t + 0.26, 0.17);
    crackAt(t + 0.39, 0.07);

    closeCtxLater(1800);
  } catch (e) {}
}

export function playDefendSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, t);
    masterGain.connect(ctx.destination);

    const pulseOsc = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulseOsc.type = 'sine';
    pulseOsc.frequency.setValueAtTime(180, t);
    pulseOsc.frequency.exponentialRampToValueAtTime(1800, t + 0.12);
    pulseGain.gain.setValueAtTime(0, t);
    pulseGain.gain.linearRampToValueAtTime(1.1, t + 0.01);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    pulseOsc.connect(pulseGain);
    pulseGain.connect(masterGain);
    pulseOsc.start(t);
    pulseOsc.stop(t + 0.20);

    const ringFreqs = [1320, 2200, 3300, 4400];
    ringFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const delay = i * 0.018;
      const vol = [0.55, 0.40, 0.28, 0.18][i];
      const decay = [0.38, 0.30, 0.22, 0.16][i];
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(vol, t + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + decay);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + decay + 0.01);
    });

    [220, 222.5].forEach((freq) => {
      const osc = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      bp.type = 'bandpass';
      bp.frequency.value = 900;
      bp.Q.value = 2.5;
      gain.gain.setValueAtTime(0, t + 0.03);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
      osc.connect(bp);
      bp.connect(gain);
      gain.connect(masterGain);
      osc.start(t + 0.03);
      osc.stop(t + 0.42);
    });

    const shimDur = 0.07;
    const shimBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * shimDur), ctx.sampleRate);
    const shimData = shimBuf.getChannelData(0);
    for (let i = 0; i < shimData.length; i++) shimData[i] = Math.random() * 2 - 1;
    const shimSrc = ctx.createBufferSource();
    shimSrc.buffer = shimBuf;
    const shimHP = ctx.createBiquadFilter();
    shimHP.type = 'highpass';
    shimHP.frequency.value = 6000;
    const shimGain = ctx.createGain();
    shimGain.gain.setValueAtTime(0.7, t);
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + shimDur);
    shimSrc.connect(shimHP);
    shimHP.connect(shimGain);
    shimGain.connect(masterGain);
    shimSrc.start(t);
    shimSrc.stop(t + shimDur + 0.01);

    closeCtxLater(800);
  } catch (e) {}
}

export function playTropicalFruitSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, t);
    masterGain.connect(ctx.destination);

    const pluckNotes = [
      { freq: 523.25, delay: 0.00 },
      { freq: 659.25, delay: 0.10 },
      { freq: 783.99, delay: 0.20 },
      { freq: 1046.5, delay: 0.30 },
    ];
    pluckNotes.forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.55, t + delay + 0.010);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.32);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + 0.35);
    });

    const bellPairs = [
      { freq: 1046.5, delay: 0.30, vol: 0.30, decay: 0.55 },
      { freq: 1318.5, delay: 0.34, vol: 0.22, decay: 0.45 },
      { freq: 1568.0, delay: 0.38, vol: 0.15, decay: 0.35 },
    ];
    bellPairs.forEach(({ freq, delay, vol, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(vol, t + delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + decay);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + decay + 0.01);
    });

    const humOsc = ctx.createOscillator();
    const humGain = ctx.createGain();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(130, t);
    humOsc.frequency.linearRampToValueAtTime(165, t + 0.35);
    humGain.gain.setValueAtTime(0, t);
    humGain.gain.linearRampToValueAtTime(0.28, t + 0.05);
    humGain.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
    humOsc.connect(humGain);
    humGain.connect(masterGain);
    humOsc.start(t);
    humOsc.stop(t + 0.52);

    const dripDur = 0.035;
    const dripBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dripDur), ctx.sampleRate);
    const dripData = dripBuf.getChannelData(0);
    for (let i = 0; i < dripData.length; i++) dripData[i] = Math.random() * 2 - 1;
    const dripSrc = ctx.createBufferSource();
    dripSrc.buffer = dripBuf;
    const dripBP = ctx.createBiquadFilter();
    dripBP.type = 'bandpass';
    dripBP.frequency.value = 800;
    dripBP.Q.value = 3.0;
    const dripGain = ctx.createGain();
    dripGain.gain.setValueAtTime(0.65, t);
    dripGain.gain.exponentialRampToValueAtTime(0.001, t + dripDur);
    dripSrc.connect(dripBP);
    dripBP.connect(dripGain);
    dripGain.connect(masterGain);
    dripSrc.start(t);
    dripSrc.stop(t + dripDur + 0.01);

    closeCtxLater(1200);
  } catch (e) {}
}

export function playDefeatSound() {
  try {
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.72, ctx.currentTime);
    master.connect(ctx.destination);

    const t = ctx.currentTime;

    function scheduleNote(freq: number, start: number, dur: number, vol: number) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 900;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + start);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 4.5;
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start(t + start);
      lfo.stop(t + start + dur + 0.05);

      gain.gain.setValueAtTime(0, t + start);
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);

      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(master);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.05);
    }

    scheduleNote(293.66, 0.00, 0.55, 0.55);
    scheduleNote(220.00, 0.50, 0.55, 0.50);
    scheduleNote(174.61, 1.00, 0.65, 0.45);
    scheduleNote(146.83, 1.55, 1.00, 0.40);

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(80, t);
    bassOsc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    bassGain.gain.setValueAtTime(0.9, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    bassOsc.connect(bassGain);
    bassGain.connect(master);
    bassOsc.start(t);
    bassOsc.stop(t + 0.6);

    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = 73.42;
    droneGain.gain.setValueAtTime(0, t + 0.8);
    droneGain.gain.linearRampToValueAtTime(0.38, t + 1.6);
    droneGain.gain.linearRampToValueAtTime(0.0, t + 3.0);
    droneOsc.connect(droneGain);
    droneGain.connect(master);
    droneOsc.start(t + 0.8);
    droneOsc.stop(t + 3.1);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuf;
    const noiseBpf = ctx.createBiquadFilter();
    noiseBpf.type = 'bandpass';
    noiseBpf.frequency.value = 180;
    noiseBpf.Q.value = 1.2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    noiseNode.connect(noiseBpf);
    noiseBpf.connect(noiseGain);
    noiseGain.connect(master);
    noiseNode.start(t);

    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(60, t + 2.2);
    thudOsc.frequency.exponentialRampToValueAtTime(20, t + 2.7);
    thudGain.gain.setValueAtTime(0.7, t + 2.2);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);
    thudOsc.connect(thudGain);
    thudGain.connect(master);
    thudOsc.start(t + 2.2);
    thudOsc.stop(t + 3.1);

    master.gain.setValueAtTime(0.72, t + 2.5);
    master.gain.linearRampToValueAtTime(0, t + 3.1);

    closeCtxLater(3300);
  } catch (_) {}
}
