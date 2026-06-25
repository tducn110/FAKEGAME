import React, { useEffect, useRef } from 'react';
import { Application, Assets, Sprite, Container, Text, TextStyle, Graphics } from 'pixi.js';

// Assets
import characterSprite from 'figma:asset/749653866c572d97f2ced236dc2068e4a0696656.png';
import enemySprite from 'figma:asset/0aeea4921f1215c52fce980d72dfd5ac956ab8c8.png';
import backgroundImage from 'figma:asset/4b5983da361572a80e256fa23d1a36a1d6870d88.png';
import defendCardImage from 'figma:asset/efe58cfeddc4e2caa464968a47ef82ccb7cdfc9d.png';
import darkBibleCardImage from 'figma:asset/81e9727b251609f04cc14e76990205ea284f33a5.png';
import tropicalFruitCardImage from 'figma:asset/92304158a2f6897f7235abf61a458ec1760fcccd.png';
import shootCardImage from 'figma:asset/ee45a398de21ea3fe00cc1ebdace203bac2577a4.png';
import imgScrollOuter from "figma:asset/6fb0d23ec1ac4791fe50e9d82f4025181e14cf42.png";
import imgScrollInner from "figma:asset/0bd2914d7eb4b34ea587e81e81e324f6fb73d43f.png";
import imgHealthIcon from "figma:asset/4f13b5b961df123ad8b98b2056cebdd3a29cda5c.png";
import imgManaIcon from "figma:asset/99de9a5f07d5bd023847249ac048447372bf5fd3.png";

export default function PixiGameRenderer({ state, dispatch, playCard }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let app: Application;
    
    const init = async () => {
      app = new Application();
      await app.init({
        canvas: canvasRef.current!,
        resizeTo: window,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      // Load all assets
      await Assets.load([
        { alias: 'bg', src: backgroundImage },
        { alias: 'player', src: characterSprite },
        { alias: 'enemy', src: enemySprite },
        { alias: 'defend', src: defendCardImage },
        { alias: 'darkBible', src: darkBibleCardImage },
        { alias: 'tropicalFruit', src: tropicalFruitCardImage },
        { alias: 'shoot', src: shootCardImage },
        { alias: 'scrollOuter', src: imgScrollOuter },
        { alias: 'scrollInner', src: imgScrollInner },
        { alias: 'health', src: imgHealthIcon },
        { alias: 'mana', src: imgManaIcon },
      ]);

      const bg = Sprite.from('bg');
      bg.anchor.set(0.5);
      bg.x = app.screen.width / 2;
      bg.y = app.screen.height / 2;
      // scale to cover
      const scale = Math.max(app.screen.width / bg.texture.width, app.screen.height / bg.texture.height);
      bg.scale.set(scale);
      app.stage.addChild(bg);

      // Render cards
      // This is a placeholder for the logic
    };

    init();

    return () => {
      if (app) app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }} />;
}
