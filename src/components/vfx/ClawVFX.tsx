import ImageVFX from './ImageVFX';
import clawImage from 'figma:asset/fc32814c502d8b4264f72d196818696a277c38d8.png';

interface ClawVFXProps {
  side: 'player' | 'enemy';
  visible: boolean;
}

export default function ClawVFX({ side, visible }: ClawVFXProps) {
  return (
    <ImageVFX
      side={side}
      visible={visible}
      src={clawImage}
      alt={`${side} Claw Attack`}
      size={200}
      glowColor={side === 'enemy' ? 'var(--color-claw-enemy)' : 'var(--color-claw-player)'}
      animationName="claw-slash"
      duration="0.3s"
    />
  );
}
