import type { Card } from './types';

export interface AIResult {
  cardsToPlay: Card[];
  remainingMana: number;
}

export function greedyEnemyAI(
  hand: Card[],
  mana: number,
  enemyHealth: number,
  playerHealth: number,
): AIResult {
  const handPool = [...hand];
  const cardsToPlay: Card[] = [];
  let remainingMana = mana;

  let madeProgress = true;
  while (madeProgress && handPool.length > 0 && remainingMana > 0) {
    madeProgress = false;

    const affordable = handPool.filter(c => c.cost <= remainingMana);
    if (affordable.length === 0) break;

    const healCard = affordable.find(c => c.icon === 'heart');
    const darkBible = affordable.find(c => c.name === 'Dark Bible');
    const attackCard = affordable.find(c => c.type === 'attack');
    const defendCard = affordable.find(c => c.type === 'defend');

    let chosen: Card | undefined;
    if (healCard && enemyHealth < 22)       chosen = healCard;
    else if (darkBible && playerHealth < 60) chosen = darkBible;
    else if (attackCard)                     chosen = attackCard;
    else if (darkBible)                      chosen = darkBible;
    else if (defendCard)                     chosen = defendCard;
    else if (healCard)                       chosen = healCard;
    else                                     chosen = affordable[0];

    if (chosen) {
      cardsToPlay.push(chosen);
      remainingMana -= chosen.cost;
      const idx = handPool.findIndex(c => c.id === chosen!.id);
      handPool.splice(idx, 1);
      madeProgress = true;
    }
  }

  return { cardsToPlay, remainingMana };
}

export const ENEMY_TIMING = {
  CARD_INTERVAL: 1700,
  HIGHLIGHT_OFFSET: 350,
  ACTION_OFFSET: 750,
  REMOVE_OFFSET: 1250,
  DISCARD_DELAY: 750,
  DISCARD_START: 900,
  TURN_START_DELAY: 600,
} as const;
