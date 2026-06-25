import clsx from "clsx";
import { useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-t0u6vixipv";

// ─── Circle-bloom firecracker canvas overlay (victory only) ─────────────────

const BLOOM_COLORS = [
  "#FF5577", "#FF8833", "#FFDD00", "#AAFF55",
  "#33DDFF", "#FF55DD", "#FFFFFF", "#FF99BB",
  "#FFCC44", "#88FFCC", "#AA88FF", "#FF6644",
];

// A single bloom event: concentric expanding rings + petal orbs
interface Bloom {
  x: number; y: number;
  color: string;
  color2: string;     // secondary ring color
  born: number;       // timestamp ms
  duration: number;   // ms
  maxRadius: number;
  petalCount: number;
  petalSpeed: number;
}

// A floating orb that drifts after a bloom
interface Orb {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  life: number; maxLife: number;
}

function FirecrackerCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const bloomsRef  = useRef<Bloom[]>([]);
  const orbsRef    = useRef<Orb[]>([]);
  const startRef   = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function pickColor() {
      return BLOOM_COLORS[Math.floor(Math.random() * BLOOM_COLORS.length)];
    }

    function spawnBloom() {
      const color  = pickColor();
      let color2   = pickColor();
      while (color2 === color) color2 = pickColor();

      const cx = canvas!.width  * (0.08 + Math.random() * 0.84);
      const cy = canvas!.height * (0.06 + Math.random() * 0.60);
      const maxR = 55 + Math.random() * 80;
      const dur  = 700 + Math.random() * 500;
      const petals = 8 + Math.floor(Math.random() * 10);
      const pSpeed = 55 + Math.random() * 80;

      bloomsRef.current.push({ x: cx, y: cy, color, color2, born: Date.now(), duration: dur, maxRadius: maxR, petalCount: petals, petalSpeed: pSpeed });

      // Scatter orbs from the bloom centre
      const orbCount = 10 + Math.floor(Math.random() * 14);
      for (let i = 0; i < orbCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = 30 + Math.random() * 110;
        orbsRef.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: Math.random() < 0.4 ? color2 : color,
          size: 3 + Math.random() * 6,
          life: 0.6 + Math.random() * 0.8,
          maxLife: 0,
        });
        orbsRef.current[orbsRef.current.length - 1].maxLife = orbsRef.current[orbsRef.current.length - 1].life;
      }
    }

    // ── draw a single bloom frame ─────────────────────────────────────────
    function drawBloom(bloom: Bloom) {
      const elapsed = (Date.now() - bloom.born) / bloom.duration; // 0→1
      if (elapsed >= 1) return false;

      const ease = 1 - Math.pow(1 - elapsed, 2.5); // ease-out
      const alpha = elapsed < 0.5
        ? elapsed * 2
        : 1 - (elapsed - 0.5) * 2;

      // ── Ring 1: main expanding hollow circle ─────────────────────────
      const r1 = bloom.maxRadius * ease;
      c!.save();
      c!.globalAlpha = alpha * 0.75;
      c!.strokeStyle = bloom.color;
      c!.lineWidth   = 3 + (1 - ease) * 5;
      c!.beginPath();
      c!.arc(bloom.x, bloom.y, r1, 0, Math.PI * 2);
      c!.stroke();
      c!.restore();

      // ── Ring 2: slightly delayed inner ring ───────────────────────────
      if (elapsed > 0.12) {
        const e2  = Math.min(1, (elapsed - 0.12) / 0.88);
        const r2  = bloom.maxRadius * 0.65 * (1 - Math.pow(1 - e2, 2.5));
        const a2  = e2 < 0.5 ? e2 * 2 : 1 - (e2 - 0.5) * 2;
        c!.save();
        c!.globalAlpha = a2 * 0.55;
        c!.strokeStyle = bloom.color2;
        c!.lineWidth   = 2 + (1 - e2) * 3;
        c!.beginPath();
        c!.arc(bloom.x, bloom.y, r2, 0, Math.PI * 2);
        c!.stroke();
        c!.restore();
      }

      // ── Petal orbs: small filled circles arranged in a ring ───────────
      const petalR = r1 * 0.92;
      for (let p = 0; p < bloom.petalCount; p++) {
        const angle  = (Math.PI * 2 * p) / bloom.petalCount + elapsed * 0.8;
        const px     = bloom.x + Math.cos(angle) * petalR;
        const py     = bloom.y + Math.sin(angle) * petalR;
        const pSize  = (2 + (1 - ease) * 5) * (p % 2 === 0 ? 1.3 : 0.8);
        c!.save();
        c!.globalAlpha = alpha * 0.9;
        c!.fillStyle   = p % 3 === 0 ? "#FFFFFF" : bloom.color;
        c!.beginPath();
        c!.arc(px, py, pSize, 0, Math.PI * 2);
        c!.fill();
        c!.restore();
      }

      // ── Centre flash: bright white circle that quickly shrinks ────────
      if (elapsed < 0.25) {
        const flashA = (0.25 - elapsed) / 0.25;
        const flashR = bloom.maxRadius * 0.22 * (1 - elapsed / 0.25);
        c!.save();
        c!.globalAlpha = flashA * 0.85;
        const grad = c!.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, flashR);
        grad.addColorStop(0,   "#FFFFFF");
        grad.addColorStop(0.5, bloom.color);
        grad.addColorStop(1,   "transparent");
        c!.fillStyle = grad;
        c!.beginPath();
        c!.arc(bloom.x, bloom.y, flashR, 0, Math.PI * 2);
        c!.fill();
        c!.restore();
      }

      return true;
    }

    // ── draw a drifting orb ───────────────────────────────────────────────
    function drawOrb(orb: Orb) {
      const t = orb.life / orb.maxLife; // 1→0
      const alpha = Math.pow(t, 0.5);

      // glow halo
      c!.save();
      c!.globalAlpha = alpha * 0.35;
      const halo = c!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 2.5);
      halo.addColorStop(0,   orb.color);
      halo.addColorStop(1,   "transparent");
      c!.fillStyle = halo;
      c!.beginPath();
      c!.arc(orb.x, orb.y, orb.size * 2.5, 0, Math.PI * 2);
      c!.fill();
      c!.restore();

      // solid core
      c!.save();
      c!.globalAlpha = alpha * 0.9;
      c!.fillStyle   = orb.color;
      c!.beginPath();
      c!.arc(orb.x, orb.y, orb.size * t * 1.2, 0, Math.PI * 2);
      c!.fill();
      c!.restore();
    }

    let lastT = 0;
    let spawnTimer = 0;
    const BURST_INTERVAL = 0.48;
    const STOP_AFTER     = 5.5;

    function loop(ts: number) {
      const dt      = Math.min((ts - lastT) / 1000, 0.05);
      lastT         = ts;
      const elapsed = (Date.now() - startRef.current) / 1000;

      c!.clearRect(0, 0, canvas!.width, canvas!.height);

      // spawn blooms
      if (elapsed < STOP_AFTER) {
        spawnTimer += dt;
        if (spawnTimer >= BURST_INTERVAL) {
          spawnTimer = 0;
          spawnBloom();
          if (Math.random() < 0.45) setTimeout(spawnBloom, 140);
          if (Math.random() < 0.20) setTimeout(spawnBloom, 280);
        }
      }

      // draw blooms (remove finished ones)
      bloomsRef.current = bloomsRef.current.filter(b => drawBloom(b));

      // update & draw orbs
      orbsRef.current = orbsRef.current.filter(orb => {
        orb.life -= dt;
        if (orb.life <= 0) return false;
        orb.vy  += dt * 90;
        orb.vx  *= 0.97;
        orb.x   += orb.vx * dt;
        orb.y   += orb.vy * dt;
        drawOrb(orb);
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(ts => { lastT = ts; rafRef.current = requestAnimationFrame(loop); });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 10000,
      }}
    />
  );
}

