import React, { useCallback, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import type { Card } from '../../game/types';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

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

interface PixiCanvasProps {
  backgroundImage: string;
  characterSprite: string;
  enemySprite: string;
  introStarted: boolean;
  introCharPhase: 'waiting' | 'entering' | 'done';
  playerHit: boolean;
  enemyHit: boolean;
  playerJumping: boolean;
  enemyJumping: boolean;
  laserBeamRef: React.MutableRefObject<number>;
  particlesRef: React.MutableRefObject<Particle[]>;
  charW: number;
  charH: number;
  enemW: number;
  enemH: number;
  screenShake: number;
  hand: Card[];
  enemyHand: Card[];
  enemyPlayingCardId: number | null;
  drawAnimKey: number;
  enemyDrawAnimKey: number;
  isDiscarding: boolean;
  isEnemyDiscarding: boolean;
  cardsLocked: boolean;
  isPlayerTurn: boolean;
  gameOver: boolean;
  playerMana: number;
  cardW: number;
  cardH: number;
  handSpacing: number;
  cardImages: Record<string, string>;
}

type PixiCardSide = 'player' | 'enemy';

interface PixiCardSprite {
  node: PIXI.Container;
  art: PIXI.Sprite;
  shade: PIXI.Graphics;
  glow: PIXI.Graphics;
  side: PixiCardSide;
}

export const PixiCanvas = React.memo(({
  backgroundImage,
  characterSprite,
  enemySprite,
  introStarted,
  introCharPhase,
  playerHit,
  enemyHit,
  playerJumping,
  enemyJumping,
  laserBeamRef,
  particlesRef,
  charW,
  charH,
  enemW,
  enemH,
  screenShake,
  hand,
  enemyHand,
  enemyPlayingCardId,
  drawAnimKey,
  enemyDrawAnimKey,
  isDiscarding,
  isEnemyDiscarding,
  cardsLocked,
  isPlayerTurn,
  gameOver,
  playerMana,
  cardW,
  cardH,
  handSpacing,
  cardImages
}: PixiCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const bgSpriteRef = useRef<PIXI.Sprite | null>(null);
  const playerSpriteRef = useRef<PIXI.Sprite | null>(null);
  const enemySpriteRef = useRef<PIXI.Sprite | null>(null);
  const gsapRef = useRef<boolean>(false);
  
  // Game Container (800x400 virtual resolution centered)
  const gameContainerRef = useRef<PIXI.Container | null>(null);
  const cardContainerRef = useRef<PIXI.Container | null>(null);
  const pixiCardsRef = useRef<Map<string, PixiCardSprite>>(new Map());
  const cardTexturesRef = useRef<Record<string, PIXI.Texture>>({});
  const motionRef = useRef({ screenShake, introCharPhase, playerJumping, playerHit });

  useEffect(() => {
    motionRef.current = { screenShake, introCharPhase, playerJumping, playerHit };
  }, [introCharPhase, playerHit, playerJumping, screenShake]);

  const getCardTexture = useCallback((card: Card) => {
    return cardTexturesRef.current[card.name] || cardTexturesRef.current.Defend || PIXI.Texture.WHITE;
  }, []);

  const drawCardOverlay = useCallback((
    cardSprite: PixiCardSprite,
    card: Card,
    isPlaying: boolean,
    tooExpensive: boolean,
  ) => {
    cardSprite.shade.clear();
    cardSprite.glow.clear();

    if (cardSprite.side === 'enemy') {
      cardSprite.shade
        .roundRect(-cardW / 2, -cardH, cardW, cardH, 8)
        .fill({ color: 0x5a1010, alpha: isPlaying ? 0.08 : 0.24 });
    }

    if (tooExpensive || cardsLocked || gameOver || !isPlayerTurn) {
      cardSprite.shade
        .roundRect(-cardW / 2, -cardH, cardW, cardH, 8)
        .fill({ color: 0x000000, alpha: tooExpensive ? 0.28 : 0.2 });
    }

    if (isPlaying) {
      cardSprite.glow
        .roundRect(-cardW / 2 - 7, -cardH - 7, cardW + 14, cardH + 14, 12)
        .stroke({ color: 0xffdf55, alpha: 0.9, width: 5 });
    } else if (card.type === 'attack') {
      cardSprite.glow
        .roundRect(-cardW / 2 - 3, -cardH - 3, cardW + 6, cardH + 6, 10)
        .stroke({ color: 0xff5a5a, alpha: 0.38, width: 3 });
    } else if (card.name === 'Defend') {
      cardSprite.glow
        .roundRect(-cardW / 2 - 3, -cardH - 3, cardW + 6, cardH + 6, 10)
        .stroke({ color: 0x7dc7ff, alpha: 0.38, width: 3 });
    }
  }, [cardH, cardW, cardsLocked, gameOver, isPlayerTurn]);

  const makePixiCard = useCallback((key: string, card: Card, side: PixiCardSide) => {
    const node = new PIXI.Container({ label: key });
    node.eventMode = 'none';
    node.alpha = 0;

    const art = new PIXI.Sprite(getCardTexture(card));
    art.anchor.set(0.5, 1);
    art.width = cardW;
    art.height = cardH;

    const shade = new PIXI.Graphics();
    const glow = new PIXI.Graphics();
    node.addChild(art, shade, glow);

    const cardSprite: PixiCardSprite = { node, art, shade, glow, side };
    cardContainerRef.current?.addChild(node);
    pixiCardsRef.current.set(key, cardSprite);
    gsap.to(node, { alpha: 1, duration: 0.28, ease: 'power2.out' });
    return cardSprite;
  }, [cardH, cardW, getCardTexture]);

  const layoutPixiCards = useCallback(() => {
    const app = appRef.current;
    const cardLayer = cardContainerRef.current;
    if (!app || !cardLayer) return;

    cardLayer.sortableChildren = true;

    const layoutSide = (cards: Card[], side: PixiCardSide) => {
      const totalCards = cards.length;
      const centerIndex = (totalCards - 1) / 2;

      cards.forEach((card, index) => {
        const key = `${side}-${card.id}`;
        const cardSprite = pixiCardsRef.current.get(key) || makePixiCard(key, card, side);
        const distanceFromCenter = index - centerIndex;
        const normalizedDistance = Math.abs(distanceFromCenter / Math.max(centerIndex, 1));
        const yOffset = 40 - (normalizedDistance * normalizedDistance * 40);
        const isPlaying = side === 'enemy' && enemyPlayingCardId === card.id;
        const tooExpensive = side === 'player' && playerMana < card.cost;

        cardSprite.art.texture = getCardTexture(card);
        cardSprite.art.width = cardW;
        cardSprite.art.height = cardH;
        cardSprite.node.zIndex = (isPlaying ? 500 : 100) + index + (side === 'enemy' ? 40 : 0);
        drawCardOverlay(cardSprite, card, isPlaying, tooExpensive);

        const target = {
          x: app.screen.width / 2 + distanceFromCenter * handSpacing,
          y: app.screen.height + 80 - yOffset - (isPlaying ? 68 : 0),
          angle: distanceFromCenter * 8,
          alpha: isDiscarding && side === 'player' ? 0.25 : isEnemyDiscarding && side === 'enemy' ? 0.25 : 1,
        };

        gsap.to(cardSprite.node, {
          x: target.x,
          y: target.y,
          angle: target.angle,
          alpha: target.alpha,
          duration: 0.26,
          ease: 'power2.out',
        });
        gsap.to(cardSprite.node.scale, {
          x: isPlaying ? 1.13 : 1,
          y: isPlaying ? 1.13 : 1,
          duration: 0.22,
          ease: 'power2.out',
        });
      });
    };

    layoutSide(enemyHand, 'enemy');
    layoutSide(hand, 'player');

    const liveKeys = new Set([
      ...hand.map((card) => `player-${card.id}`),
      ...enemyHand.map((card) => `enemy-${card.id}`),
    ]);

    for (const [key, cardSprite] of pixiCardsRef.current.entries()) {
      if (!liveKeys.has(key)) {
        pixiCardsRef.current.delete(key);
        gsap.to(cardSprite.node, {
          y: cardSprite.node.y + 180,
          alpha: 0,
          duration: 0.24,
          ease: 'power2.in',
          onComplete: () => cardSprite.node.destroy({ children: true }),
        });
      }
    }
  }, [
    cardH,
    cardW,
    drawCardOverlay,
    enemyHand,
    enemyPlayingCardId,
    getCardTexture,
    hand,
    handSpacing,
    isDiscarding,
    isEnemyDiscarding,
    makePixiCard,
    playerMana,
  ]);
  const layoutPixiCardsRef = useRef(layoutPixiCards);

  useEffect(() => {
    layoutPixiCardsRef.current = layoutPixiCards;
    layoutPixiCards();
  }, [layoutPixiCards]);

  useEffect(() => {
    let app: PIXI.Application;
    let isDestroyed = false;

    const initPixi = async () => {
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: window
      });

      if (isDestroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
      }

      // Load textures
      const cardTextureEntries = await Promise.all(
        Object.entries(cardImages).map(async ([name, src]) => {
          const texture = await PIXI.Assets.load(src);
          return [name, texture] as const;
        })
      );
      cardTexturesRef.current = Object.fromEntries(cardTextureEntries);

      const [bgTex, playerTex, enemyTex] = await Promise.all([
        PIXI.Assets.load(backgroundImage),
        PIXI.Assets.load(characterSprite),
        PIXI.Assets.load(enemySprite)
      ]);

      if (isDestroyed) return;

      // --- Background ---
      const bgSprite = new PIXI.Sprite(bgTex);
      bgSprite.anchor.set(0.5);
      app.stage.addChild(bgSprite);
      bgSpriteRef.current = bgSprite;

      // --- Game Container (800x400) ---
      const gameContainer = new PIXI.Container();
      app.stage.addChild(gameContainer);
      gameContainerRef.current = gameContainer;

      const cardContainer = new PIXI.Container({ label: 'pixi-card-layer', sortableChildren: true });
      app.stage.addChild(cardContainer);
      cardContainerRef.current = cardContainer;

      // --- Player Sprite ---
      const pSprite = new PIXI.Sprite(playerTex);
      pSprite.anchor.set(0.5, 1); // center bottom anchor
      pSprite.width = charW;
      pSprite.height = charH;
      // Starting position (offscreen left)
      pSprite.x = -charW;
      pSprite.y = 300; // relative to 800x400 game container
      gameContainer.addChild(pSprite);
      playerSpriteRef.current = pSprite;

      // --- Enemy Sprite ---
      const eSprite = new PIXI.Sprite(enemyTex);
      eSprite.anchor.set(0.5, 0.5); // center anchor
      eSprite.width = enemW;
      eSprite.height = enemH;
      // Starting position (offscreen right)
      eSprite.x = 800 + enemW;
      eSprite.y = 200; // relative to 800x400 game container
      gameContainer.addChild(eSprite);
      enemySpriteRef.current = eSprite;

      // --- Particles & Effects Graphics ---
      const g = new PIXI.Graphics();
      gameContainer.addChild(g);

      // --- Ticker ---
      let frameCount = 0;
      app.ticker.add(() => {
        frameCount++;

        // Handle resizing/centering
        bgSprite.x = app.screen.width / 2;
        bgSprite.y = app.screen.height / 2;
        const scale = Math.max(
          app.screen.width / bgSprite.texture.width,
          app.screen.height / bgSprite.texture.height
        );
        bgSprite.scale.set(scale);

        // Center game container
        gameContainer.x = app.screen.width / 2 - 400;
        gameContainer.y = app.screen.height / 2 - 200;

        const motion = motionRef.current;

        layoutPixiCardsRef.current();

        // Idle floating animation for player (if entered and not jumping/hit)
        if (motion.introCharPhase === 'done' && !motion.playerJumping && !motion.playerHit && pSprite) {
          pSprite.y = 300 + Math.sin(frameCount / 8) * 3;
        }

        // Draw particles & lasers
        g.clear();
        
        const newParticles: Particle[] = [];
        particlesRef.current.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 1;

          if (particle.life > 0) {
            newParticles.push(particle);
          }

          if (particle.type === 'heal') {
            g.fill(particle.color);
            const size = particle.size * 2;
            g.rect(particle.x - size / 4, particle.y - size, size / 2, size * 2);
            g.rect(particle.x - size, particle.y - size / 4, size * 2, size / 2);
            g.fill();
          } else {
            g.fill(particle.color);
            g.circle(particle.x, particle.y, particle.size);
            g.fill();
          }
        });
        particlesRef.current = newParticles;

        const currentLaser = laserBeamRef.current;
        if (currentLaser > 0) {
          const startX = 180;
          const startY = 200;
          const endX = 620;
          const endY = 200;

          g.stroke({ color: 0xFFD700, alpha: currentLaser / 60, width: 20 });
          g.moveTo(startX, startY);
          g.lineTo(endX, endY);
          g.stroke();

          g.stroke({ color: 0xFFA500, alpha: currentLaser / 40, width: 12 });
          g.moveTo(startX, startY);
          g.lineTo(endX, endY);
          g.stroke();

          g.stroke({ color: 0xFFFFFF, alpha: currentLaser / 30, width: 6 });
          g.moveTo(startX, startY);
          g.lineTo(endX, endY);
          g.stroke();
        }
      });
    };

    initPixi();

    return () => {
      isDestroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []); // Run once

  // --- Background Intro Animation ---
  useEffect(() => {
    if (introStarted && bgSpriteRef.current) {
      // bg-zoom-in: scale 1.5 -> 1.0 over 1.3s
      gsap.fromTo(bgSpriteRef.current.scale, 
        { x: 1.5, y: 1.5 },
        { x: 1, y: 1, duration: 1.3, ease: "power2.out" }
      );
    }
  }, [introStarted]);

  // --- Character Intro Animation ---
  useEffect(() => {
    if (introCharPhase === 'entering') {
      if (playerSpriteRef.current) {
        // char-slide-in-left
        gsap.to(playerSpriteRef.current, {
          x: 140, // Target X in game container
          duration: 0.9,
          ease: "power2.out",
          delay: 0.15
        });
      }
      if (enemySpriteRef.current) {
        // char-slide-in-right
        gsap.to(enemySpriteRef.current, {
          x: 620, // Target X in game container
          duration: 0.9,
          ease: "power2.out",
          delay: 0.15
        });
      }
    }
  }, [introCharPhase]);

  // --- Player Jump ---
  useEffect(() => {
    if (playerSpriteRef.current && introCharPhase === 'done') {
      if (playerJumping) {
        gsap.to(playerSpriteRef.current, {
          x: 540, // 140 + 400
          duration: 0.25,
          ease: "back.out(1.5)"
        });
      } else {
        gsap.to(playerSpriteRef.current, {
          x: 140,
          duration: 0.25,
          ease: "power2.out"
        });
      }
    }
  }, [playerJumping, introCharPhase]);

  // --- Enemy Jump ---
  useEffect(() => {
    if (enemySpriteRef.current && introCharPhase === 'done') {
      if (enemyJumping) {
        gsap.to(enemySpriteRef.current, {
          x: 300, // 620 - 320
          duration: 0.5,
          ease: "back.out(1.5)"
        });
      } else {
        gsap.to(enemySpriteRef.current, {
          x: 620,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }
  }, [enemyJumping, introCharPhase]);

  // --- Hit Animations ---
  useEffect(() => {
    if (playerSpriteRef.current && introCharPhase === 'done') {
      if (playerHit) {
        gsap.to(playerSpriteRef.current, {
          pixi: { tint: 0xff0000 },
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            gsap.to(playerSpriteRef.current, { pixi: { tint: 0xffffff }, duration: 0.1 });
          }
        });
      }
    }
  }, [playerHit, introCharPhase]);

  useEffect(() => {
    if (enemySpriteRef.current && introCharPhase === 'done') {
      if (enemyHit) {
        gsap.to(enemySpriteRef.current, {
          pixi: { tint: 0xff0000 },
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            gsap.to(enemySpriteRef.current, { pixi: { tint: 0xffffff }, duration: 0.1 });
          }
        });
      }
    }
  }, [enemyHit, introCharPhase]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
});
