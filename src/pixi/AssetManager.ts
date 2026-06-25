import { Assets } from 'pixi.js';

// Import all assets to ensure Webpack/Vite bundles them
import characterSprite from '../assets/749653866c572d97f2ced236dc2068e4a0696656.png';
import enemySprite from '../assets/0aeea4921f1215c52fce980d72dfd5ac956ab8c8.png';
import backgroundImage from '../assets/4b5983da361572a80e256fa23d1a36a1d6870d88.png';
import defendCardImage from '../assets/efe58cfeddc4e2caa464968a47ef82ccb7cdfc9d.png';
import darkBibleCardImage from '../assets/81e9727b251609f04cc14e76990205ea284f33a5.png';
import tropicalFruitCardImage from '../assets/92304158a2f6897f7235abf61a458ec1760fcccd.png';
import shootCardImage from '../assets/ee45a398de21ea3fe00cc1ebdace203bac2577a4.png';
import imgScrollOuter from '../assets/6fb0d23ec1ac4791fe50e9d82f4025181e14cf42.png';
import imgScrollInner from '../assets/0bd2914d7eb4b34ea587e81e81e324f6fb73d43f.png';
import imgHealthIcon from '../assets/4f13b5b961df123ad8b98b2056cebdd3a29cda5c.png';
import imgManaIcon from '../assets/99de9a5f07d5bd023847249ac048447372bf5fd3.png';

// VFX
import shieldVFX from '../assets/55ad35d9e26679621ee5b8e521ad0e6e7e8fa519.png';
import darkBibleVFX from '../assets/5fbc0f11aa5c01e6fdfb69d1d54a67b3c77f685b.png';
import tropicalFruitVFX from '../assets/16ae7de0ac39276127ed83f0300bf4c696c12d39.png';
import clawImage from '../assets/fc32814c502d8b4264f72d196818696a277c38d8.png';
import sakuraImg from '../assets/27ac8d110de23706e36cd3626314ac81d83e55da.png';
import doorImage from '../assets/8492b939d4f74a004d8640bdd5c338e0e6a52376.png';
import parchment from '../assets/1585093dc9956998910d206579a047fd9d61bc13.png';
import cover from '../assets/59a11dc60eec257b7096f1a596799764c77372a9.png';

export const ASSET_MAP = {
  player: characterSprite,
  enemy: enemySprite,
  bg: backgroundImage,
  card_defend: defendCardImage,
  card_darkBible: darkBibleCardImage,
  card_tropicalFruit: tropicalFruitCardImage,
  card_shoot: shootCardImage,
  scrollOuter: imgScrollOuter,
  scrollInner: imgScrollInner,
  healthIcon: imgHealthIcon,
  manaIcon: imgManaIcon,
  shieldVFX: shieldVFX,
  darkBibleVFX: darkBibleVFX,
  tropicalFruitVFX: tropicalFruitVFX,
  clawVFX: clawImage,
  sakura: sakuraImg,
  door: doorImage,
  parchment: parchment,
  cover: cover
};

export async function loadPixiAssets() {
  const loadPromises = Object.entries(ASSET_MAP).map(([alias, src]) => {
    return Assets.load({ alias, src: src.src || src });
  });
  await Promise.all(loadPromises);
}