// ─── Victory jingle (Web Audio) ────────────────────────────────────────────
function playVictoryMusic() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.72, ctx.currentTime);
    master.connect(ctx.destination);
    const t = ctx.currentTime;

    // reverb convolver (small room impulse)
    const revLen = ctx.sampleRate * 0.8;
    const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/revLen, 2.2);
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = revBuf;
    const revGain = ctx.createGain();
    revGain.gain.value = 0.28;
    reverb.connect(revGain);
    revGain.connect(master);

    function bell(freq: number, start: number, dur: number, vol: number) {
      const osc  = ctx.createOscillator();
      const osc2 = ctx.createOscillator(); // inharmonic partial
      const gain = ctx.createGain();
      osc.type  = "sine";
      osc2.type = "sine";
      osc.frequency.value  = freq;
      osc2.frequency.value = freq * 2.756; // bell inharmonic
      const g2 = ctx.createGain();
      g2.gain.value = 0.25;
      osc2.connect(g2);
      g2.connect(gain);
      osc.connect(gain);
      gain.gain.setValueAtTime(0, t + start);
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
      gain.connect(master);
      gain.connect(reverb);
      osc.start(t + start);  osc.stop(t + start + dur + 0.05);
      osc2.start(t + start); osc2.stop(t + start + dur + 0.05);
    }

    function bright(freq: number, start: number, dur: number, vol: number) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const lpf  = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = freq * 6;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t + start);
      // tiny pitch slide up for excitement
      osc.frequency.linearRampToValueAtTime(freq * 1.04, t + start + 0.08);
      gain.gain.setValueAtTime(0, t + start);
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(master);
      gain.connect(reverb);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.05);
    }

    function shimmer(start: number) {
      // white noise shimmer burst (like a tambourine / shaker hit)
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random()*2-1;
      const ns = ctx.createBufferSource();
      ns.buffer = noiseBuf;
      const hpf = ctx.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.value = 6000;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.3, t + start);
      ng.gain.exponentialRampToValueAtTime(0.001, t + start + 0.12);
      ns.connect(hpf); hpf.connect(ng); ng.connect(master);
      ns.start(t + start);
    }

    // ── Ascending fanfare: D4 → F#4 → A4 → D5 (D-major arpeggio) ──────────
    // Bar 1: quick ascending notes
    bright(293.66, 0.00, 0.20, 0.55); // D4
    shimmer(0.00);
    bright(369.99, 0.18, 0.20, 0.55); // F#4
    bright(440.00, 0.36, 0.20, 0.58); // A4
    bright(587.33, 0.54, 0.55, 0.65); // D5 — held
    shimmer(0.54);

    // Bell sparkle on D5
    bell(587.33, 0.54, 1.0, 0.38);
    bell(880.00, 0.58, 0.8, 0.22);  // A5 shimmer

    // Bar 2: secondary flourish up to F#5
    bright(440.00, 1.10, 0.18, 0.45); // A4
    bright(493.88, 1.28, 0.18, 0.45); // B4
    bright(554.37, 1.46, 0.18, 0.48); // C#5
    bright(739.99, 1.64, 0.70, 0.60); // F#5 — peak held
    shimmer(1.64);
    bell(739.99, 1.64, 1.1, 0.35);

    // Bar 3: triumphant chord stab D5-A5-D6
    bright(587.33, 2.30, 0.55, 0.55); // D5
    bright(880.00, 2.32, 0.55, 0.42); // A5
    bright(1174.66,2.34, 0.55, 0.30); // D6
    bell(1174.66, 2.30, 1.0, 0.28);
    bell(587.33,  2.30, 1.2, 0.38);
    shimmer(2.30);
    shimmer(2.42);

    // Bass: warm sine thump on beats
    function bass(freq: number, start: number, dur: number, vol: number) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t+start);
      o.frequency.exponentialRampToValueAtTime(freq*0.5, t+start+0.18);
      g.gain.setValueAtTime(vol, t+start);
      g.gain.exponentialRampToValueAtTime(0.001, t+start+dur);
      o.connect(g); g.connect(master);
      o.start(t+start); o.stop(t+start+dur+0.05);
    }
    bass(146.83, 0.00, 0.30, 0.7); // D3
    bass(146.83, 0.54, 0.30, 0.7);
    bass(146.83, 1.64, 0.30, 0.7);
    bass(146.83, 2.30, 0.45, 0.75);

    // master fade out
    master.gain.setValueAtTime(0.72, t + 2.6);
    master.gain.linearRampToValueAtTime(0, t + 3.1);
    setTimeout(() => { try { ctx.close(); } catch(_) {} }, 3300);
  } catch(_) { /* Audio not available */ }
}

