import { useReducer, useCallback, useRef } from 'react';
import type { Card, DamageNumber } from '../game/types';
import {
  INITIAL_PLAYER_HEALTH, INITIAL_ENEMY_HEALTH,
  INITIAL_PLAYER_MANA, INITIAL_ENEMY_MANA, MAX_MANA,
  buildDeck, shuffleArray, INITIAL_DECK_BUILD, INITIAL_ENEMY_DECK_BUILD,
  RESET_DECK_BUILD, RESET_ENEMY_DECK_BUILD,
} from '../game/config';
import { greedyEnemyAI, ENEMY_TIMING } from '../game/enemyAI';

export interface GameState {
  playerHealth: number;
  enemyHealth: number;
  playerShield: number;
  enemyShield: number;
  playerMana: number;
  maxMana: number;
  enemyMana: number;
  enemyMaxMana: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  selectedCard: number | null;
  isPlayerTurn: boolean;
  turnCount: number;
  gameMessage: string;
  gameOver: boolean;
  isPlayingCard: boolean;
  hasPlayedCard: boolean;
  screenShake: number;
  animationFrame: number;
  cardIdCounter: number;
  damageNumbers: DamageNumber[];
  enemyHand: Card[];
  enemyPlayingCardId: number | null;
  isDiscarding: boolean;
  isEnemyDiscarding: boolean;
  drawAnimKey: number;
  enemyDrawAnimKey: number;
  laserBeam: number;
  playerJumping: boolean;
  showClaw: boolean;
  playerGlitch: boolean;
  enemyGlitch: boolean;
  showDarkBibleVFX: boolean;
  blackScreenOpacity: number;
  showPlayerShieldAnim: boolean;
  showEnemyShieldAnim: boolean;
  showTropicalFruitVFX: boolean;
  playerHit: boolean;
  enemyHit: boolean;
  enemyJumping: boolean;
  showEnemyClaw: boolean;
  showEnemyDarkBibleVFX: boolean;
  showEnemyTropicalFruitVFX: boolean;
  introStarted: boolean;
  introCharPhase: 'waiting' | 'entering' | 'done';
  introCardPhase: boolean;
  cardsLocked: boolean;
  showReadyText: boolean;
  showFightText: boolean;
}

