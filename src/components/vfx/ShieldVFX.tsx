import shieldVFX from 'figma:asset/55ad35d9e26679621ee5b8e521ad0e6e7e8fa519.png';

interface ShieldVFXProps {
  side: 'player' | 'enemy';
  shield: number;
  showAnim: boolean;
  size: number;
  fontSize: number;
}

export default function ShieldVFX({ side, shield, showAnim, size, fontSize }: ShieldVFXProps) {
  if (shield <= 0) return null;

  const isEnemy = side === 'enemy';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: '50%',
        left: `calc(50% + ${isEnemy ? '-100' : '100'}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 'var(--z-vfx)',
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: showAnim
            ? 'shieldAppear 0.5s cubic-bezier(0.34,1.56,0.64,1)'
            : 'shieldIdle 2.5s ease-in-out infinite',
        }}
      >
        <img
          src={shieldVFX}
          alt={`${side} Shield`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            filter: `drop-shadow(0 0 18px ${isEnemy ? 'var(--color-shield-enemy)' : 'var(--color-shield-player)'}) drop-shadow(0 0 6px var(--color-shield-glow))`,
            objectFit: 'contain',
            transform: isEnemy ? 'scaleX(-1)' : undefined,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: isEnemy ? '8px' : '10px' }}>
          <span className="text-white font-bold" style={{
            fontSize: `${fontSize}px`,
            fontFamily: 'var(--font-game)',
            textShadow: 'var(--shadow-shield-number)',
            letterSpacing: '-1px',
          }}>
            {shield}
          </span>
        </div>
      </div>
    </div>
  );
}
