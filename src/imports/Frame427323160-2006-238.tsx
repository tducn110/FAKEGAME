import clsx from "clsx";
import svgPaths from "./svg-tg67f9ul0r";
type WrapperProps = {
  additionalClassNames?: string;
  additionalClassNames1?: string;
};

function Wrapper({ children, additionalClassNames = "", additionalClassNames1 = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties} className={clsx("-translate-x-1/2 -translate-y-1/2 absolute flex h-[17.755px] items-center justify-center top-[calc(50%+3px)] w-[17.65px]", additionalClassNames)}>
      <div className={clsx("flex-none", additionalClassNames)}>
        <div className="opacity-40 relative size-[12.518px]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5176 12.5166">
            {children}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame427323160Helper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[-7.64%_-4.47%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65.904 40.8211">
        {children}
      </svg>
    </div>
  );
}

interface FrameProps {
  /** Override the button label. Defaults to "Join Now!" */
  label?: string;
}

export default function Frame({ label = "Join Now!" }: FrameProps) {
  return (
    <div className="relative size-full">
      <Wrapper additionalClassNames="left-[calc(50%-72.17px)]" additionalClassNames1="rotate-[-134.83deg] skew-x-[0.34deg]">
        <path d={svgPaths.p103ade80} fill="var(--fill-0, #CBBBA5)" id="Union" />
      </Wrapper>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-2px)] top-[calc(50%-2px)]">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[62px] left-[calc(50%-2px)] top-[calc(50%-2px)] w-[173.998px]" data-name="Union">
          <div className="absolute inset-[-0.81%_-0.31%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 175.07 63.0019" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g id="Union">
                <path d={svgPaths.p2ff8c00} fill="var(--fill-0, #B550A7)" />
                <path d={svgPaths.p2ff8c00} fill="url(#pattern0_2006_316)" fillOpacity="0.05" />
                <path d={svgPaths.p3fc62100} fill="var(--stroke-0, #9C466E)" />
              </g>
              <defs>
                <pattern height="1" id="pattern0_2006_316" patternTransform="matrix(12.1264 0 0 12.1264 1.07006 1.02992)" patternUnits="userSpaceOnUse" preserveAspectRatio="none" viewBox="1.65705 1.65674 37.9118 37.9118" width="1">
                  <g id="pattern0_2006_316_inner">
                    <rect fill="var(--fill-0, #ECDEC3)" height="26.8077" id="Rectangle 39927" rx="4" transform="rotate(45 18.9559 0)" width="26.8077" x="18.9559" />
                  </g>
                </pattern>
              </defs>
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[53.934px] left-[calc(50%-1.96px)] top-[calc(50%-2.01px)] w-[165.29px]" data-name="Union">
          <div className="absolute inset-[-0.94%_-0.33%_-0.93%_-0.33%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 166.387 54.9422">
              <path d={svgPaths.p2b1bfaf0} id="Union" opacity="0.2" stroke="var(--stroke-0, white)" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <Wrapper additionalClassNames="left-[calc(50%+66.83px)]" additionalClassNames1="-scale-y-100 rotate-[-45.17deg] skew-x-[-0.34deg]">
          <path d={svgPaths.p103ade80} fill="var(--fill-0, white)" id="Union" />
        </Wrapper>
        <p className="-translate-x-1/2 absolute font-['Averia_Serif_Libre',serif] leading-[1.1] left-[calc(50%+1px)] not-italic text-[20px] text-center text-white top-[calc(50%-10px)] tracking-[0em] whitespace-nowrap">{label}</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[35.411px] left-[calc(50%-62.75px)] top-[calc(50%-11.29px)] w-[60.494px]">
        <Frame427323160Helper>
          <g filter="url(#filter0_g_2006_286)" id="Vector 1089">
            <path d={svgPaths.p3120fb00} fill="var(--fill-0, #EBDBC6)" />
            <path d={svgPaths.p33a8dc00} stroke="url(#paint0_linear_2006_286)" strokeWidth="1.47546" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.8211" id="filter0_g_2006_286" width="65.904" x="5.96046e-08" y="5.96046e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.021154331043362617 0.021154331043362617" numOctaves="3" seed="3148" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="3.9345681667327881" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_2006_286">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2006_286" x1="65.5763" x2="6.8195" y1="-1.54943" y2="18.8469">
              <stop stopColor="#FFE8D7" />
              <stop offset="0.278883" stopColor="#7E6C5F" />
              <stop offset="0.754693" stopColor="#E4C3AC" />
              <stop offset="1" stopColor="#8C7869" />
            </linearGradient>
          </defs>
        </Frame427323160Helper>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[35.411px] items-center justify-center left-[calc(50%+62.25px)] top-[calc(50%+15.71px)] w-[60.494px]">
        <div className="flex-none rotate-180">
          <div className="h-[35.411px] relative w-[60.494px]">
            <Frame427323160Helper>
              <g filter="url(#filter0_g_2006_268)" id="Vector 1088">
                <path d={svgPaths.p3120fb00} fill="var(--fill-0, #EBDBC6)" />
                <path d={svgPaths.p33a8dc00} stroke="var(--stroke-0, #CBBBA5)" strokeWidth="1.47546" />
                <path d={svgPaths.p33a8dc00} stroke="url(#paint0_linear_2006_268)" strokeWidth="1.47546" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.8211" id="filter0_g_2006_268" width="65.904" x="5.96046e-08" y="5.96046e-08">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feTurbulence baseFrequency="0.021154331043362617 0.021154331043362617" numOctaves="3" seed="3148" type="fractalNoise" />
                  <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="3.9345681667327881" width="100%" xChannelSelector="R" yChannelSelector="G" />
                  <feMerge result="effect1_texture_2006_268">
                    <feMergeNode in="displacedImage" />
                  </feMerge>
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2006_268" x1="32.7136" x2="32.7178" y1="3.97803" y2="38.1162">
                  <stop stopColor="#FFE8D7" />
                  <stop offset="0.278883" stopColor="#7E6C5F" />
                  <stop offset="0.754693" stopColor="#E4C3AC" />
                  <stop offset="1" stopColor="#8C7869" />
                </linearGradient>
              </defs>
            </Frame427323160Helper>
          </div>
        </div>
      </div>
    </div>
  );
}