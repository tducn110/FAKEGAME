import ImageVFX from './ImageVFX';
import darkBibleVFX from 'figma:asset/5fbc0f11aa5c01e6fdfb69d1d54a67b3c77f685b.png';

interface DarkBibleVFXProps {
  side: 'player' | 'enemy';
  visible: boolean;
}

export default function DarkBibleVFX({ side, visible }: DarkBibleVFXProps) {
  return (
    <ImageVFX
      side={side}
      visible={visible}
      src={darkBibleVFX}
      alt={`${side} Dark Bible VFX`}
      size={400}
      glowColor="var(--color-dark-bible)"
      animationName="dark-bible-vfx"
      duration="1s"
    />
  );
}