type GameAction =
  | { type: 'SET_PLAYER_HEALTH'; value: number }
  | { type: 'SET_ENEMY_HEALTH'; value: number }
  | { type: 'SET_PLAYER_SHIELD'; value: number }
  | { type: 'SET_ENEMY_SHIELD'; value: number }
  | { type: 'SET_PLAYER_MANA'; value: number }
  | { type: 'SET_MAX_MANA'; value: number }
  | { type: 'SET_ENEMY_MANA'; value: number }
  | { type: 'SET_ENEMY_MAX_MANA'; value: number }
  | { type: 'SET_HAND'; cards: Card[] }
  | { type: 'SET_DECK'; cards: Card[] }
  | { type: 'SET_DISCARD_PILE'; cards: Card[] }
  | { type: 'SET_SELECTED_CARD'; id: number | null }
  | { type: 'SET_IS_PLAYER_TURN'; value: boolean }
  | { type: 'SET_TURN_COUNT'; value: number }
  | { type: 'SET_GAME_MESSAGE'; text: string }
  | { type: 'SET_GAME_OVER'; value: boolean }
  | { type: 'SET_IS_PLAYING_CARD'; value: boolean }
  | { type: 'SET_HAS_PLAYED_CARD'; value: boolean }
  | { type: 'SET_SCREEN_SHAKE'; value: number }
  | { type: 'DECREMENT_SCREEN_SHAKE'; amount: number }
  | { type: 'SET_ANIMATION_FRAME'; value: number }
  | { type: 'SET_CARD_ID_COUNTER'; value: number }
  | { type: 'ADD_DAMAGE_NUMBER'; number: DamageNumber }
  | { type: 'REMOVE_DAMAGE_NUMBER'; id: number }
  | { type: 'SET_ENEMY_HAND'; cards: Card[] }
  | { type: 'SET_ENEMY_PLAYING_CARD_ID'; id: number | null }
  | { type: 'SET_IS_DISCARDING'; value: boolean }
  | { type: 'SET_IS_ENEMY_DISCARDING'; value: boolean }
  | { type: 'INCREMENT_DRAW_ANIM_KEY' }
  | { type: 'INCREMENT_ENEMY_DRAW_ANIM_KEY' }
  | { type: 'SET_LASER_BEAM'; value: number }
  | { type: 'SET_PLAYER_JUMPING'; value: boolean }
  | { type: 'SET_SHOW_CLAW'; value: boolean }
  | { type: 'SET_PLAYER_GLITCH'; value: boolean }
  | { type: 'SET_ENEMY_GLITCH'; value: boolean }
  | { type: 'SET_SHOW_DARK_BIBLE_VFX'; value: boolean }
  | { type: 'SET_BLACK_SCREEN_OPACITY'; value: number }
  | { type: 'SET_SHOW_PLAYER_SHIELD_ANIM'; value: boolean }
  | { type: 'SET_SHOW_ENEMY_SHIELD_ANIM'; value: boolean }
  | { type: 'SET_SHOW_TROPICAL_FRUIT_VFX'; value: boolean }
  | { type: 'SET_PLAYER_HIT'; value: boolean }
  | { type: 'SET_ENEMY_HIT'; value: boolean }
  | { type: 'SET_ENEMY_JUMPING'; value: boolean }
  | { type: 'SET_SHOW_ENEMY_CLAW'; value: boolean }
  | { type: 'SET_SHOW_ENEMY_DARK_BIBLE_VFX'; value: boolean }
  | { type: 'SET_SHOW_ENEMY_TROPICAL_FRUIT_VFX'; value: boolean }
  | { type: 'SET_INTRO_STARTED'; value: boolean }
  | { type: 'SET_INTRO_CHAR_PHASE'; value: 'waiting' | 'entering' | 'done' }
  | { type: 'SET_INTRO_CARD_PHASE'; value: boolean }
  | { type: 'SET_CARDS_LOCKED'; value: boolean }
  | { type: 'SET_SHOW_READY_TEXT'; value: boolean }
  | { type: 'SET_SHOW_FIGHT_TEXT'; value: boolean }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  playerHealth: INITIAL_PLAYER_HEALTH,
  enemyHealth: INITIAL_ENEMY_HEALTH,
  playerShield: 0,
  enemyShield: 0,
  playerMana: INITIAL_PLAYER_MANA,
  maxMana: INITIAL_PLAYER_MANA,
  enemyMana: INITIAL_ENEMY_MANA,
  enemyMaxMana: INITIAL_ENEMY_MANA,
  hand: [],
  deck: [],
  discardPile: [],
  selectedCard: null,
  isPlayerTurn: true,
  turnCount: 1,
  gameMessage: '',
  gameOver: false,
  isPlayingCard: false,
  hasPlayedCard: false,
  screenShake: 0,
  animationFrame: 0,
  cardIdCounter: 0,
  damageNumbers: [],
  enemyHand: [],
  enemyPlayingCardId: null,
  isDiscarding: false,
  isEnemyDiscarding: false,
  drawAnimKey: 0,
  enemyDrawAnimKey: 0,
  laserBeam: 0,
  playerJumping: false,
  showClaw: false,
  playerGlitch: false,
  enemyGlitch: false,
  showDarkBibleVFX: false,
  blackScreenOpacity: 0,
  showPlayerShieldAnim: false,
  showEnemyShieldAnim: false,
  showTropicalFruitVFX: false,
  playerHit: false,
  enemyHit: false,
  enemyJumping: false,
  showEnemyClaw: false,
  showEnemyDarkBibleVFX: false,
  showEnemyTropicalFruitVFX: false,
  introStarted: false,
  introCharPhase: 'waiting' as const,
  introCardPhase: false,
  cardsLocked: false,
  showReadyText: false,
  showFightText: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_HEALTH': return { ...state, playerHealth: action.value };
    case 'SET_ENEMY_HEALTH': return { ...state, enemyHealth: action.value };
    case 'SET_PLAYER_SHIELD': return { ...state, playerShield: action.value };
    case 'SET_ENEMY_SHIELD': return { ...state, enemyShield: action.value };
    case 'SET_PLAYER_MANA': return { ...state, playerMana: action.value };
    case 'SET_MAX_MANA': return { ...state, maxMana: action.value };
    case 'SET_ENEMY_MANA': return { ...state, enemyMana: action.value };
    case 'SET_ENEMY_MAX_MANA': return { ...state, enemyMaxMana: action.value };
    case 'SET_HAND': return { ...state, hand: (action as any).cards || (action as any).value };
    case 'SET_DECK': return { ...state, deck: (action as any).cards || (action as any).value };
    case 'SET_DISCARD_PILE': return { ...state, discardPile: (action as any).cards || (action as any).value };
    case 'SET_SELECTED_CARD': return { ...state, selectedCard: action.id };
    case 'SET_IS_PLAYER_TURN': return { ...state, isPlayerTurn: action.value };
    case 'SET_TURN_COUNT': return { ...state, turnCount: action.value };
    case 'SET_GAME_MESSAGE': return { ...state, gameMessage: action.text };
    case 'SET_GAME_OVER': return { ...state, gameOver: action.value };
    case 'SET_IS_PLAYING_CARD': return { ...state, isPlayingCard: action.value };
    case 'SET_HAS_PLAYED_CARD': return { ...state, hasPlayedCard: action.value };
    case 'SET_SCREEN_SHAKE': return { ...state, screenShake: action.value };
    case 'DECREMENT_SCREEN_SHAKE': {
      const next = Math.max(0, state.screenShake - action.amount);
      return { ...state, screenShake: next };
    }
    case 'SET_ANIMATION_FRAME': return { ...state, animationFrame: action.value };
    case 'SET_CARD_ID_COUNTER': return { ...state, cardIdCounter: action.value };
    case 'ADD_DAMAGE_NUMBER':
      return { ...state, damageNumbers: [...state.damageNumbers, action.number] };
    case 'REMOVE_DAMAGE_NUMBER':
      return { ...state, damageNumbers: state.damageNumbers.filter(d => d.id !== action.id) };
    case 'SET_ENEMY_HAND': return { ...state, enemyHand: (action as any).cards || (action as any).value };
    case 'SET_ENEMY_PLAYING_CARD_ID': return { ...state, enemyPlayingCardId: action.id };
    case 'SET_IS_DISCARDING': return { ...state, isDiscarding: action.value };
    case 'SET_IS_ENEMY_DISCARDING': return { ...state, isEnemyDiscarding: action.value };
    case 'INCREMENT_DRAW_ANIM_KEY':
      return { ...state, drawAnimKey: state.drawAnimKey + 1 };
    case 'INCREMENT_ENEMY_DRAW_ANIM_KEY':
      return { ...state, enemyDrawAnimKey: state.enemyDrawAnimKey + 1 };
    case 'SET_LASER_BEAM': return { ...state, laserBeam: action.value };
    case 'SET_PLAYER_JUMPING': return { ...state, playerJumping: action.value };
    case 'SET_SHOW_CLAW': return { ...state, showClaw: action.value };
    case 'SET_PLAYER_GLITCH': return { ...state, playerGlitch: action.value };
    case 'SET_ENEMY_GLITCH': return { ...state, enemyGlitch: action.value };
    case 'SET_SHOW_DARK_BIBLE_VFX': return { ...state, showDarkBibleVFX: action.value };
    case 'SET_BLACK_SCREEN_OPACITY': return { ...state, blackScreenOpacity: action.value };
    case 'SET_SHOW_PLAYER_SHIELD_ANIM': return { ...state, showPlayerShieldAnim: action.value };
    case 'SET_SHOW_ENEMY_SHIELD_ANIM': return { ...state, showEnemyShieldAnim: action.value };
    case 'SET_SHOW_TROPICAL_FRUIT_VFX': return { ...state, showTropicalFruitVFX: action.value };
    case 'SET_PLAYER_HIT': return { ...state, playerHit: action.value };
    case 'SET_ENEMY_HIT': return { ...state, enemyHit: action.value };
    case 'SET_ENEMY_JUMPING': return { ...state, enemyJumping: action.value };
    case 'SET_SHOW_ENEMY_CLAW': return { ...state, showEnemyClaw: action.value };
    case 'SET_SHOW_ENEMY_DARK_BIBLE_VFX': return { ...state, showEnemyDarkBibleVFX: action.value };
    case 'SET_SHOW_ENEMY_TROPICAL_FRUIT_VFX': return { ...state, showEnemyTropicalFruitVFX: action.value };
    case 'SET_INTRO_STARTED': return { ...state, introStarted: action.value };
    case 'SET_INTRO_CHAR_PHASE': return { ...state, introCharPhase: action.value };
    case 'SET_INTRO_CARD_PHASE': return { ...state, introCardPhase: action.value };
    case 'SET_CARDS_LOCKED': return { ...state, cardsLocked: action.value };
    case 'SET_SHOW_READY_TEXT': return { ...state, showReadyText: action.value };
    case 'SET_SHOW_FIGHT_TEXT': return { ...state, showFightText: action.value };
    case 'RESET_GAME': {
      const { deck: newDeck, nextId } = buildDeck(RESET_DECK_BUILD, state.cardIdCounter);
      return {
        ...initialState,
        introStarted: true,
        introCharPhase: 'done',
        introCardPhase: true,
        deck: newDeck,
        cardIdCounter: nextId,
      };
    }
    default:
      return state;
  }
}

