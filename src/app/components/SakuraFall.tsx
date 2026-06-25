import React, { useEffect, useState, useRef } from 'react';
import sakuraImg from 'figma:asset/27ac8d110de23706e36cd3626314ac81d83e55da.png';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Petal {
  id: number;
  startX: number;   // absolute left px — can be off-screen right
  startY: number;   // absolute top px — negative = above viewport
  size: number;     // image size in px
  duration: number; // fall animation length in seconds
  delay: number;    // independent per-petal delay (seconds) within the 5 s window
  dx: number;       // total horizontal travel (negative = leftward)
  dy: number;       // total vertical travel
  rotation: number; // total spin in degrees
}

// ─── Module-level UID ────────────────────────────────────────────────────────
let uid = 0;

const BATCH_MS = 5000; // interval between waves (ms)
const COUNT    = 5;    // petals per wave

// ─── Factory: spawn one wave of petals ───────────────────────────────────────
function createBatch(): Petal[] {
  const W = window.innerWidth;
  const H = window.innerHeight;

  return Array.from({ length: COUNT }, (_, i) => {
    const size = 20 + Math.random() * 36;

    // Fall angle: 22–42° so each petal drifts at a slightly different diagonal
    const angleDeg = 22 + Math.random() * 20;
    const tanAngle = Math.tan((angleDeg * Math.PI) / 180);

    // Duration: slightly varied around 10 s so petals don't land together
    const duration = 8.5 + Math.random() * 3;

    // Independent delay: spread evenly-ish over the full 5 s window
    const slotMs = BATCH_MS / COUNT;
    const delay  = (i * slotMs + Math.random() * slotMs) / 1000;

    // Start X: wide band across the right side of the screen
    const startX = W * 0.35 + Math.random() * (W * 0.80);

    // Start Y: scattered just above the viewport
    const startY = -(size + Math.random() * 60);

    // Total travel: always reach below the bottom edge
    const dy = H + 150 + Math.random() * 120;
    const dx = -(dy * tanAngle * (0.75 + Math.random() * 0.50));

    const rotation = 120 + Math.random() * 520;

    return { id: ++uid, startX, startY, size, duration, delay, dx, dy, rotation };
  });
}

// ─── Build one @keyframes block ───────────────────────────────────────────────
function buildKeyframe(p: Petal): string {
  const f = (n: number, u: string) => `${n.toFixed(2)}${u}`;
  return `
    @keyframes sk-${p.id} {
      0%   { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
      100% { transform: translate(${f(p.dx,'px')}, ${f(p.dy,'px')}) rotate(${f(p.rotation,'deg')}); opacity: 1; }
    }
  `;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SakuraFall() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPetals(createBatch());

    timerRef.current = setInterval(() => {
      setPetals(prev => [...prev, ...createBatch()]);
    }, BATCH_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const removePetal = (id: number) =>
    setPetals(prev => prev.filter(p => p.id !== id));

  const keyframeCSS = petals.map(buildKeyframe).join('\n');

  return (
    <>
      <style>{keyframeCSS}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 500,
        }}
      >
        {petals.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.startX}px`,
              top:  `${p.startY}px`,
              width:  `${p.size}px`,
              height: `${p.size}px`,
              opacity: 1,
              pointerEvents: 'none',
              willChange: 'transform',
              animationName:           `sk-${p.id}`,
              animationDuration:       `${p.duration.toFixed(2)}s`,
              animationDelay:          `${p.delay.toFixed(2)}s`,
              animationTimingFunction: 'ease-out',
              animationFillMode:       'forwards',
              animationIterationCount: '1',
            }}
            onAnimationEnd={() => removePetal(p.id)}
          >
            <img
              src={sakuraImg}
              alt=""
              draggable={false}
              style={{
                width:      '100%',
                height:     '100%',
                objectFit:  'contain',
                display:    'block',
                userSelect: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
