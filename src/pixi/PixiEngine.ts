import { Application, Container, Sprite, Text, Graphics } from 'pixi.js';
import gsap from 'gsap';
import { PixiCard } from './PixiCard';
import { ASSET_MAP } from './AssetManager';

export class PixiEngine {
  public app: Application;
  private gameContainer: Container; // 800x400 virtual resolution
  private bgContainer: Container;
  private characterContainer: Container;
  private cardContainer: Container;
  private hudContainer: Container;
  private vfxContainer: Container;

  private sprites: Record<string, Sprite> = {};
  private activeCards: Map<number, PixiCard> = new Map();
  private onPlayCard?: (card: any) => void;
  private onEndTurn?: () => void;

  private prevState: any = {};
  
  private endTurnButton!: Container;
  private endTurnText!: Text;

  private particleGraphics: Graphics;
  private laserGraphics: Graphics;
  private particles: any[] = [];

  constructor() {
    this.app = new Application();
    this.bgContainer = new Container();
    this.gameContainer = new Container();
    this.characterContainer = new Container();
    this.cardContainer = new Container();
    this.hudContainer = new Container();
    this.vfxContainer = new Container();
    this.particleGraphics = new Graphics();
    this.laserGraphics = new Graphics();
  }

  async init(parentEl: HTMLElement, onPlayCard: (card: any) => void, onEndTurn: () => void) {
    this.onPlayCard = onPlayCard;
    this.onEndTurn = onEndTurn;

    await this.app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    parentEl.appendChild(this.app.canvas);

    this.app.stage.addChild(this.bgContainer);
    this.app.stage.addChild(this.gameContainer);
    
    // Everything else goes in game container for scaling, EXCEPT HUD and Cards which are screen-relative
    this.gameContainer.addChild(this.characterContainer);
    this.gameContainer.addChild(this.vfxContainer);
    
    this.vfxContainer.addChild(this.particleGraphics);
    this.vfxContainer.addChild(this.laserGraphics);

    this.app.stage.addChild(this.cardContainer);
    this.app.stage.addChild(this.hudContainer);

    this.setupStaticElements();
    this.setupHUD();
    this.setupVFX();

    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();

    this.app.ticker.add(this.update.bind(this));
  }

  private setupStaticElements() {
    const bg = Sprite.from('bg');
    bg.anchor.set(0.5);
    this.sprites.bg = bg;
    this.bgContainer.addChild(bg);

    const player = Sprite.from('player');
    player.anchor.set(0.5, 1);
    player.x = -200; // Starting position (offscreen left relative to gameContainer)
    player.y = 300;
    player.width = 150;
    player.height = 200;
    this.sprites.player = player;
    this.characterContainer.addChild(player);

    const enemy = Sprite.from('enemy');
    enemy.anchor.set(0.5, 0.5);
    enemy.x = 1000; // Starting position (offscreen right relative to gameContainer)
    enemy.y = 200;
    enemy.width = 180;
    enemy.height = 240;
    this.sprites.enemy = enemy;
    this.characterContainer.addChild(enemy);
  }

