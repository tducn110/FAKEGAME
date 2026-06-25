export interface Card {
  id: number;
  name: string;
  type: 'attack' | 'defend' | 'skill';
  cost: number;
  value: number;
  description: string;
  icon: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: string;
}

export interface DamageNumber {
  id: number;
  value: number;
  target: 'enemy' | 'player';
  isHeal?: boolean;
}

export interface CardGameProps {
  started?: boolean;
  isMobile?: boolean;
}
