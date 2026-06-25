import type { DamageNumber as DamageNumberType } from '../../game/types';

interface DamageNumberProps {
  numbers: DamageNumberType[];
}

export default function DamageNumbers({ numbers }: DamageNumberProps) {
  return (
    <>
      {numbers.map(dn => (
        <div
          key={dn.id}
          className="absolute pointer-events-none"
          style={{
            ...(dn.target === 'enemy'
              ? { right: 'var(--size-dmg-offset-enemy-right)', top: 'calc(50% - 30px)' }
              : { left: 'var(--size-dmg-offset-player-left)', top: 'calc(50% - 270px)' }),
            transform: 'translateX(-50%)',
            animation: 'dmg-float-y 1.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            willChange: 'transform',
            zIndex: 'var(--z-damage)',
          }}
        >
          <span
            className="block font-bold whitespace-none"
            style={{
              fontSize: 'var(--size-damage-number)',
              fontFamily: 'var(--font-game)',
              color: dn.isHeal ? 'var(--color-heal)' : 'var(--color-damage)',
              WebkitTextStroke: '3px var(--color-health-bg)',
              lineHeight: 1,
              textShadow: dn.isHeal ? 'var(--shadow-heal-text)' : 'var(--shadow-damage-text)',
              userSelect: 'none',
              animation: 'dmg-scale-fade 1.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              willChange: 'transform, opacity',
            }}
          >
            {dn.isHeal ? `+${dn.value}` : `-${dn.value}`}
          </span>
        </div>
      ))}
    </>
  );
}
