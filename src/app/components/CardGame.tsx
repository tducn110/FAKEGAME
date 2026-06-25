import { useEffect, useMemo, useRef } from 'react';
import type { Card, Particle, DamageNumber, CardGameProps } from '../../game/types';
import { useGameState } from '../../hooks/useGameState';
import { PlayerHUD } from './PlayerHUD';
import { EnemyHUD } from './EnemyHUD';
import { PlayingCard } from './PlayingCard';
import { ASSET_MAP } from '../../pixi/AssetManager';
import { PixiCanvas } from "./PixiCanvas";
import svgPaths from "../../imports/svg-06zh3695vz";
import PileButton from './PileButton';
import EndTurnButton from './EndTurnButton';
import GameMessageBox from './GameMessageBox';
import GameOverPopup from './GameOverPopup';
import TutorialHint from './TutorialHint';
import { announceReady, announceFight } from './announcer';
import {
  CARD_DECK, DESIGN_W, DESIGN_H,
  INITIAL_PLAYER_HEALTH, INITIAL_ENEMY_HEALTH,
  INITIAL_PLAYER_MANA, INITIAL_ENEMY_MANA, MAX_MANA, MANA_GROWTH_INTERVAL,
  INITIAL_DECK_BUILD, INITIAL_ENEMY_DECK_BUILD,
  RESET_DECK_BUILD, RESET_ENEMY_DECK_BUILD,
  CARD_TYPE_MAP, shuffleArray, buildDeck,
} from '../../game/config';
import {
  playWerewolfClawSound,
  playDarkBibleSound,
  playDefendSound,
  playTropicalFruitSound,
  playDefeatSound,
} from '../../audio/sounds';
import { startBackgroundMusic, stopBackgroundMusic } from '../../audio/bgm';
import { greedyEnemyAI, ENEMY_TIMING } from '../../game/enemyAI';
import ClawVFX from '../../components/vfx/ClawVFX';
import DarkBibleVFX from '../../components/vfx/DarkBibleVFX';
import TropicalFruitVFX from '../../components/vfx/TropicalFruitVFX';
import ShieldVFX from '../../components/vfx/ShieldVFX';
import DamageNumbers from '../../components/vfx/DamageNumbers';

const characterSprite = ASSET_MAP.player;
const enemySprite = ASSET_MAP.enemy;
const backgroundImage = ASSET_MAP.bg;
const imgScrollOuter = ASSET_MAP.scrollOuter;
const imgScrollInner = ASSET_MAP.scrollInner;
const imgHealthIcon = ASSET_MAP.healthIcon;
const imgManaIcon = ASSET_MAP.manaIcon;

const CARD_IMAGES = {
  'Dark Bible': ASSET_MAP.card_darkBible,
  'Tropical Fruit': ASSET_MAP.card_tropicalFruit,
  Shoot: ASSET_MAP.card_shoot,
  Defend: ASSET_MAP.card_defend,
};