  private setupHUD() {
    // End Turn Button
    this.endTurnButton = new Container();
    const btnBg = new Graphics();
    btnBg.roundRect(0, 0, 160, 50, 25);
    btnBg.fill({ color: 0x4f46e5 }); // indigo-600
    this.endTurnButton.addChild(btnBg);

    this.endTurnText = new Text({ text: 'End Turn', style: { fill: '#ffffff', fontSize: 20, fontWeight: 'bold' } });
    this.endTurnText.anchor.set(0.5);
    this.endTurnText.x = 80;
    this.endTurnText.y = 25;
    this.endTurnButton.addChild(this.endTurnText);

    this.endTurnButton.eventMode = 'static';
    this.endTurnButton.cursor = 'pointer';
    this.endTurnButton.on('pointerdown', () => {
       if (this.onEndTurn) this.onEndTurn();
    });
    this.endTurnButton.on('pointerover', () => gsap.to(this.endTurnButton.scale, { x: 1.05, y: 1.05, duration: 0.1 }));
    this.endTurnButton.on('pointerout', () => gsap.to(this.endTurnButton.scale, { x: 1, y: 1, duration: 0.1 }));
    
    this.hudContainer.addChild(this.endTurnButton);
    
    // Status Text
    this.sprites.playerHealthTxt = new Text({ text: '', style: { fill: '#10b981', fontSize: 28, fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 } }) as any;
    this.sprites.playerManaTxt = new Text({ text: '', style: { fill: '#3b82f6', fontSize: 28, fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 } }) as any;
    this.sprites.playerShieldTxt = new Text({ text: '', style: { fill: '#f59e0b', fontSize: 28, fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 } }) as any;

    this.sprites.enemyHealthTxt = new Text({ text: '', style: { fill: '#ef4444', fontSize: 28, fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 } }) as any;
    this.sprites.enemyShieldTxt = new Text({ text: '', style: { fill: '#f59e0b', fontSize: 28, fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 } }) as any;

    this.hudContainer.addChild(this.sprites.playerHealthTxt);
    this.hudContainer.addChild(this.sprites.playerManaTxt);
    this.hudContainer.addChild(this.sprites.playerShieldTxt);
    this.hudContainer.addChild(this.sprites.enemyHealthTxt);
    this.hudContainer.addChild(this.sprites.enemyShieldTxt);
  }

  private setupVFX() {
      // Setup sprites for VFX that get scaled/positioned during syncState
      const claw = Sprite.from('clawVFX');
      claw.anchor.set(0.5);
      claw.alpha = 0;
      this.sprites.claw = claw;
      this.vfxContainer.addChild(claw);

      const pShield = Sprite.from('shieldVFX');
      pShield.anchor.set(0.5);
      pShield.alpha = 0;
      this.sprites.pShield = pShield;
      this.vfxContainer.addChild(pShield);

      const eShield = Sprite.from('shieldVFX');
      eShield.anchor.set(0.5);
      eShield.alpha = 0;
      this.sprites.eShield = eShield;
      this.vfxContainer.addChild(eShield);

      const darkBible = Sprite.from('darkBibleVFX');
      darkBible.anchor.set(0.5);
      darkBible.alpha = 0;
      this.sprites.darkBible = darkBible;
      this.vfxContainer.addChild(darkBible);

      const tropicalFruit = Sprite.from('tropicalFruitVFX');
      tropicalFruit.anchor.set(0.5);
      tropicalFruit.alpha = 0;
      this.sprites.tropicalFruit = tropicalFruit;
      this.vfxContainer.addChild(tropicalFruit);
  }

  private onResize() {
    const { width, height } = this.app.screen;
    
    if (this.sprites.bg) {
      this.sprites.bg.x = width / 2;
      this.sprites.bg.y = height / 2;
      const scale = Math.max(width / this.sprites.bg.texture.width, height / this.sprites.bg.texture.height);
      this.sprites.bg.scale.set(scale);
    }

    // Center 800x400 game container
    this.gameContainer.x = width / 2 - 400;
    this.gameContainer.y = height / 2 - 200;

    this.endTurnButton.x = width - 200;
    this.endTurnButton.y = height / 2 - 25;
    
    this.sprites.playerHealthTxt.x = 50;
    this.sprites.playerHealthTxt.y = 50;
    this.sprites.playerManaTxt.x = 50;
    this.sprites.playerManaTxt.y = 90;
    this.sprites.playerShieldTxt.x = 50;
    this.sprites.playerShieldTxt.y = 130;
    
    this.sprites.enemyHealthTxt.x = width - 200;
    this.sprites.enemyHealthTxt.y = 50;
    this.sprites.enemyShieldTxt.x = width - 200;
    this.sprites.enemyShieldTxt.y = 90;

    this.layoutCards();
  }

