import { useState } from 'react';
import doorImage    from 'figma:asset/8492b939d4f74a004d8640bdd5c338e0e6a52376.png';
import parchment    from 'figma:asset/1585093dc9956998910d206579a047fd9d61bc13.png';
import cover        from 'figma:asset/59a11dc60eec257b7096f1a596799764c77372a9.png';
import FigmaPlayButton from '../../imports/Frame427323160-2006-238';
import { warmUpAnnouncer } from './announcer';

interface PreScreenProps {
  onPlay: () => void;
  /** Fired at the exact moment the black overlay starts fading so the
   *  game world intro can begin revealing itself behind it. */
  onIntroReady?: () => void;
}

export default function PreScreen({ onPlay, onIntroReady }: PreScreenProps) {
  const [opening, setOpening] = useState(false);

  function handlePlay() {
    setOpening(true);

    // Pre-warm the browser's TTS voice list on first user gesture
    // (browsers require a user interaction before voices are populated)
    try { window.speechSynthesis?.getVoices(); } catch (_) {}
    warmUpAnnouncer();

    // Kick off the game intro while the bouncy-fall is mid-air
    setTimeout(() => { onIntroReady?.(); }, 850);

    // Unmount PreScreen after the overlay fully fades
    setTimeout(() => { onPlay(); }, 1900);
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[9999]">
      <style>{`
        /* ── Door slides ── */
        @keyframes slide-left  { 0%{transform:translateX(0%)}  100%{transform:translateX(-100%)} }
        @keyframes slide-right { 0%{transform:translateX(0%)}  100%{transform:translateX(100%)}  }

        /* ── Black overlay fade ── */
        @keyframes black-fade-out { 0%{opacity:1} 100%{opacity:0} }

        /* ── Panel entrance ── */
        @keyframes panel-in {
          0%   { opacity:0; transform: scale(0.86) translateY(24px); }
          55%  { opacity:1; transform: scale(1.03) translateY(-5px);  }
          100% { opacity:1; transform: scale(1)    translateY(0px);   }
        }

        /* ── Jelly fall-down exit (1100 ms) ── */
        @keyframes jelly-fall {
          0%   { transform: translateY(0px)    scaleX(1.00) scaleY(1.00);
                 animation-timing-function: cubic-bezier(0.34, 1.4, 0.64, 1); }
          8%   { transform: translateY(4px)    scaleX(1.06) scaleY(0.93);
                 animation-timing-function: cubic-bezier(0.34, 1.5, 0.64, 1); }
          24%  { transform: translateY(-26px)  scaleX(0.92) scaleY(1.11);
                 animation-timing-function: cubic-bezier(0.34, 1.3, 0.64, 1); }
          38%  { transform: translateY(-28px)  scaleX(1.05) scaleY(0.96);
                 animation-timing-function: cubic-bezier(0.55, 0, 1, 0.55); }
          54%  { transform: translateY(-10px)  scaleX(0.97) scaleY(1.04);
                 animation-timing-function: cubic-bezier(0.55, 0, 1, 0.65); }
          100% { transform: translateY(135vh)  scaleX(1.00) scaleY(1.02); }
        }

        /* ── Floating title ── */
        @keyframes title-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-6px); }
        }

        /* ── Play-button glow ── */
        @keyframes prescreen-btn-glow {
          0%,100% { filter: drop-shadow(0 0 8px rgba(181,80,167,.5)) drop-shadow(0 0 20px rgba(181,80,167,.3)); }
          50%     { filter: drop-shadow(0 0 18px rgba(220,120,210,.9)) drop-shadow(0 0 40px rgba(181,80,167,.6)); }
        }
        @keyframes prescreen-btn-glow-hover {
          0%,100% { filter: drop-shadow(0 0 22px rgba(220,120,210,.95)) drop-shadow(0 0 48px rgba(181,80,167,.75)); }
          50%     { filter: drop-shadow(0 0 34px rgba(240,150,230,1))   drop-shadow(0 0 70px rgba(200,80,190,.95)); }
        }

        /* ── Applied classes ── */
        .door-left     { animation: ${opening ? 'slide-left  0.9s cubic-bezier(0.7,0,0.84,0) forwards' : 'none'}; }
        .door-right    { animation: ${opening ? 'slide-right 0.9s cubic-bezier(0.7,0,0.84,0) forwards' : 'none'}; }
        .black-overlay { animation: ${opening ? 'black-fade-out 0.7s ease-out 0.85s forwards' : 'none'}; }

        /* panel-group: entrance when idle, bouncy-fall when opening */
        .panel-group {
          animation: ${opening
            ? 'jelly-fall 1.1s linear forwards'
            : 'panel-in 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s both'};
        }

        .title-text { animation: title-float 3s ease-in-out infinite; }

        .prescreen-play-btn {
          animation: prescreen-btn-glow 2.2s ease-in-out infinite;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .prescreen-play-btn:hover  { transform: scale(1.08); animation: prescreen-btn-glow-hover 1s ease-in-out infinite; }
        .prescreen-play-btn:active { transform: scale(0.95); }
      `}</style>

      {/* ── Black overlay ── */}
      <div
        className="black-overlay absolute inset-0"
        style={{ backgroundColor: '#000', zIndex: 1, opacity: 1 }}
      />

      {/* ── Left Door ── */}
      <div className="door-left absolute top-0 left-0 h-full" style={{ width: '50%', zIndex: 2 }}>
        <img src={doorImage} alt="Left Door"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'right center', display:'block' }} />
        <div className="absolute inset-y-0 right-0 w-[8px] pointer-events-none"
          style={{ background:'linear-gradient(to right,transparent,rgba(0,0,0,0.6))' }} />
      </div>

      {/* ── Right Door (mirrored) ── */}
      <div className="door-right absolute top-0 right-0 h-full" style={{ width: '50%', zIndex: 2 }}>
        <img src={doorImage} alt="Right Door"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'left center', transform:'scaleX(-1)', display:'block' }} />
        <div className="absolute inset-y-0 left-0 w-[8px] pointer-events-none"
          style={{ background:'linear-gradient(to left,transparent,rgba(0,0,0,0.6))' }} />
      </div>

      {/* ── UI layer — above doors ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 4 }}
      >
        {/*
         * ── Layered panel group ──────────────────────────────────────────
         *  Both images share the same bounding box so they stack perfectly.
         *  The entire group animates together on click.
         */}
        <div
          className="panel-group"
          style={{
            position:    'relative',
            width:       'clamp(520px, 60vw, 820px)',
            aspectRatio: '1.78 / 1',
          }}
        >
          {/* ── Layer 1: brown cover (bottom, slightly larger for depth) ── */}
          <img
            src={cover}
            alt=""
            aria-hidden
            style={{
              position:     'absolute',
              /* extend ~1.5% on every side so it peeks behind the parchment */
              top:          '-1.5%',
              left:         '-1.5%',
              width:        '103%',
              height:       '103%',
              objectFit:    'fill',
              borderRadius: '4px',
              pointerEvents:'none',
              userSelect:   'none',
              /* subtle drop-shadow to sell the layered depth */
              filter:       'drop-shadow(0 8px 24px rgba(0,0,0,0.55))',
              zIndex:       1,
            }}
          />

          {/* ── Layer 2: parchment / open-book (top) ── */}
          <img
            src={parchment}
            alt=""
            aria-hidden
            style={{
              position:     'absolute',
              inset:        0,
              width:        '100%',
              height:       '100%',
              objectFit:    'fill',
              pointerEvents:'none',
              userSelect:   'none',
              zIndex:       2,
            }}
          />

          {/* ── Layer 3: title + button content ── */}
          <div
            className="relative flex flex-col items-center justify-center gap-3 w-full h-full"
            style={{ paddingInline: '9%', paddingBlock: '7%', zIndex: 3 }}
          >
            {/* Title group */}
            <div className="title-text flex flex-col items-center select-none">
              <p style={{
                fontFamily:    "'Averia Serif Libre', serif",
                fontSize:      'clamp(22px, 3.6vw, 56px)',
                fontWeight:    'bold',
                color:         '#3B2206',
                letterSpacing: '-1px',
                lineHeight:    1.1,
                textAlign:     'center',
                textShadow:    '0 1px 3px rgba(255,245,220,0.6), 0 2px 8px rgba(160,100,30,0.25)',
              }}>
                Genshin Battle TCG
              </p>

              <p style={{
                fontFamily:    "'Averia Serif Libre', serif",
                fontSize:      'clamp(11px, 1.5vw, 20px)',
                color:         '#7A5120',
                letterSpacing: '0.12em',
                marginTop:     '6px',
                textAlign:     'center',
                textShadow:    '0 1px 2px rgba(255,245,210,0.5)',
              }}>
                ✦ ─── A Turn-Based Adventure ─── ✦
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.35fr 1fr 1fr',
                gap: 'clamp(6px, 1vw, 12px)',
                width: 'min(92%, 620px)',
              }}
            >
              {[
                { stage: 'Stage 01', name: 'Sakura Duel', status: 'Active', active: true },
                { stage: 'Stage 02', name: 'Storm Shrine', status: 'Soon', active: false },
                { stage: 'Stage 03', name: 'Abyss Gate', status: 'Soon', active: false },
              ].map((level) => (
                <div
                  key={level.stage}
                  style={{
                    minHeight: 'clamp(48px, 7vw, 72px)',
                    borderRadius: 8,
                    border: level.active ? '2px solid rgba(126,78,24,0.78)' : '1px solid rgba(126,78,24,0.32)',
                    background: level.active
                      ? 'linear-gradient(180deg, rgba(255,245,212,0.88), rgba(218,169,92,0.58))'
                      : 'rgba(70,42,20,0.14)',
                    boxShadow: level.active
                      ? '0 5px 14px rgba(90,48,10,0.22), inset 0 0 0 1px rgba(255,255,255,0.35)'
                      : 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                    padding: 'clamp(6px, 1vw, 10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: level.active ? 1 : 0.64,
                  }}
                >
                  <span style={{
                    fontFamily: "'Averia Serif Libre', serif",
                    fontSize: 'clamp(8px, 1vw, 12px)',
                    color: level.active ? '#704415' : '#7A5120',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}>
                    {level.stage}
                  </span>
                  <span style={{
                    fontFamily: "'Averia Serif Libre', serif",
                    fontSize: 'clamp(11px, 1.35vw, 18px)',
                    fontWeight: 'bold',
                    color: '#3B2206',
                    lineHeight: 1.05,
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {level.name}
                  </span>
                  <span style={{
                    fontFamily: "'Averia Serif Libre', serif",
                    fontSize: 'clamp(8px, 0.9vw, 11px)',
                    color: level.active ? '#7A2E20' : '#7A5120',
                    marginTop: 3,
                    lineHeight: 1,
                  }}>
                    {level.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative divider */}
            <div style={{
              width:      '60%',
              height:     '1px',
              background: 'linear-gradient(to right, transparent, #A87840, transparent)',
              opacity:    0.7,
            }} />

            {/* Play button */}
            <button
              className="prescreen-play-btn pointer-events-auto select-none flex items-center justify-center bg-gradient-to-b from-[#4A5C77] to-[#293241] border-2 border-[#D4B173] rounded-full px-16 py-3 outline-none"
              onClick={handlePlay}
              disabled={opening}
              style={{
                cursor: opening ? 'default' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.1)',
              }}
            >
              <p style={{
                fontFamily:    "'Averia Serif Libre', serif",
                fontSize:      'clamp(18px, 2.5vw, 28px)',
                fontWeight:    'bold',
                color:         '#FFF5E1',
                letterSpacing: '1px',
                lineHeight:    1.1,
                textShadow:    '0 2px 4px rgba(0,0,0,0.8)',
              }}>
                Play
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
