interface ImageVFXProps {
  side: 'player' | 'enemy';
  visible: boolean;
  src: string;
  alt: string;
  size: number;
  glowColor: string;
  animationName: string;
  duration?: string;
}

export default function ImageVFX({
  side, visible, src, alt, size, glowColor, animationName, duration = '0.3s',
}: ImageVFXProps) {
  if (!visible) return null;

  const isEnemy = side === 'enemy';

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ [isEnemy ? 'left' : 'right']: 'var(--size-vfx-offset)', zIndex: 'var(--z-vfx)' }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: `drop-shadow(0 0 30px ${glowColor})`,
          transform: isEnemy ? 'scaleX(-1)' : undefined,
          animation: `${isEnemy ? `enemy-${animationName}` : animationName} ${duration} ease-out`,
        }}
      />
    </div>
  );
}