export function useGameState(onEnemyCard?: (card: Card) => void) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const playerShieldRef = useRef(0);
  const enemyShieldRef = useRef(0);
  const enemyManaRef = useRef(INITIAL_ENEMY_MANA);
  const enemyMaxManaRef = useRef(INITIAL_ENEMY_MANA);
  const enemyDeckRef = useRef<Card[]>([]);
  const enemyDiscardRef = useRef<Card[]>([]);
  const damageNumberIdRef = useRef(0);

  const initDeck = useCallback((initialDrawCount = 0, useResetBuild = false) => {
    const playerBuild = useResetBuild ? RESET_DECK_BUILD : INITIAL_DECK_BUILD;
    const enemyBuild = useResetBuild ? RESET_ENEMY_DECK_BUILD : INITIAL_ENEMY_DECK_BUILD;
    const { deck: playerDeck, nextId } = buildDeck(playerBuild, 0);
    const drawnCards = playerDeck.slice(0, initialDrawCount);
    const remainingDeck = playerDeck.slice(initialDrawCount);

    dispatch({ type: 'SET_HAND', cards: drawnCards });
    dispatch({ type: 'SET_DECK', cards: remainingDeck });
    dispatch({ type: 'SET_DISCARD_PILE', cards: [] });
    dispatch({ type: 'SET_CARD_ID_COUNTER', value: nextId });
    if (initialDrawCount > 0) dispatch({ type: 'INCREMENT_DRAW_ANIM_KEY' });

    const { deck: enemyDeck } = buildDeck(enemyBuild, 200);
    enemyDeckRef.current = enemyDeck;
    enemyDiscardRef.current = [];
  }, []);

  const drawCards = useCallback((count: number) => {
    const drawnCards: Card[] = [];
    let remainingDeck = [...state.deck];

    for (let i = 0; i < count; i++) {
      if (remainingDeck.length === 0) {
        if (state.discardPile.length === 0) break;
        remainingDeck = shuffleArray(state.discardPile);
        dispatch({ type: 'SET_DISCARD_PILE', cards: [] });
      }
      drawnCards.push(remainingDeck[0]);
      remainingDeck = remainingDeck.slice(1);
    }

    dispatch({ type: 'SET_HAND', cards: drawnCards });
    dispatch({ type: 'SET_DECK', cards: remainingDeck });
    dispatch({ type: 'INCREMENT_DRAW_ANIM_KEY' });
  }, [state.deck, state.discardPile]);

  const spawnDamageNumber = useCallback((value: number, target: 'enemy' | 'player', isHeal?: boolean) => {
    const id = damageNumberIdRef.current++;
    dispatch({ type: 'ADD_DAMAGE_NUMBER', number: { id, value, target, isHeal } });
    setTimeout(() => dispatch({ type: 'REMOVE_DAMAGE_NUMBER', id }), 1700);
  }, []);

  const executeEnemyTurn = useCallback(() => {
    enemyShieldRef.current = 0;
    dispatch({ type: 'SET_ENEMY_SHIELD', value: 0 });

    let eDeck = [...enemyDeckRef.current];
    let eDiscard = [...enemyDiscardRef.current];
    const drawnCards: Card[] = [];

    for (let i = 0; i < 5; i++) {
      if (eDeck.length === 0) {
        if (eDiscard.length === 0) break;
        eDeck = shuffleArray(eDiscard);
        eDiscard = [];
      }
      drawnCards.push(eDeck[0]);
      eDeck = eDeck.slice(1);
    }

    enemyDeckRef.current = eDeck;
    enemyDiscardRef.current = [...eDiscard, ...drawnCards];

    dispatch({ type: 'SET_ENEMY_HAND', cards: drawnCards });
    dispatch({ type: 'INCREMENT_ENEMY_DRAW_ANIM_KEY' });

    const aiResult = greedyEnemyAI(drawnCards, enemyManaRef.current, state.enemyHealth, state.playerHealth);
    enemyManaRef.current = aiResult.remainingMana;
    dispatch({ type: 'SET_ENEMY_MANA', value: aiResult.remainingMana });

    const { CARD_INTERVAL, HIGHLIGHT_OFFSET, ACTION_OFFSET, REMOVE_OFFSET, DISCARD_DELAY, DISCARD_START, TURN_START_DELAY } = ENEMY_TIMING;

    if (aiResult.cardsToPlay.length === 0) {
      setTimeout(() => {
        dispatch({ type: 'SET_IS_ENEMY_DISCARDING', value: true });
        setTimeout(() => {
          dispatch({ type: 'SET_IS_ENEMY_DISCARDING', value: false });
          dispatch({ type: 'SET_ENEMY_HAND', cards: [] });
          // startNewTurn equivalent
          dispatch({ type: 'SET_IS_PLAYER_TURN', value: true });
          dispatch({ type: 'SET_TURN_COUNT', value: state.turnCount + 1 });
          playerShieldRef.current = 0;
          dispatch({ type: 'SET_PLAYER_SHIELD', value: 0 });
          if ((state.turnCount + 1) % 3 === 0) {
            dispatch({ type: 'SET_MAX_MANA', value: Math.min(MAX_MANA, state.maxMana + 1) });
            enemyMaxManaRef.current = Math.min(MAX_MANA, enemyMaxManaRef.current + 1);
            dispatch({ type: 'SET_ENEMY_MAX_MANA', value: enemyMaxManaRef.current });
          }
          dispatch({ type: 'SET_PLAYER_MANA', value: state.maxMana });
          enemyManaRef.current = enemyMaxManaRef.current;
          dispatch({ type: 'SET_ENEMY_MANA', value: enemyMaxManaRef.current });
          dispatch({ type: 'SET_GAME_MESSAGE', text: 'Your Turn!' });
          setTimeout(() => dispatch({ type: 'SET_GAME_MESSAGE', text: '' }), 1500);
        }, DISCARD_DELAY);
      }, DISCARD_START);
      return;
    }

    aiResult.cardsToPlay.forEach((card, i) => {
      const base = i * CARD_INTERVAL;
      setTimeout(() => dispatch({ type: 'SET_ENEMY_PLAYING_CARD_ID', id: card.id }), base + HIGHLIGHT_OFFSET);
      setTimeout(() => {
        if (onEnemyCard) onEnemyCard(card);
        dispatch({ type: 'SET_ENEMY_PLAYING_CARD_ID', id: null });
        dispatch({ type: 'SET_ENEMY_HAND', cards: drawnCards.filter(c => c.id !== card.id) });
      }, base + ACTION_OFFSET);
    });

    const allDone = aiResult.cardsToPlay.length * CARD_INTERVAL;
    setTimeout(() => dispatch({ type: 'SET_IS_ENEMY_DISCARDING', value: true }), allDone + 300);
    setTimeout(() => {
      dispatch({ type: 'SET_IS_ENEMY_DISCARDING', value: false });
      dispatch({ type: 'SET_ENEMY_HAND', cards: [] });
      dispatch({ type: 'SET_IS_PLAYER_TURN', value: true });
      dispatch({ type: 'SET_TURN_COUNT', value: state.turnCount + 1 });
      playerShieldRef.current = 0;
      dispatch({ type: 'SET_PLAYER_SHIELD', value: 0 });
      if ((state.turnCount + 1) % 3 === 0) {
        dispatch({ type: 'SET_MAX_MANA', value: Math.min(MAX_MANA, state.maxMana + 1) });
        enemyMaxManaRef.current = Math.min(MAX_MANA, enemyMaxManaRef.current + 1);
        dispatch({ type: 'SET_ENEMY_MAX_MANA', value: enemyMaxManaRef.current });
      }
      dispatch({ type: 'SET_PLAYER_MANA', value: state.maxMana });
      enemyManaRef.current = enemyMaxManaRef.current;
      dispatch({ type: 'SET_ENEMY_MANA', value: enemyMaxManaRef.current });
      dispatch({ type: 'SET_GAME_MESSAGE', text: 'Your Turn!' });
      setTimeout(() => dispatch({ type: 'SET_GAME_MESSAGE', text: '' }), 1500);
    }, allDone + 1050);
  }, [state.turnCount, state.maxMana, state.enemyHealth, state.playerHealth]);

  return {
    state,
    dispatch,
    playerShieldRef,
    enemyShieldRef,
    enemyManaRef,
    enemyMaxManaRef,
    enemyDeckRef,
    enemyDiscardRef,
    damageNumberIdRef,
    initDeck,
    drawCards,
    spawnDamageNumber,
    executeEnemyTurn,
  };
}
