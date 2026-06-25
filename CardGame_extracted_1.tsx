Created At: 2026-06-24T08:48:04Z
Completed At: 2026-06-24T08:48:04Z
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/DamageNumbers.tsx","LineNumber":1,"LineContent":"import type { DamageNumber as DamageNumberType } from '../../game/types';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/ShieldVFX.tsx","LineNumber":1,"LineContent":"import shieldVFX from 'figma:asset/55ad35d9e26679621ee5b8e521ad0e6e7e8fa519.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/DarkBibleVFX.tsx","LineNumber":1,"LineContent":"import ImageVFX from './ImageVFX';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/DarkBibleVFX.tsx","LineNumber":2,"LineContent":"import darkBibleVFX from 'figma:asset/5fbc0f11aa5c01e6fdfb69d1d54a67b3c77f685b.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/TropicalFruitVFX.tsx","LineNumber":1,"LineContent":"import PlusSign from './PlusSign';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/TropicalFruitVFX.tsx","LineNumber":2,"LineContent":"import tropicalFruitVFX from 'figma:asset/16ae7de0ac39276127ed83f0300bf4c696c12d39.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/ClawVFX.tsx","LineNumber":1,"LineContent":"import ImageVFX from './ImageVFX';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/components/vfx/ClawVFX.tsx","LineNumber":2,"LineContent":"import clawImage from 'figma:asset/fc32814c502d8b4264f72d196818696a277c38d8.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/App.tsx","LineNumber":1,"LineContent":"import React, { useState, useEffect } from 'react';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/App.tsx","LineNumber":2,"LineContent":"import { CardGame } from './components/CardGame';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/App.tsx","LineNumber":3,"LineContent":"import PreScreen from './components/PreScreen';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/App.tsx","LineNumber":4,"LineContent":"import SakuraFall from './components/SakuraFall';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/SakuraFall.tsx","LineNumber":1,"LineContent":"import React, { useEffect, useState, useRef } from 'react';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/SakuraFall.tsx","LineNumber":2,"LineContent":"import sakuraImg from 'figma:asset/27ac8d110de23706e36cd3626314ac81d83e55da.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":1,"LineContent":"import { useState } from 'react';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":2,"LineContent":"import doorImage    from 'figma:asset/8492b939d4f74a004d8640bdd5c338e0e6a52376.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":3,"LineContent":"import parchment    from 'figma:asset/1585093dc9956998910d206579a047fd9d61bc13.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":4,"LineContent":"import cover        from 'figma:asset/59a11dc60eec257b7096f1a596799764c77372a9.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":5,"LineContent":"import FigmaPlayButton from '../../imports/Frame427323160-2006-238';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/PreScreen.tsx","LineNumber":6,"LineContent":"import { warmUpAnnouncer } from './announcer';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/GameMessageBox.tsx","LineNumber":1,"LineContent":"import clsx from \"clsx\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/GameMessageBox.tsx","LineNumber":2,"LineContent":"import svgPaths from \"../../imports/svg-ckhft3gg6s\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/TutorialHint.tsx","LineNumber":1,"LineContent":"import { useEffect, useState } from \"react\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/TutorialHint.tsx","LineNumber":2,"LineContent":"import svgPaths from \"../../imports/svg-2yrc6vclh3\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/GameOverPopup.tsx","LineNumber":1,"LineContent":"import clsx from \"clsx\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/GameOverPopup.tsx","LineNumber":2,"LineContent":"import { useEffect, useRef } from \"react\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/GameOverPopup.tsx","LineNumber":3,"LineContent":"import svgPaths from \"../../imports/svg-t0u6vixipv\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":1,"LineContent":"import { useEffect, useRef } from 'react';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":2,"LineContent":"import type { Card, Particle, DamageNumber, CardGameProps } from '../../game/types';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":3,"LineContent":"import { useGameState } from '../../hooks/useGameState';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":4,"LineContent":"import characterSprite from 'figma:asset/749653866c572d97f2ced236dc2068e4a0696656.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":5,"LineContent":"import enemySprite from 'figma:asset/0aeea4921f1215c52fce980d72dfd5ac956ab8c8.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":6,"LineContent":"import backgroundImage from 'figma:asset/4b5983da361572a80e256fa23d1a36a1d6870d88.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":7,"LineContent":"import defendCardImage from 'figma:asset/efe58cfeddc4e2caa464968a47ef82ccb7cdfc9d.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":8,"LineContent":"import darkBibleCardImage from 'figma:asset/81e9727b251609f04cc14e76990205ea284f33a5.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":9,"LineContent":"import tropicalFruitCardImage from 'figma:asset/92304158a2f6897f7235abf61a458ec1760fcccd.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":10,"LineContent":"import shootCardImage from 'figma:asset/ee45a398de21ea3fe00cc1ebdace203bac2577a4.png';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":11,"LineContent":"import imgScrollOuter from \"figma:asset/6fb0d23ec1ac4791fe50e9d82f4025181e14cf42.png\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":12,"LineContent":"import imgScrollInner from \"figma:asset/0bd2914d7eb4b34ea587e81e81e324f6fb73d43f.png\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":13,"LineContent":"import imgHealthIcon from \"figma:asset/4f13b5b961df123ad8b98b2056cebdd3a29cda5c.png\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":14,"LineContent":"import imgManaIcon from \"figma:asset/99de9a5f07d5bd023847249ac048447372bf5fd3.png\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":15,"LineContent":"import svgPaths from \"../../imports/svg-06zh3695vz\";"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":16,"LineContent":"import PileButton from './PileButton';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":17,"LineContent":"import EndTurnButton from './EndTurnButton';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":18,"LineContent":"import GameMessageBox from './GameMessageBox';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":19,"LineContent":"import GameOverPopup from './GameOverPopup';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":20,"LineContent":"import TutorialHint from './TutorialHint';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":21,"LineContent":"import { announceReady, announceFight } from './announcer';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":37,"LineContent":"import { startBackgroundMusic, stopBackgroundMusic } from '../../audio/bgm';"}
{"File":"/home/pro/Downloads/Genshin Impact TCG (Community)/src/app/components/CardGame.tsx","LineNumber":38,"LineContent":"import { greedyEnemyAI, ENEMY_TIMING } from '../../game/enemyAI';"}
(...21 more results not shown)