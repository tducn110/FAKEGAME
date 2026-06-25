import type { Card } from './types';

export const CARD_DECK: Omit<Card, 'id'>[] = [
  { name: 'Defend', type: 'defend', cost: 1, value: 10, description: 'Block 10 damage', icon: 'shield' },
  { name: 'Dark Bible', type: 'skill', cost: 3, value: 30, description: 'Deal 30 Magic Damage', icon: 'flame' },
  { name: 'Tropical Fruit', type: 'skill', cost: 2, value: 15, description: 'Heal 15 HP', icon: 'heart' },
  { name: 'Shoot', type: 'attack', cost: 1, value: 10, description: 'Deal 10 Damage', icon: 'zap' },
];

export const DESIGN_W = 1280;
export const DESIGN_H = 700;

export const INITIAL_PLAYER_HEALTH = 100;
export const INITIAL_ENEMY_HEALTH = 80;
export const INITIAL_PLAYER_MANA = 3;
export const INITIAL_ENEMY_MANA = 4;
export const MAX_MANA = 10;
export const MANA_GROWTH_INTERVAL = 3;

export const INITIAL_DECK_BUILD = [
  { type: 'attack' as const, count: 4 },
  { type: 'defend' as const, count: 4 },
  { type: 'heal' as const, count: 4 },
  { type: 'skill' as const, count: 4 },
];

export const INITIAL_ENEMY_DECK_BUILD = [
  { type: 'attack' as const, count: 4 },
  { type: 'defend' as const, count: 4 },
  { type: 'heal' as const, count: 4 },
  { type: 'skill' as const, count: 4 },
];

export const RESET_DECK_BUILD = [
  { type: 'attack' as const, count: 6 },
  { type: 'defend' as const, count: 4 },
  { type: 'heal' as const, count: 3 },
  { type: 'skill' as const, count: 2 },
];

export const RESET_ENEMY_DECK_BUILD = [
  { type: 'attack' as const, count: 6 },
  { type: 'defend' as const, count: 4 },
  { type: 'heal' as const, count: 3 },
  { type: 'skill' as const, count: 2 },
];

export const CARD_TYPE_MAP: Record<string, number> = {
  attack: 3,
  defend: 0,
  heal: 2,
  skill: 1,
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function buildDeck(
  build: { type: string; count: number }[],
  startId: number
): { deck: Card[]; nextId: number } {
  const deck: Card[] = [];
  let id = startId;
  for (const { type, count } of build) {
    const cardIndex = CARD_TYPE_MAP[type] ?? 3;
    for (let i = 0; i < count; i++) {
      deck.push({ ...CARD_DECK[cardIndex], id: id++ });
    }
  }
  return { deck: shuffleArray(deck), nextId: id };
}