export function CardGame({ started = false, isMobile = false }: CardGameProps) {
  // ── Mobile: 20 % smaller characters + cards ──────────────────────────────
  const charW       = isMobile ? 288 : 360;   // player sprite  (360 × 0.8)
  const charH       = isMobile ? 288 : 360;
  const enemW       = isMobile ? 240 : 300;   // enemy  sprite  (300 × 0.8)
  const enemH       = isMobile ? 240 : 300;
  const cardW       = isMobile ? 162 : 202;   // card face      (202 × 0.8)
  const cardH       = isMobile ? 226 : 282;   // card face      (282 × 0.8)
  const handSpacing    = isMobile ? 128 : 160;   // fan x-gap      (160 × 0.8)
  const handHeight     = isMobile ? 272 : 340;   // hand container (340 × 0.8)
  const pShieldSize    = isMobile ? 166 : 208;   // player shield VFX size
  const eShieldSize    = isMobile ? 147 : 184;   // enemy  shield VFX size
  const pShieldFont    = isMobile ? 30  : 38;    // player shield number px
  const eShieldFont    = isMobile ? 27  : 34;    // enemy  shield number px
  // ─────────────────────────────────────────────────────────────────────────

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const executeEnemyCardRef = useRef<((card: Card) => void) | null>(null);
  const {
    state: s, dispatch,
    playerShieldRef, enemyShieldRef,
    enemyManaRef, enemyMaxManaRef,
    enemyDeckRef, enemyDiscardRef,
    damageNumberIdRef,
    initDeck, drawCards, spawnDamageNumber, executeEnemyTurn,
  } = useGameState((card) => executeEnemyCardRef.current?.(card));

  // Destructure state for readability
  const {
    playerHealth, enemyHealth, playerShield, enemyShield,
    playerMana, maxMana, enemyMana, enemyMaxMana,
    hand, deck, discardPile, selectedCard, isPlayerTurn,
    turnCount, gameMessage, animationFrame, cardIdCounter,
    gameOver, hasPlayedCard, screenShake,
    laserBeam, playerJumping, showClaw, playerGlitch, enemyGlitch,
    showDarkBibleVFX, blackScreenOpacity, showPlayerShieldAnim,
    showEnemyShieldAnim, showTropicalFruitVFX, playerHit, enemyHit,
    enemyJumping, showEnemyClaw, showEnemyDarkBibleVFX,
    showEnemyTropicalFruitVFX, damageNumbers, drawAnimKey,
    isDiscarding, enemyHand, enemyPlayingCardId, enemyDrawAnimKey,
    isEnemyDiscarding, introStarted, introCharPhase, introCardPhase,
    cardsLocked, showReadyText, showFightText,
  } = s;

  const characterImage = useRef<HTMLImageElement | null>(null);
  const enemyImage = useRef<HTMLImageElement | null>(null);
  const background = useRef<HTMLImageElement | null>(null);
  const initialDrawDone = useRef(false);
  const introSequenceDone = useRef(false);
  const lastDrawnTurnCount = useRef(0);
  const laserBeamRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const cardImages = useMemo(() => CARD_IMAGES, []);

  useEffect(() => {
    playerShieldRef.current = playerShield;
  }, [playerShield, playerShieldRef]);

  useEffect(() => {
    enemyShieldRef.current = enemyShield;
  }, [enemyShield, enemyShieldRef]);

  useEffect(() => {
    if (screenShake <= 0) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'SET_SCREEN_SHAKE', value: 0 });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [screenShake, dispatch]);

  // Load images
  useEffect(() => {
    const img = new Image();
    img.src = characterSprite;
    img.onload = () => {
      characterImage.current = img;
    };

    const enemyImg = new Image();
    enemyImg.src = enemySprite;
    enemyImg.onload = () => {
      enemyImage.current = enemyImg;
    };

    const bgImg = new Image();
    bgImg.src = backgroundImage;
    bgImg.onload = () => {
      background.current = bgImg;
    };
  }, []);

  // ── Celtic tavern background music lifecycle ───────────────────────────
  useEffect(() => {
    if (started) startBackgroundMusic();
    return () => { stopBackgroundMusic(); };
  }, [started]);

  const playCard = (card: Card) => {
    if (gameOver || !isPlayerTurn || isDiscarding || cardsLocked || playerMana < card.cost) return;

    dispatch({ type: 'SET_PLAYER_MANA', value: playerMana - card.cost });
    dispatch({ type: 'SET_IS_PLAYING_CARD', value: true });
    if (!hasPlayedCard) dispatch({ type: 'SET_HAS_PLAYED_CARD', value: true });
    dispatch({ type: 'SET_SELECTED_CARD', id: card.id });

    if (card.name === 'Defend' || card.type === 'defend') {
      playDefendSound();
      dispatch({ type: 'SET_PLAYER_SHIELD', value: playerShield + card.value });
      dispatch({ type: 'SET_SHOW_PLAYER_SHIELD_ANIM', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_PLAYER_SHIELD_ANIM', value: false }), 500);
      spawnDamageNumber(card.value, 'player', true);
    } else if (card.name === 'Tropical Fruit' || card.type === 'heal') {
      playTropicalFruitSound();
      dispatch({ type: 'SET_PLAYER_HEALTH', value: Math.min(100, playerHealth + card.value) });
      dispatch({ type: 'SET_SHOW_TROPICAL_FRUIT_VFX', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_TROPICAL_FRUIT_VFX', value: false }), 1000);
      spawnDamageNumber(card.value, 'player', true);
    } else if (card.name === 'Dark Bible' || card.type === 'skill') {
      playDarkBibleSound();
      dispatch({ type: 'SET_SHOW_DARK_BIBLE_VFX', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_DARK_BIBLE_VFX', value: false }), 2000);
      
      const dmg = card.value;
      if (enemyShield > 0) {
        if (enemyShield >= dmg) {
          dispatch({ type: 'SET_ENEMY_SHIELD', value: enemyShield - dmg });
        } else {
          dispatch({ type: 'SET_ENEMY_SHIELD', value: 0 });
          dispatch({ type: 'SET_ENEMY_HEALTH', value: Math.max(0, enemyHealth - (dmg - enemyShield)) });
        }
      } else {
        dispatch({ type: 'SET_ENEMY_HEALTH', value: Math.max(0, enemyHealth - dmg) });
      }
      setTimeout(() => {
        dispatch({ type: 'SET_ENEMY_HIT', value: true });
        spawnDamageNumber(dmg, 'enemy');
        dispatch({ type: 'SET_SCREEN_SHAKE', value: 6 });
        setTimeout(() => dispatch({ type: 'SET_ENEMY_HIT', value: false }), 500);
      }, 500);
    } else {
      // Shoot / Attack
      playWerewolfClawSound();
      dispatch({ type: 'SET_PLAYER_JUMPING', value: true });
      setTimeout(() => dispatch({ type: 'SET_PLAYER_JUMPING', value: false }), 500);
      dispatch({ type: 'SET_SHOW_CLAW', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_CLAW', value: false }), 500);

      const dmg = card.value;
      if (enemyShield > 0) {
        if (enemyShield >= dmg) {
          dispatch({ type: 'SET_ENEMY_SHIELD', value: enemyShield - dmg });
        } else {
          dispatch({ type: 'SET_ENEMY_SHIELD', value: 0 });
          dispatch({ type: 'SET_ENEMY_HEALTH', value: Math.max(0, enemyHealth - (dmg - enemyShield)) });
        }
      } else {
        dispatch({ type: 'SET_ENEMY_HEALTH', value: Math.max(0, enemyHealth - dmg) });
      }
      setTimeout(() => {
        dispatch({ type: 'SET_ENEMY_HIT', value: true });
        spawnDamageNumber(dmg, 'enemy');
        dispatch({ type: 'SET_SCREEN_SHAKE', value: 5 });
        setTimeout(() => dispatch({ type: 'SET_ENEMY_HIT', value: false }), 500);
      }, 250);
    }

    const newHand = hand.filter(c => c.id !== card.id);
    dispatch({ type: 'SET_HAND', cards: newHand });
    dispatch({ type: 'SET_DISCARD_PILE', cards: [...discardPile, card] });

    setTimeout(() => {
      dispatch({ type: 'SET_IS_PLAYING_CARD', value: false });
      dispatch({ type: 'SET_SELECTED_CARD', id: null });
    }, 600);
  };

  useEffect(() => {
    executeEnemyCardRef.current = (card: Card) => {
      if (gameOver) return;

      if (card.name === 'Defend' || card.type === 'defend') {
        playDefendSound();
        const nextShield = enemyShieldRef.current + card.value;
        enemyShieldRef.current = nextShield;
        dispatch({ type: 'SET_ENEMY_SHIELD', value: nextShield });
        dispatch({ type: 'SET_SHOW_ENEMY_SHIELD_ANIM', value: true });
        setTimeout(() => dispatch({ type: 'SET_SHOW_ENEMY_SHIELD_ANIM', value: false }), 500);
        spawnDamageNumber(card.value, 'enemy', true);
        return;
      }

      if (card.name === 'Tropical Fruit' || card.icon === 'heart') {
        playTropicalFruitSound();
        dispatch({ type: 'SET_ENEMY_HEALTH', value: Math.min(INITIAL_ENEMY_HEALTH, enemyHealth + card.value) });
        dispatch({ type: 'SET_SHOW_ENEMY_TROPICAL_FRUIT_VFX', value: true });
        setTimeout(() => dispatch({ type: 'SET_SHOW_ENEMY_TROPICAL_FRUIT_VFX', value: false }), 1000);
        spawnDamageNumber(card.value, 'enemy', true);
        return;
      }

      const isDarkBible = card.name === 'Dark Bible' || card.type === 'skill';
      const delay = isDarkBible ? 500 : 250;
      const shake = isDarkBible ? 5 : 4;

      if (isDarkBible) {
        playDarkBibleSound();
        dispatch({ type: 'SET_SHOW_ENEMY_DARK_BIBLE_VFX', value: true });
        setTimeout(() => dispatch({ type: 'SET_SHOW_ENEMY_DARK_BIBLE_VFX', value: false }), 1200);
      } else {
        playWerewolfClawSound();
        dispatch({ type: 'SET_ENEMY_JUMPING', value: true });
        setTimeout(() => dispatch({ type: 'SET_ENEMY_JUMPING', value: false }), 500);
        dispatch({ type: 'SET_SHOW_ENEMY_CLAW', value: true });
        setTimeout(() => dispatch({ type: 'SET_SHOW_ENEMY_CLAW', value: false }), 500);
      }

      const dmg = card.value;
      const shield = playerShieldRef.current;
      if (shield > 0) {
        if (shield >= dmg) {
          const nextShield = shield - dmg;
          playerShieldRef.current = nextShield;
          dispatch({ type: 'SET_PLAYER_SHIELD', value: nextShield });
        } else {
          playerShieldRef.current = 0;
          dispatch({ type: 'SET_PLAYER_SHIELD', value: 0 });
          dispatch({ type: 'SET_PLAYER_HEALTH', value: Math.max(0, playerHealth - (dmg - shield)) });
        }
      } else {
        dispatch({ type: 'SET_PLAYER_HEALTH', value: Math.max(0, playerHealth - dmg) });
      }

      setTimeout(() => {
        dispatch({ type: 'SET_PLAYER_HIT', value: true });
        spawnDamageNumber(dmg, 'player');
        dispatch({ type: 'SET_SCREEN_SHAKE', value: shake });
        setTimeout(() => dispatch({ type: 'SET_PLAYER_HIT', value: false }), 500);
      }, delay);
    };
  }, [
    dispatch,
    enemyHealth,
    enemyShieldRef,
    gameOver,
    playerHealth,
    playerShieldRef,
    spawnDamageNumber,
  ]);

  const endTurn = () => {
    if (!isPlayerTurn || gameOver || isDiscarding) return;
    dispatch({ type: 'SET_IS_PLAYER_TURN', value: false });
    dispatch({ type: 'SET_IS_DISCARDING', value: true });
    
    dispatch({ type: 'SET_DISCARD_PILE', cards: [...discardPile, ...hand] });
    setTimeout(() => {
      dispatch({ type: 'SET_IS_DISCARDING', value: false });
      dispatch({ type: 'SET_HAND', cards: [] });
      executeEnemyTurn();
    }, 500);
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    initDeck(5, true);
    lastDrawnTurnCount.current = 1;
  };

  useEffect(() => {
    if (started && !initialDrawDone.current) {
      initDeck(5);
      initialDrawDone.current = true;
    }
  }, [started, initDeck]);

  useEffect(() => {
    if (!started || introSequenceDone.current) return;

    introSequenceDone.current = true;
    dispatch({ type: 'SET_INTRO_STARTED', value: true });
    dispatch({ type: 'SET_INTRO_CHAR_PHASE', value: 'entering' });
    dispatch({ type: 'SET_INTRO_CARD_PHASE', value: false });
    dispatch({ type: 'SET_CARDS_LOCKED', value: true });

    const timers = [
      window.setTimeout(() => dispatch({ type: 'SET_SHOW_READY_TEXT', value: true }), 450),
      window.setTimeout(() => dispatch({ type: 'SET_SHOW_READY_TEXT', value: false }), 1300),
      window.setTimeout(() => dispatch({ type: 'SET_SHOW_FIGHT_TEXT', value: true }), 1350),
      window.setTimeout(() => dispatch({ type: 'SET_SHOW_FIGHT_TEXT', value: false }), 2100),
      window.setTimeout(() => dispatch({ type: 'SET_INTRO_CHAR_PHASE', value: 'done' }), 1150),
      window.setTimeout(() => dispatch({ type: 'SET_INTRO_CARD_PHASE', value: true }), 1500),
      window.setTimeout(() => dispatch({ type: 'SET_CARDS_LOCKED', value: false }), 2200),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [started, dispatch]);

  useEffect(() => {
    if ((enemyHealth <= 0 || playerHealth <= 0) && !gameOver) {
      dispatch({ type: 'SET_GAME_OVER', value: true });
      playDefeatSound();
    }
  }, [enemyHealth, playerHealth, gameOver, dispatch]);

  useEffect(() => {
    if (isPlayerTurn && turnCount > 1 && turnCount !== lastDrawnTurnCount.current) {
      drawCards(5);
      lastDrawnTurnCount.current = turnCount;
    }
  }, [isPlayerTurn, turnCount, drawCards]);

  return (
    <div
      className="w-full h-full p-0 overflow-hidden relative"
    >
      {/* ── PixiJS & GSAP Rendering Layer ── */}
      <PixiCanvas
        backgroundImage={backgroundImage}
        characterSprite={characterSprite}
        enemySprite={enemySprite}
        introStarted={introStarted}
        introCharPhase={introCharPhase}
        playerHit={playerHit}
        enemyHit={enemyHit}
        playerJumping={playerJumping}
        enemyJumping={enemyJumping}
        laserBeamRef={laserBeamRef}
        particlesRef={particlesRef}
        charW={charW}
        charH={charH}
        enemW={enemW}
        enemH={enemH}
        screenShake={screenShake}
        hand={hand}
        enemyHand={enemyHand}
        enemyPlayingCardId={enemyPlayingCardId}
        drawAnimKey={drawAnimKey}
        enemyDrawAnimKey={enemyDrawAnimKey}
        isDiscarding={isDiscarding}
        isEnemyDiscarding={isEnemyDiscarding}
        cardsLocked={cardsLocked}
        isPlayerTurn={isPlayerTurn}
        gameOver={gameOver}
        playerMana={playerMana}
        cardW={cardW}
        cardH={cardH}
        handSpacing={handSpacing}
        cardImages={cardImages}
      />

      {/* Top Section - Health Bars (Cyan boxes) */}
      <div className="absolute top-16 left-0 right-0 flex justify-between px-8 z-10 pointer-events-none">
        {/* ── Player HUD slide-in wrapper ── */}
        <PlayerHUD
          introStarted={introStarted}
          playerHealth={playerHealth}
          playerMana={playerMana}
          maxMana={maxMana}
          playerShield={playerShield}
          imgScrollOuter={imgScrollOuter}
          imgScrollInner={imgScrollInner}
          imgHealthIcon={imgHealthIcon}
          imgManaIcon={imgManaIcon}
        />

        {/* ── Enemy HUD slide-in wrapper ── */}
        <EnemyHUD
          introStarted={introStarted}
          enemyHealth={enemyHealth}
          enemyMana={enemyMana}
          enemyMaxMana={enemyMaxMana}
          enemyShield={enemyShield}
          imgScrollOuter={imgScrollOuter}
          imgScrollInner={imgScrollInner}
          imgHealthIcon={imgHealthIcon}
          imgManaIcon={imgManaIcon}
        />
      </div>

      {/* Middle Section - Characters (Yellow boxes) */}
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-8 z-[55]">
        {/* Player Character - Left Side */}
        <div 
          className="absolute top-1/2"
          style={{
            left: 'clamp(calc(50% - 730px), 25%, calc(50% - 430px))',
            ...(introCharPhase === 'entering'
              ? {
                  animation: 'char-slide-in-left 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both',
                  transition: 'none',
                  willChange: 'transform',
                }
              : {
                  transform: playerJumping
                    ? 'translate(400px, calc(-50% - 100px))'
                    : 'translate(0, calc(-50% - 100px))',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  willChange: 'transform',
                }),
          }}
        >
          {/* Hit reaction wrapper */}
          <div
            style={{
              animation: playerHit ? 'hit-react-player 0.7s ease-out forwards' : 'none',
              transformOrigin: 'center bottom',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {/* Player Image removed, rendered in PixiCanvas */}
              <div style={{ width: `${charW}px`, height: `${charH}px` }} />
            </div>
          </div>

          {/* ── Player Shield VFX — anchored to sprite, moves with character ── */}
          <ShieldVFX side="player" shield={playerShield} showAnim={showPlayerShieldAnim} size={pShieldSize} fontSize={pShieldFont} />
        </div>

        {/* Canvas - invisible overlay for effects */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Enemy Character - Right */}
        <div
          className="absolute top-1/2"
          style={{
            right: 'clamp(calc(50% - 730px), 25%, calc(50% - 430px))',
            ...(introCharPhase === 'entering'
              ? {
                  animation: 'char-slide-in-right 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both',
                  transition: 'none',
                  willChange: 'transform',
                }
              : {
                  transform: enemyJumping
                    ? 'translate(-320px, -50%)'
                    : 'translate(0, -50%)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  willChange: 'transform',
                }),
          }}
        >
          {/* Hit reaction wrapper */}
          <div
            style={{
              animation: enemyHit ? 'hit-react-enemy 0.7s ease-out forwards' : 'none',
              transformOrigin: 'center bottom',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {/* Enemy Image removed, rendered in PixiCanvas */}
              <div style={{ width: `${enemW}px`, height: `${enemH}px` }} />
            </div>
          </div>

          {/* ── Enemy Shield VFX — anchored to sprite, moves with character ── */}
          <ShieldVFX side="enemy" shield={enemyShield} showAnim={showEnemyShieldAnim} size={eShieldSize} fontSize={eShieldFont} />
        </div>
        
        {/* Player VFX */}
        <ClawVFX side="player" visible={showClaw} />
        <DarkBibleVFX side="player" visible={showDarkBibleVFX} />
        <TropicalFruitVFX side="player" visible={showTropicalFruitVFX} />

        {/* Enemy VFX */}
        <ClawVFX side="enemy" visible={showEnemyClaw} />
        <DarkBibleVFX side="enemy" visible={showEnemyDarkBibleVFX} />
        <TropicalFruitVFX side="enemy" visible={showEnemyTropicalFruitVFX} />

      </div>

      {/* Damage Numbers */}
      <DamageNumbers numbers={damageNumbers} />

      {/* Dark Bible — Full-screen dark overlay (covers background, HUD, cards; characters section sits above at z-[55]) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#000000',
          opacity: blackScreenOpacity,
          zIndex: 50,
          transition: 'opacity 0.1s ease-in, opacity 0.2s ease-out',
        }}
      />

      {/* Game Message Overlay — parchment scroll banner */}
      {gameMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[62] pointer-events-none">
          <GameMessageBox text={gameMessage} />
        </div>
      )}

      {/* Game Over Popup */}
      {gameOver && (
        <GameOverPopup
          isVictory={enemyHealth <= 0}
          onPlayAgain={resetGame}
        />
      )}

      {/* Tutorial Hint - Bottom Left Corner */}
      <div className="absolute bottom-11 left-14 z-[9999] pointer-events-none">
        <TutorialHint visible={!hasPlayedCard && isPlayerTurn && !gameOver} />
      </div>

      {/* End Turn Button - Bottom Right Corner */}
      <div className="absolute bottom-8 right-32 z-[9999] pointer-events-auto">
        <EndTurnButton
          onClick={endTurn}
          disabled={!isPlayerTurn || gameOver}
        />
      </div>

      {/* Bottom Section - Hand Cards (Red box) */}
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-4 z-[999] pointer-events-none" style={{ transform: 'translateY(80px)' }}>
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center items-center mb-3">
            <div style={{ width: '162px', height: '56px' }} className="pointer-events-auto">
              <PileButton label="Deck" count={deck.length} />
            </div>
            
            <div style={{ width: '162px', height: '56px' }} className="pointer-events-auto">
              <PileButton label="Discard" count={discardPile.length} />
            </div>


          </div>

          {/* Hand Cards */}
          <div className="flex justify-center items-end relative" style={{ minHeight: `${handHeight}px` }}>
            {hand.length === 0 && enemyHand.length === 0 ? (
              <div className="text-white text-sm py-8 bg-black/50 px-4 rounded">
                {isPlayerTurn && !gameOver ? "No cards. End turn to draw." : "Waiting..."}
              </div>
            ) : (
              <div className="relative flex justify-center items-end" style={{ width: '100%', height: `${handHeight}px` }}>

                {/* ── Enemy Hand Cards ──────────────────────────────────────── */}
                {enemyHand.map((card, index) => (
                  <PlayingCard
                    key={`enemy-${enemyDrawAnimKey}-${card.id}`}
                    card={card}
                    index={index}
                    totalCards={enemyHand.length}
                    side="enemy"
                    handSpacing={handSpacing}
                    cardW={cardW}
                    cardH={cardH}
                    isMobile={isMobile}
                    isPlaying={enemyPlayingCardId === card.id}
                    drawAnimKey={enemyDrawAnimKey}
                    isDiscarding={isEnemyDiscarding}
                    cardImages={cardImages}
                    visualMode="interactionOnly"
                  />
                ))}

                {/* ── Player Hand Cards ─────────────────────────────────────── */}
                {hand.map((card, index) => (
                  <PlayingCard
                    key={`${drawAnimKey}-${card.id}`}
                    card={card}
                    index={index}
                    totalCards={hand.length}
                    side="player"
                    handSpacing={handSpacing}
                    cardW={cardW}
                    cardH={cardH}
                    isMobile={isMobile}
                    drawAnimKey={drawAnimKey}
                    isDiscarding={isDiscarding}
                    cardsLocked={cardsLocked}
                    gameOver={gameOver}
                    isPlayerTurn={isPlayerTurn}
                    playerMana={playerMana}
                    cardImages={cardImages}
                    visualMode="interactionOnly"
                    onClick={() => {
                      if (!gameOver && isPlayerTurn && !isDiscarding && !cardsLocked && playerMana >= card.cost) {
                        playCard(card);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── "Ready!" intro text ── */}
      {showReadyText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 500 }}
        >
          <div style={{ animation: 'ready-slam-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
            <p
              style={{
                fontFamily: "'Averia Serif Libre', serif",
                fontSize: 'clamp(72px, 11vw, 130px)',
                fontWeight: 'bold',
                color: '#FFE566',
                WebkitTextStroke: '4px rgba(160,90,0,0.85)',
                textShadow:
                  '0 0 80px rgba(255,220,0,0.95), 0 0 30px rgba(255,160,0,0.8), 0 8px 24px rgba(0,0,0,0.9)',
                letterSpacing: '-3px',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              Ready...
            </p>
          </div>
        </div>
      )}

      {/* ── "FIGHT!" intro text ── */}
      {showFightText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 500 }}
        >
          <div style={{ animation: 'fight-slam-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
            <p
              style={{
                fontFamily: "'Averia Serif Libre', serif",
                fontSize: 'clamp(90px, 15vw, 170px)',
                fontWeight: 'bold',
                color: '#FF99F5',
                WebkitTextStroke: '5px rgba(160,20,140,0.9)',
                textShadow: '0 0 30px rgba(255,150,245,0.8), 0 10px 30px rgba(0,0,0,0.95)',
                letterSpacing: '-5px',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              FIGHT!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