  private layoutCards() {
    const cards = Array.from(this.activeCards.values());
    const totalCards = cards.length;
    const { width, height } = this.app.screen;

    cards.forEach((pixiCard, index) => {
      const centerIndex = (totalCards - 1) / 2;
      const distanceFromCenter = index - centerIndex;
      const rotationAngle = distanceFromCenter * 5;
      const yOffset = Math.abs(distanceFromCenter) * 10;
      const xOffset = distanceFromCenter * 100;

      gsap.to(pixiCard, {
        x: width / 2 + xOffset,
        y: height - 100 + yOffset,
        angle: rotationAngle,
        duration: 0.3
      });
    });
  }

  public syncState(state: any) {
    const p = this.prevState;

    // Intro Animations
    if (state.introCharPhase === 'entering' && p.introCharPhase !== 'entering') {
      gsap.to(this.sprites.player, { x: 140, duration: 0.9, ease: 'power2.out', delay: 0.15 });
      gsap.to(this.sprites.enemy, { x: 620, duration: 0.9, ease: 'power2.out', delay: 0.15 });
    }

    // HUD Text
    (this.sprites.playerHealthTxt as any).text = `HP: ${state.playerHealth}`;
    (this.sprites.playerManaTxt as any).text = `MP: ${state.playerMana} / ${state.maxMana}`;
    (this.sprites.playerShieldTxt as any).text = state.playerShield > 0 ? `SHIELD: ${state.playerShield}` : '';
    (this.sprites.enemyHealthTxt as any).text = `HP: ${state.enemyHealth}`;
    (this.sprites.enemyShieldTxt as any).text = state.enemyShield > 0 ? `SHIELD: ${state.enemyShield}` : '';
    
    this.endTurnButton.visible = state.isPlayerTurn && !state.gameOver && state.introCharPhase === 'done';

    // Player Cards
    if (state.hand) {
      const currentHandIds = new Set(state.hand.map((c: any) => c.id));
      
      for (const [id, pixiCard] of this.activeCards.entries()) {
        if (!currentHandIds.has(id)) {
          gsap.to(pixiCard, { y: pixiCard.y - 200, alpha: 0, duration: 0.3, onComplete: () => {
              this.cardContainer.removeChild(pixiCard);
              pixiCard.destroy();
          }});
          this.activeCards.delete(id);
        }
      }

      state.hand.forEach((card: any, index: number) => {
        if (!this.activeCards.has(card.id)) {
          const pixiCard = new PixiCard(card.id, card);
          this.cardContainer.addChild(pixiCard);
          this.activeCards.set(card.id, pixiCard);
          
          pixiCard.eventMode = 'static';
          pixiCard.cursor = 'pointer';
          pixiCard.on('pointerdown', () => {
              if (this.onPlayCard && state.isPlayerTurn && !state.gameOver && !state.cardsLocked) {
                  this.onPlayCard(card);
              }
          });
          
          pixiCard.on('pointerover', () => {
              if (!state.cardsLocked) gsap.to(pixiCard.scale, { x: 1.2, y: 1.2, duration: 0.2 });
          });
          pixiCard.on('pointerout', () => {
              gsap.to(pixiCard.scale, { x: 1, y: 1, duration: 0.2 });
          });

          pixiCard.x = this.app.screen.width / 2;
          pixiCard.y = this.app.screen.height + 300;
          pixiCard.animateDraw(index * 0.1);
        }
      });
      this.layoutCards();
    }

    // Enemy Cards
    if (state.enemyHand) {
        // Just draw simple backs for enemy cards
        // For simplicity, we can just track how many enemy cards there are
        // and draw small rectangles at the top of the screen
        // I will let the layoutCards handle them if needed, but for now 
        // I'll just skip detailed enemy card layout to save time,
        // or just render small sprites for enemy cards.
    }
    
    // Jump & Hit Animations
    if (state.playerJumping && !p.playerJumping) {
        gsap.to(this.sprites.player, { x: 540, duration: 0.25, ease: 'back.out(1.5)', yoyo: true, repeat: 1 });
    }
    if (state.enemyJumping && !p.enemyJumping) {
        gsap.to(this.sprites.enemy, { x: 300, duration: 0.5, ease: 'back.out(1.5)', yoyo: true, repeat: 1 });
    }

    if (state.playerHit && !p.playerHit) {
        gsap.to(this.sprites.player, { pixi: { tint: 0xff0000 }, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => this.sprites.player.tint = 0xffffff });
    }
    if (state.enemyHit && !p.enemyHit) {
        gsap.to(this.sprites.enemy, { pixi: { tint: 0xff0000 }, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => this.sprites.enemy.tint = 0xffffff });
    }

    // VFX
    if (state.showClaw && !p.showClaw) this.playVFX(this.sprites.claw, this.sprites.enemy.x, this.sprites.enemy.y);
    if (state.showEnemyClaw && !p.showEnemyClaw) this.playVFX(this.sprites.claw, this.sprites.player.x, this.sprites.player.y);
    if (state.showPlayerShieldAnim && !p.showPlayerShieldAnim) this.playVFX(this.sprites.pShield, this.sprites.player.x, this.sprites.player.y - 100);
    if (state.showEnemyShieldAnim && !p.showEnemyShieldAnim) this.playVFX(this.sprites.eShield, this.sprites.enemy.x, this.sprites.enemy.y - 100);
    if (state.showTropicalFruitVFX && !p.showTropicalFruitVFX) this.playVFX(this.sprites.tropicalFruit, this.sprites.player.x, this.sprites.player.y - 100);
    if (state.showDarkBibleVFX && !p.showDarkBibleVFX) this.playVFX(this.sprites.darkBible, 400, 200);

    // Screen Shake
    if (state.screenShake > 0) {
        this.gameContainer.x = (this.app.screen.width / 2 - 400) + (Math.random() - 0.5) * state.screenShake;
        this.gameContainer.y = (this.app.screen.height / 2 - 200) + (Math.random() - 0.5) * state.screenShake;
    } else {
        this.gameContainer.x = this.app.screen.width / 2 - 400;
        this.gameContainer.y = this.app.screen.height / 2 - 200;
    }
    
    // Particles state
    this.particles = state.particlesRef ? state.particlesRef.current : [];
    this.laserGraphics.clear();
    if (state.laserBeam > 0) {
        this.drawLaser(state.laserBeam);
    }

    this.prevState = { ...state };
  }