// ─── Wrapper SVG helper ────────────────────────────────────────────────────
type WrapperProps = { additionalClassNames?: string };
function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.4696 9.03017">
        {children}
      </svg>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
interface GameOverPopupProps {
  isVictory: boolean;
  onPlayAgain: () => void;
}

export default function GameOverPopup({ isVictory, onPlayAgain }: GameOverPopupProps) {
  const bannerFill     = isVictory ? "#97473C" : "#1E2D5A";
  const bannerGradFrom = isVictory ? "#9C8463" : "#4A5A8A";
  const bannerGradTo   = isVictory ? "#F2E0C6" : "#A0B4D6";

  const title    = isVictory ? "Congratulation" : "Defeated!";
  const bodyText = isVictory
    ? "After defeating the Shiba Inu Uruku Army, I learned that victory isn't the end of the story, it's the moment the hero earns the right to write the next chapter."
    : "The Shiba Inu Uruku Army proved too fierce this day. A warrior who falls learns more than one who never rises. Rest, recover, and rise again — your story is not over yet.";

  // Play victory music once on mount (only for victory)
  useEffect(() => {
    if (isVictory) playVictoryMusic();
  }, [isVictory]);

  return (
    <>
      {/* Firecracker canvas — victory only */}
      {isVictory && <FirecrackerCanvas />}

      {/* ── keyframes ── */}
      <style>{`
        /* GPU-composited layers */
        .go-backdrop,
        .go-card-wrap-victory,
        .go-card-wrap-defeat,
        .go-banner-victory,
        .go-banner-defeat,
        .go-body,
        .go-btn-victory,
        .go-btn-defeat {
          will-change: transform, opacity;
        }

        /* Backdrop */
        @keyframes go-backdrop-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(8px); }
        }

        /* Card: defeat — drops in from above, settles cleanly */
        @keyframes go-card-defeat {
          0%   { opacity: 0; transform: translateY(-80px) scale(0.92); }
          60%  { opacity: 1; transform: translateY(10px)  scale(1.02); }
          80%  { transform: translateY(-4px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0px)   scale(1.00); }
        }

        /* Card: victory — rises smoothly from below with a single spring overshoot */
        @keyframes go-card-victory {
          0%   { opacity: 0; transform: translateY(60px) scale(0.90); }
          55%  { opacity: 1; transform: translateY(-12px) scale(1.03); }
          78%  { transform: translateY(5px)  scale(0.99); }
          90%  { transform: translateY(-2px) scale(1.005); }
          100% { opacity: 1; transform: translateY(0px)  scale(1.00); }
        }

        /* Title banner — slides down with a gentle single bounce */
        @keyframes go-banner-drop {
          0%   { opacity: 0; transform: translateY(-50px) scaleY(0.85); }
          55%  { opacity: 1; transform: translateY(8px)   scaleY(1.04); }
          75%  { transform: translateY(-3px) scaleY(0.99); }
          100% { opacity: 1; transform: translateY(0px)  scaleY(1.00); }
        }

        /* Body text — fades and rises */
        @keyframes go-body-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0px); }
        }

        /* Button — pops in from slight scale */
        @keyframes go-btn-in {
          0%   { opacity: 0; transform: translateY(20px) scale(0.88); }
          60%  { opacity: 1; transform: translateY(-6px) scale(1.04); }
          80%  { transform: translateY(2px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0px) scale(1.00); }
        }

        /* Applied classes */
        .go-backdrop {
          animation: go-backdrop-in 0.40s ease-out both;
          backdrop-filter: blur(8px);
        }
        .go-card-wrap-defeat {
          animation: go-card-defeat 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        .go-card-wrap-victory {
          animation: go-card-victory 0.70s cubic-bezier(0.22, 1, 0.36, 1) 0.10s both;
        }
        .go-banner-defeat {
          animation: go-banner-drop 0.60s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
        }
        .go-banner-victory {
          animation: go-banner-drop 0.60s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
        }
        .go-body {
          animation: go-body-in 0.50s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }
        .go-btn-defeat {
          animation: go-btn-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.80s both;
        }
        .go-btn-victory {
          animation: go-btn-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both;
        }
        .go-btn-defeat:hover, .go-btn-victory:hover {
          transform: translateY(-3px) scale(1.05);
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .go-btn-defeat:active, .go-btn-victory:active {
          transform: scale(0.95);
          transition: transform 0.08s ease;
        }
      `}</style>

      {/* Full-screen backdrop */}
      <div
        className="go-backdrop fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: isVictory ? "transparent" : "rgba(0,0,0,0.60)" }}
      >
        {/* Card wrapper */}
        <div
          className={isVictory ? "go-card-wrap-victory relative rounded-xl" : "go-card-wrap-defeat relative rounded-xl"}
          style={{ width: "375px", height: "347.728px" }}
        >
          {/* ── Background parchment ── */}
          <div className="absolute h-[347.728px] left-0 top-0 w-[375px]" data-name="BASED">
            <div className="absolute inset-[-0.29%_-0.27%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 377 349.728" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="BASED">
                  <path d={svgPaths.p2eac5040} fill="url(#paint0_linear_82_704)" />
                  <path d={svgPaths.p2eac5040} fill="url(#pattern0_82_704)" fillOpacity="0.1" />
                  <path d={svgPaths.p2242b900} fill="url(#paint1_linear_82_704)" />
                </g>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_82_704" x1="204.158" x2="204.633" y1="2.24457" y2="649.653">
                    <stop offset="0.160468" stopColor="#FFF7E8" />
                    <stop offset="0.470494" stopColor="white" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_82_704" x1="180.469" x2="180.469" y1="-2.34467" y2="221.924">
                    <stop stopColor="#9C8463" />
                    <stop offset="1" stopColor="#F2E0C6" />
                  </linearGradient>
                  <pattern height="1" id="pattern0_82_704" patternTransform="matrix(23.7403 0 0 23.7403 2.03764 2.03745)" patternUnits="userSpaceOnUse" preserveAspectRatio="none" viewBox="1.65705 1.65674 37.9118 37.9118" width="1">
                    <g id="pattern0_82_704_inner">
                      <rect fill="var(--fill-0, #ECDEC3)" height="26.8077" id="Rectangle 39927" rx="4" transform="rotate(45 18.9559 0)" width="26.8077" x="18.9559" />
                    </g>
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>

          {/* ── Content column ── */}
          <div className="absolute content-stretch flex flex-col gap-[36px] items-center left-0 px-[24px] py-[36px] top-[32.48px] w-[375px]">

            {/* Title + body */}
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">

              {/* Title banner */}
              <div className={isVictory ? "go-banner-victory grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" : "go-banner-defeat grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"}>
                <div className="col-1 h-[72.128px] ml-0 mt-0 relative row-1 w-[314.798px]" data-name="Union">
                  <div className="absolute inset-[-0.85%_-0.19%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 316.02 73.3504" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="Union_go">
                        <path d={svgPaths.p38a08400} fill={bannerFill} />
                        <path d={svgPaths.p38a08400} fill="url(#pattern0_82_699_go)" fillOpacity="0.05" />
                        <path d={svgPaths.p684af00} fill="url(#paint0_linear_82_699_go)" />
                      </g>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_82_699_go" x1="5.73844" x2="248.179" y1="13.3448" y2="63.6">
                          <stop stopColor={bannerGradFrom} />
                          <stop offset="1" stopColor={bannerGradTo} />
                        </linearGradient>
                        <pattern height="1" id="pattern0_82_699_go" patternTransform="matrix(16.8909 0 0 16.8909 1.34953 1.34939)" patternUnits="userSpaceOnUse" preserveAspectRatio="none" viewBox="1.65705 1.65674 37.9118 37.9118" width="1">
                          <g id="pattern0_82_699_go_inner">
                            <rect fill="var(--fill-0, #ECDEC3)" height="26.8077" id="Rectangle 39927_go" rx="4" transform="rotate(45 18.9559 0)" width="26.8077" x="18.9559" />
                          </g>
                        </pattern>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Inner border stroke */}
                <div className="col-1 h-[62.348px] ml-[4.89px] mt-[4.89px] relative row-1 w-[305.017px]" data-name="Subtract">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 305.017 62.3482">
                    <path d={svgPaths.p1c6e9680} id="Subtract_go" opacity="0.4" stroke="var(--stroke-0, #DBC5A7)" strokeWidth="1.22251" />
                  </svg>
                </div>

                {/* Title text */}
                <p
                  className="bg-clip-text bg-gradient-to-b col-1 font-['Averia_Serif_Libre',serif] leading-[1.1] not-italic relative row-1 text-[32px] text-[transparent] text-center tracking-[-1.6px]"
                  style={{
                    width: "314.798px",
                    marginLeft: "0px",
                    marginTop: "18.52px",
                    backgroundImage: isVictory
                      ? "linear-gradient(to bottom, #2a0c08, #7a2418)"
                      : "linear-gradient(to bottom, #05091a, #1a2d5a)",
                    textShadow: `1px 1px 0px ${isVictory ? "#f5d9c8" : "#a0b4d6"}`,
                  }}
                >
                  {title}
                </p>
              </div>

              {/* Body text */}
              <p className="go-body bg-clip-text bg-gradient-to-b font-['Averia_Serif_Libre',serif] from-[8.17%] from-black leading-[1.1] min-w-full not-italic relative shrink-0 text-[16px] text-[transparent] to-[#8c826b] tracking-[-0.8px] w-[min-content] whitespace-pre-wrap">
                {bodyText}
              </p>
            </div>

            {/* Play Again button */}
            <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
              <button
                onClick={onPlayAgain}
                className={isVictory ? "go-btn-victory relative cursor-pointer select-none" : "go-btn-defeat relative cursor-pointer select-none"}
              >
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  {/* Button background */}
                  <div className="col-1 h-[52.048px] ml-0 mt-0 relative row-1 w-[327.001px]" data-name="Union">
                    <div className="absolute inset-[-4.69%_-0.75%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 331.882 56.9288">
                        <g filter="url(#filter0_g_82_713_go)" id="Union_btn">
                          <mask fill="black" height="56" id="path-1-outside-1_82_713_go" maskUnits="userSpaceOnUse" width="331" x="0.440463" y="0.440463">
                            <rect fill="white" height="56" width="331" x="0.440463" y="0.440463" />
                            <path d={svgPaths.p2edc9200} />
                          </mask>
                          <path d={svgPaths.p2edc9200} fill="var(--fill-0, white)" />
                          <path d={svgPaths.p18845a00} fill="var(--stroke-0, #DFC8A5)" mask="url(#path-1-outside-1_82_713_go)" />
                        </g>
                        <defs>
                          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.9288" id="filter0_g_82_713_go" width="331.882" x="0" y="0">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                            <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
                            <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1.2202315330505371" width="100%" xChannelSelector="R" yChannelSelector="G" />
                            <feMerge result="effect1_texture_82_713_go">
                              <feMergeNode in="displacedImage" />
                            </feMerge>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Button content row */}
                  <div className="col-1 content-stretch flex gap-[19.519px] h-[30.905px] items-center ml-[0.81px] mt-[10.57px] px-[6.506px] relative row-1 w-[326.125px]">
                    {/* Left ornament (flipped) */}
                    <div className="flex items-center justify-center relative shrink-0">
                      <div className="-scale-y-100 flex-none rotate-180">
                        <div className="h-[8.542px] relative w-[10.982px]">
                          <Wrapper additionalClassNames="inset-[-2.86%_-2.22%_-2.86%_-2.23%]">
                            <g id="Group_427322599_go">
                              <g filter="url(#filter0_g_82_710_go)" id="Rectangle_39727_go_l">
                                <path d={svgPaths.p124fb900} fill="var(--fill-0, #F0DCB5)" />
                              </g>
                            </g>
                            <defs>
                              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.03017" id="filter0_g_82_710_go" width="11.4696" x="4.07454e-09" y="3.79077e-09">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
                                <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.48809269070625305" width="100%" xChannelSelector="R" yChannelSelector="G" />
                                <feMerge result="effect1_texture_82_710_go">
                                  <feMergeNode in="displacedImage" />
                                </feMerge>
                              </filter>
                            </defs>
                          </Wrapper>
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
                      <div className="flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6d542f] text-[16.608px] text-center tracking-[-1.3286px] whitespace-nowrap">
                        <p className="leading-[1.1]">Play Again!</p>
                      </div>
                    </div>

                    {/* Right ornament */}
                    <div className="h-[8.542px] relative shrink-0 w-[10.982px]">
                      <Wrapper additionalClassNames="inset-[-2.86%_-2.22%]">
                        <g id="Group_427322598_go">
                          <g filter="url(#filter0_g_82_696_go)" id="Rectangle_39727_go_r">
                            <path d={svgPaths.p124fb900} fill="var(--fill-0, #F0DCB5)" />
                          </g>
                        </g>
                        <defs>
                          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.03017" id="filter0_g_82_696_go" width="11.4696" x="-1.68802e-09" y="-4.8567e-09">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                            <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
                            <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.48809269070625305" width="100%" xChannelSelector="R" yChannelSelector="G" />
                            <feMerge result="effect1_texture_82_696_go">
                              <feMergeNode in="displacedImage" />
                            </feMerge>
                          </filter>
                        </defs>
                      </Wrapper>
                    </div>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}