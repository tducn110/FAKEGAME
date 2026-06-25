import React, { useState, useEffect } from 'react';
import { CardGame } from './components/CardGame';
import PreScreen from './components/PreScreen';
import SakuraFall from './components/SakuraFall';

// ── Design canvas the game was built for ──────────────────────────────────
const DESIGN_W = 1280;
const DESIGN_H = 700;

// ── Reactive viewport size (re-fires after orientation settles) ────────────
function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    const update = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });

    window.addEventListener('resize', update);
    // orientationchange fires BEFORE the viewport dims are updated →
    // wait 150 ms for the browser to settle, then read the real values.
    const onOrient = () => setTimeout(update, 150);
    window.addEventListener('orientationchange', onOrient);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', onOrient);
    };
  }, []);

  return vp;
}

// ── Tiny helper: is this a touch-capable mobile/tablet? ───────────────────
function isTouchMobile() {
  return (
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    Math.max(screen.width, screen.height) <= 1366 // exclude desktop touch screens
  );
}

export default function App() {
  const [gameStarted,  setGameStarted]  = useState(false);
  const [preScreenGone, setPreScreenGone] = useState(false);
  const { w, h } = useViewport();

  // ── 1. Try native orientation lock (works in Android Chrome / PWA) ────────
  //       iOS Safari ignores this; the CSS rotation below handles that case.
  useEffect(() => {
    if (!isTouchMobile()) return;
    const tryLock = async () => {
      try {
        // screen.orientation.lock is not in all TypeScript lib versions
        const orient = screen.orientation as ScreenOrientation & {
          lock?: (o: string) => Promise<void>;
        };
        if (typeof orient?.lock === 'function') {
          await orient.lock('landscape');
        }
      } catch (_) {
        // Permission denied or unsupported (e.g. iOS) — CSS rotation handles it
      }
    };
    tryLock();
  }, []);

  // ── 2. Detect layout mode ─────────────────────────────────────────────────
  //  isPortraitMobile  → phone held upright: we CSS-rotate -90° to landscape
  //  isLandscapeMobile → phone already sideways (or Android locked): we scale
  //  desktop           → no transform, original full-screen layout
  const isPortraitMobile  = h > w && w  < 768;
  const isLandscapeMobile = w > h && h <= 500;
  const isMobile          = isPortraitMobile || isLandscapeMobile;

  // ── 3. Landscape dimensions the game will occupy after any CSS rotation ────
  //  portrait rotated → swap: landscape width = h, landscape height = w
  const lW = isPortraitMobile ? h : w;   // effective landscape width
  const lH = isPortraitMobile ? w : h;   // effective landscape height

  // ── 4. Scale factor to fit the 1280×700 design into that space ───────────
  const scale = isMobile ? Math.min(lW / DESIGN_W, lH / DESIGN_H) : 1;
  const offX  = isMobile ? (lW - DESIGN_W * scale) / 2 : 0;
  const offY  = isMobile ? (lH - DESIGN_H * scale) / 2 : 0;

  // ── Game tree (shared across all mobile render paths) ────────────────────
  const gameTree = (
    <>
      <CardGame started={gameStarted} isMobile={isMobile} />
      {!preScreenGone && (
        <PreScreen
          onIntroReady={() => setGameStarted(true)}
          onPlay={() => setPreScreenGone(true)}
        />
      )}
    </>
  );

  // ── Mobile badge (shown inside the canvas so it rotates with the content) ─
  const mobileBadge = (
    <div
      style={{
        position: 'absolute',
        bottom: 6,
        right: 8,
        zIndex: 99998,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 6,
        padding: '2px 7px',
      }}
    >
      {/* Phone icon */}
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <rect x="1" y="0.5" width="9" height="10" rx="1.5"
          stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
        <rect x="3.5" y="2" width="4" height="5.5" rx="0.6"
          fill="rgba(255,255,255,0.35)" />
        <circle cx="5.5" cy="9" r="0.75" fill="rgba(255,255,255,0.55)" />
      </svg>
      <span
        style={{
          fontFamily: "'Averia Serif Libre', serif",
          fontSize: 9,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.5px',
        }}
      >
        Mobile Mode
      </span>
    </div>
  );

  // ── The scaled 1280×700 game canvas ──────────────────────────────────────
  const scaledGame = (
    <div
      style={{
        position: 'absolute',
        width:  `${DESIGN_W}px`,
        height: `${DESIGN_H}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        left: `${offX}px`,
        top:  `${offY}px`,
      }}
    >
      {gameTree}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTRAIT MOBILE — CSS-rotate the landscape canvas –90° so it fills the
  // portrait viewport immediately without asking the user to turn their phone.
  //
  // How it works:
  //   • Create a landscape-sized div (width = viewport height, height = viewport width)
  //   • Center it in the portrait viewport with translate(−50%, −50%)
  //   • Rotate it –90° (counter-clockwise) around its own center
  //   → The landscape div now visually fills the portrait screen exactly, and
  //     the coordinate space inside appears as normal landscape to all children.
  //
  // Touch events: browsers inverse-transform pointer coords through the CSS
  // matrix, so clicks/taps land on the correct game elements automatically.
  //
  // Physical rotation equivalent: rotating the phone clockwise (home/volume
  // buttons move to the top) reveals the game upright — the most natural grip.
  // ══════════════════════════════��════════════════════════════════════════════
  if (isPortraitMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width:    '100vw',
          height:   '100vh',
          overflow: 'hidden',
          background: '#0a0a18',
          touchAction: 'manipulation',
        }}
      >
        <SakuraFall />
        <div
          style={{
            position: 'absolute',
            width:  `${lW}px`,
            height: `${lH}px`,
            top:  '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            overflow: 'hidden',
          }}
        >
          {scaledGame}
          {mobileBadge}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LANDSCAPE MOBILE — phone is already sideways (or Android locked it).
  // Just scale the design canvas to fit; no rotation needed.
  // ═══════════════════════════════════════════════════════════════════════════
  if (isLandscapeMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width:    '100vw',
          height:   '100vh',
          overflow: 'hidden',
          background: '#0a0a18',
          touchAction: 'manipulation',
        }}
      >
        <SakuraFall />
        {scaledGame}
        {mobileBadge}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DESKTOP / large tablet — original full-screen layout, no transforms.
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="size-full">
      <SakuraFall />
      <CardGame started={gameStarted} />
      {!preScreenGone && (
        <PreScreen
          onIntroReady={() => setGameStarted(true)}
          onPlay={() => setPreScreenGone(true)}
        />
      )}
    </div>
  );
}