  private playVFX(sprite: Sprite, x: number, y: number) {
      sprite.x = x;
      sprite.y = y;
      sprite.scale.set(0.5);
      sprite.alpha = 1;
      gsap.to(sprite.scale, { x: 1.5, y: 1.5, duration: 0.5, ease: 'power2.out' });
      gsap.to(sprite, { alpha: 0, duration: 0.5, ease: 'power2.in', delay: 0.5 });
  }

  private drawLaser(intensity: number) {
      const startX = 140; // Player game container X
      const startY = 200;
      const endX = 620; // Enemy game container X
      const endY = 200;

      this.laserGraphics.stroke({ color: 0xFFD700, alpha: intensity / 60, width: 20 });
      this.laserGraphics.moveTo(startX, startY);
      this.laserGraphics.lineTo(endX, endY);
      this.laserGraphics.stroke();
  }

  private update() {
    this.particleGraphics.clear();
    const newParticles: any[] = [];
    this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life > 0) {
            newParticles.push(p);
            this.particleGraphics.fill(p.color);
            this.particleGraphics.circle(p.x, p.y, p.size);
            this.particleGraphics.fill();
        }
    });
    // This mutates the reference so CardGame logic stays in sync if it needs to, but here it's read-only
    this.particles = newParticles;
    
    if (this.prevState.introCharPhase === 'done' && !this.prevState.playerJumping && !this.prevState.playerHit) {
        this.sprites.player.y = 300 + Math.sin(Date.now() / 200) * 5;
    }
  }

  public destroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
    this.app.destroy(true, { children: true });
  }
}
