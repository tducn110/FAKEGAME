import React from 'react';
import svgPaths from "../../imports/svg-06zh3695vz";

interface PlayerHUDProps {
  introStarted: boolean;
  playerHealth: number;
  playerMana: number;
  maxMana: number;
  playerShield: number;
  imgScrollOuter: string;
  imgScrollInner: string;
  imgHealthIcon: string;
  imgManaIcon: string;
}

export function PlayerHUD({
  introStarted,
  playerHealth,
  playerMana,
  maxMana,
  playerShield,
  imgScrollOuter,
  imgScrollInner,
  imgHealthIcon,
  imgManaIcon,
}: PlayerHUDProps) {
  return (
    <div className="pointer-events-auto" style={{ animation: introStarted ? 'hud-slide-in-left 0.85s cubic-bezier(0.22,1,0.36,1) both' : 'none', willChange: introStarted ? 'transform' : 'auto' }}>
      <div className="relative" style={{ width: '365.95px', height: '403px', transform: 'scale(1.3)', transformOrigin: 'top left' }}>
        <div className="absolute h-[310px] left-0 top-0 w-[281.5px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScrollOuter} />
        </div>
        <div className="absolute h-[287px] left-[11px] top-[22px] w-[259px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScrollInner} />
        </div>
        <div className="absolute contents left-[56px] top-[4px]">
          <div className="absolute h-[86px] left-[56px] top-[4px] w-[25.45px]">
            <div className="absolute inset-[-0.26%_-0.87%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.8929 86.4426">
                <g filter="url(#filter0_g_36_202_player)" id="Union">
                  <path d={svgPaths.p33e9fc80} fill="var(--fill-0, #97473C)" />
                  <path d={svgPaths.pe56be80} stroke="var(--stroke-0, #5D3A28)" strokeWidth="0.331959" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="86.4426" id="filter0_g_36_202_player" width="25.8929" x="1.95104e-09" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feTurbulence baseFrequency="0.1369280070066452 0.1369280070066452" numOctaves="3" seed="9941" type="fractalNoise" />
                    <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.44261261820793152" width="100%" xChannelSelector="R" yChannelSelector="G" />
                    <feMerge result="effect1_texture_36_202">
                      <feMergeNode in="displacedImage" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          <div className="absolute h-[85.145px] left-[56.44px] top-[4.44px] w-[24.565px]">
            <div className="absolute inset-[-0.26%_-0.9%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.0077 85.5877">
                <g filter="url(#filter0_g_36_200_player)" id="Union" opacity="0.1">
                  <path d={svgPaths.p2096dd00} stroke="var(--stroke-0, #FFFBEE)" strokeWidth="0.331959" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="85.5877" id="filter0_g_36_200_player" width="25.0077" x="6.238e-10" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feTurbulence baseFrequency="0.1369280070066452 0.1369280070066452" numOctaves="3" seed="9941" type="fractalNoise" />
                    <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.44261261820793152" width="100%" xChannelSelector="R" yChannelSelector="G" />
                    <feMerge result="effect1_texture_36_200">
                      <feMergeNode in="displacedImage" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          <div className="absolute h-[80.977px] left-[58.21px] top-[6.22px] w-[21.053px]">
            <div className="absolute inset-[-0.27%_-1.05%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.4959 81.4198">
                <g filter="url(#filter0_g_36_198_player)" id="Union" opacity="0.5">
                  <path d={svgPaths.p7667600} stroke="var(--stroke-0, #FFFBEE)" strokeWidth="0.482704" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="81.4198" id="filter0_g_36_198_player" width="21.4959" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feTurbulence baseFrequency="0.1369280070066452 0.1369280070066452" numOctaves="3" seed="9941" type="fractalNoise" />
                    <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.44261261820793152" width="100%" xChannelSelector="R" yChannelSelector="G" />
                    <feMerge result="effect1_texture_36_198">
                      <feMergeNode in="displacedImage" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          <div className="absolute flex h-[38px] items-center justify-center left-[62.56px] top-[26.86px] w-[13px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
            <div className="flex-none rotate-90">
              <p className="font-['Averia_Serif_Libre',serif] leading-[1.1] not-italic relative text-[#fffcf3] text-[11.78px] tracking-[-0.589px]">Status</p>
            </div>
          </div>
        </div>
        
        {/* Player Name */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] left-[140.95px] not-italic text-[#44331a] text-[32px] text-center top-[90.5px] tracking-[-1.6576px] whitespace-nowrap">
          <p className="leading-[1.1]">Player</p>
        </div>
        
        {/* Health and Mana Bars */}
        <div className="absolute content-stretch flex flex-col gap-[11.49px] h-[104.365px] items-start left-[48px] p-[4.787px] top-[118.88px] w-[185.271px]">
          {/* Health Bar */}
          <div className="content-stretch flex flex-col gap-[3.83px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <div className="content-stretch flex gap-[3.83px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[23.458px]">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgHealthIcon} />
                </div>
                <div className="flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] not-italic relative shrink-0 text-[#44331a] text-[17.24px] text-center whitespace-nowrap">
                  <p className="leading-[1.1]">Health</p>
                </div>
              </div>
              <div className="flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] not-italic relative shrink-0 text-[#44331a] text-[17.24px] text-center whitespace-nowrap">
                <p className="leading-[1.1]">{playerHealth}/100</p>
              </div>
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
              <div className="bg-white col-1 h-[17.235px] ml-0 mt-0 rounded-[590.761px] row-1 w-[175.696px]" />
              <div 
                className="bg-[#bd6468] border-[0.957px] border-solid border-white col-1 h-[17.235px] ml-0 mt-0 rounded-[590.761px] row-1 transition-all duration-300"
                style={{ width: `${(playerHealth / 100) * 175.696}px` }}
              />
            </div>
          </div>
          
          {/* Mana Bar */}
          <div className="content-stretch flex flex-col gap-[3.83px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <div className="content-stretch flex gap-[3.83px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[23.458px]">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgManaIcon} />
                </div>
                <div className="flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] not-italic relative shrink-0 text-[#44331a] text-[17.24px] text-center whitespace-nowrap">
                  <p className="leading-[1.1]">Mana</p>
                </div>
              </div>
              <div className="flex flex-col font-['Averia_Serif_Libre',serif] justify-center leading-[0] not-italic relative shrink-0 text-[#44331a] text-[17.24px] text-center whitespace-nowrap">
                <p className="leading-[1.1]">{playerMana}/{maxMana}</p>
              </div>
            </div>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
              <div className="bg-white col-1 h-[17.235px] ml-0 mt-0 rounded-[590.761px] row-1 w-[175.696px]" />
              <div 
                className="bg-[#8cd0fb] border-[0.957px] border-solid border-white col-1 h-[17.235px] ml-0 mt-0 rounded-[590.761px] row-1 transition-all duration-300"
                style={{ width: `${(playerMana / maxMana) * 175.696}px` }}
              />
            </div>
          </div>
        </div>
        
        {/* Shield Display */}
        {playerShield > 0 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-200/90 px-3 py-1 rounded-full border-2 border-blue-400">
            <span className="text-xs font-bold text-blue-900">🛡️ {playerShield}</span>
          </div>
        )}
      </div>
    </div>
  );
}
