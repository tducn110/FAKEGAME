import PlusSign from './PlusSign';
import tropicalFruitVFX from 'figma:asset/16ae7de0ac39276127ed83f0300bf4c696c12d39.png';

interface TropicalFruitVFXProps {
  side: 'player' | 'enemy';
  visible: boolean;
}

export default function TropicalFruitVFX({ side, visible }: TropicalFruitVFXProps) {
  if (!visible) return null;

  const isEnemy = side === 'enemy';
  const prefix = isEnemy ? 'efruit' : 'fruit';
  const plusPrefix = isEnemy ? 'eplus' : 'plus';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        [isEnemy ? 'right' : 'left']: 'var(--size-fruit-offset)',
        top: '50%',
        transform: `translate(${isEnemy ? '50%' : '-50%'}, -50%)`,
        zIndex: 25,
      }}
    >
      {([1, 2, 3, 4, 5] as const).map(i => (
        <img
          key={`fruit-${i}`}
          src={tropicalFruitVFX}
          alt=""
          style={{
            position: 'absolute',
            width: i % 2 === 0 ? 'var(--size-fruit-small)' : 'var(--size-fruit-large)',
            height: i % 2 === 0 ? 'var(--size-fruit-small)' : 'var(--size-fruit-large)',
            top: '50%',
            left: '50%',
            marginTop: i % 2 === 0 ? '-28px' : '-35px',
            marginLeft: i % 2 === 0 ? '-28px' : '-35px',
            filter: `drop-shadow(0 0 10px var(--color-fruit-glow))`,
            animation: `${prefix}-orbit-${i} 1.4s cubic-bezier(0.34,1.2,0.64,1) forwards`,
          }}
        />
      ))}
      <PlusSign animationName={`${plusPrefix}-pop-1`} delay="0s" />
      <PlusSign animationName={`${plusPrefix}-pop-2`} delay="0.1s" />
      <PlusSign animationName={`${plusPrefix}-pop-3`} delay="0.2s" />
    </div>
  );
}
