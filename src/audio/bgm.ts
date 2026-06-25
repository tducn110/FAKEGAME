let ctx: AudioContext | null = null;
let loopTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleLoop() {
  if (!ctx || ctx.state === 'closed') return;

  const startTime = ctx.currentTime + 0.05;
  const E = 0.25;

  const masterOut = ctx.createGain();
  masterOut.gain.setValueAtTime(0.38, startTime);
  masterOut.connect(ctx.destination);

  const D2=73.42, A2=110, D3=146.83, A3=220;
  const D4=293.66, E4=329.63, Fs4=369.99, G4=392, A4=440, B4=493.88, Cs5=554.37;
  const D5=587.33, E5=659.25, Fs5=739.99, G5=783.99, A5=880;

  const melody = [
    D5,E5,Fs5,E5,D5,B4, A4,B4,A4,G4,Fs4,E4, D4,E4,Fs4,G4,A4,B4,
    A4,Fs4,D4,Fs4,A4,D5, D5,E5,Fs5,E5,D5,B4, A4,B4,Cs5,D5,E5,Fs5,
    G5,Fs5,E5,D5,Cs5,B4, A4,A4,A4,D5,D5,D5,
    A4,B4,A4,Fs4,A4,D5, B4,A4,Fs4,E4,Fs4,G4, A4,Fs4,D4,A4,B4,Cs5,
    D5,E5,D5,Cs5,B4,A4, A4,B4,A4,Fs4,A4,D5, B4,Cs5,D5,E5,Fs5,G5,
    A5,Fs5,E5,D5,Cs5,B4, A4,D4,Fs4,A4,D5,D5,
    D5,E5,Fs5,E5,D5,B4, G4,A4,B4,A4,G4,Fs4,
    E4,D4,E4,Fs4,G4,A4, D4,D4,Fs4,A4,D5,D5,
  ];

  let noteTime = startTime;
  melody.forEach((freq) => {
    const noteDur = E * 0.86;
    const osc = ctx!.createOscillator();
    const lfo = ctx!.createOscillator();
    const lfoGain = ctx!.createGain();
    const nGain = ctx!.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = freq * 0.009;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    nGain.gain.setValueAtTime(0, noteTime);
    nGain.gain.linearRampToValueAtTime(0.30, noteTime + 0.015);
    nGain.gain.setValueAtTime(0.30, noteTime + noteDur - 0.020);
    nGain.gain.linearRampToValueAtTime(0, noteTime + noteDur);

    osc.connect(nGain);
    nGain.connect(masterOut);
    lfo.start(noteTime); lfo.stop(noteTime + noteDur + 0.01);
    osc.start(noteTime); osc.stop(noteTime + noteDur + 0.01);

    noteTime += E;
  });

  for (let beat = 0; beat < 40; beat++) {
    const bTime = startTime + beat * 0.75;
    const isStrong = beat % 2 === 0;

    const tOsc = ctx!.createOscillator();
    const tGain = ctx!.createGain();
    tOsc.type = 'sine';
    tOsc.frequency.setValueAtTime(isStrong ? 145 : 105, bTime);
    tOsc.frequency.exponentialRampToValueAtTime(isStrong ? 55 : 45, bTime + 0.13);
    tGain.gain.setValueAtTime(isStrong ? 0.60 : 0.38, bTime);
    tGain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.15);
    tOsc.connect(tGain);
    tGain.connect(masterOut);
    tOsc.start(bTime);
    tOsc.stop(bTime + 0.16);

    const nDur = 0.045;
    const nBuf = ctx!.createBuffer(1, Math.floor(ctx!.sampleRate * nDur), ctx!.sampleRate);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < nData.length; i++) nData[i] = Math.random() * 2 - 1;
    const nSrc = ctx!.createBufferSource();
    nSrc.buffer = nBuf;
    const nBP = ctx!.createBiquadFilter();
    nBP.type = 'bandpass';
    nBP.frequency.value = 360;
    nBP.Q.value = 2.2;
    const nGain = ctx!.createGain();
    nGain.gain.setValueAtTime(isStrong ? 0.34 : 0.22, bTime);
    nGain.gain.exponentialRampToValueAtTime(0.001, bTime + nDur);
    nSrc.connect(nBP);
    nBP.connect(nGain);
    nGain.connect(masterOut);
    nSrc.start(bTime);
    nSrc.stop(bTime + nDur + 0.01);
  }

  ([D2, A2, D3] as number[]).forEach((freq, i) => {
    const dOsc = ctx!.createOscillator();
    const dGain = ctx!.createGain();
    const vol = [0.22, 0.15, 0.11][i];
    dOsc.type = 'sine';
    dOsc.frequency.value = freq;
    dGain.gain.setValueAtTime(0, startTime);
    dGain.gain.linearRampToValueAtTime(vol, startTime + 1.0);
    dGain.gain.setValueAtTime(vol, startTime + 28.5);
    dGain.gain.linearRampToValueAtTime(0, startTime + 30.0);
    dOsc.connect(dGain);
    dGain.connect(masterOut);
    dOsc.start(startTime);
    dOsc.stop(startTime + 30.1);
  });

  const harpChords: number[][] = [
    [D3, Fs4, A4],
    [A3, E4, A4],
  ];
  for (let bar = 0; bar < 20; bar++) {
    const barTime = startTime + bar * 1.5;
    const chord = harpChords[bar % 2];
    chord.forEach((freq, i) => {
      const hDelay = i * 0.045;
      const hOsc = ctx!.createOscillator();
      const hGain = ctx!.createGain();
      hOsc.type = 'sine';
      hOsc.frequency.value = freq;
      const hVol = [0.18, 0.13, 0.09][i];
      hGain.gain.setValueAtTime(0, barTime + hDelay);
      hGain.gain.linearRampToValueAtTime(hVol, barTime + hDelay + 0.012);
      hGain.gain.exponentialRampToValueAtTime(0.001, barTime + hDelay + 0.50);
      hOsc.connect(hGain);
      hGain.connect(masterOut);
      hOsc.start(barTime + hDelay);
      hOsc.stop(barTime + hDelay + 0.55);
    });
  }

  loopTimer = setTimeout(scheduleLoop, 29_800);
}

export function startBackgroundMusic() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    scheduleLoop();
  } catch (_) {}
}

export function stopBackgroundMusic() {
  if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
  if (ctx) {
    try { ctx.close(); } catch (_) {}
    ctx = null;
  }
}
