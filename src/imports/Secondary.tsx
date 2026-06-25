import clsx from "clsx";
import svgPaths from "./svg-bntdjjxan7";
type SecondaryHelperProps = {
  additionalClassNames?: string;
};

function SecondaryHelper({ children, additionalClassNames = "" }: React.PropsWithChildren<SecondaryHelperProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8915 10.1487">
        {children}
      </svg>
    </div>
  );
}

export default function Secondary() {
  return (
    <div className="relative size-full" data-name="SECONDARY">
      <div className="-translate-y-1/2 absolute h-[55.479px] left-0 top-[calc(50%+0.07px)] w-[162.118px]" data-name="Union">
        <div className="absolute inset-[-5.88%_-2.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.741 52.1156">
            <g filter="url(#filter0_g_55_538)" id="Union">
              <mask fill="black" height="52" id="path-1-outside-1_55_538" maskUnits="userSpaceOnUse" width="142" x="-0.257121" y="-0.257121">
                <rect fill="white" height="52" width="142" x="-0.257121" y="-0.257121" />
                <path d={svgPaths.p15bd3700} />
              </mask>
              <path d={svgPaths.p15bd3700} fill="var(--fill-0, white)" />
              <path d={svgPaths.p24174f00} fill="var(--stroke-0, #DFC8A5)" mask="url(#path-1-outside-1_55_538)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="52.1156" id="filter0_g_55_538" width="141.741" x="-1.19209e-07" y="1.19209e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
                <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1.3714396953582764" width="100%" xChannelSelector="R" yChannelSelector="G" />
                <feMerge result="effect1_texture_55_538">
                  <feMergeNode in="displacedImage" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Averia_Serif_Libre',serif] leading-[1.1] left-[81.8px] not-italic text-[#6d542f] text-[16.318px] text-center top-[calc(50%-8.9px)] tracking-[-1.3054px]">Discard: 15</p>
      <div className="-translate-y-1/2 absolute h-[11.422px] left-[138.16px] top-[calc(50%+0.07px)] w-[14.686px]">
        <SecondaryHelper additionalClassNames="inset-[-2.85%_-2.22%_-2.86%_-2.23%]">
          <g id="Group 427322598">
            <g filter="url(#filter0_g_55_527)" id="Rectangle 39727">
              <path d={svgPaths.p20f97900} fill="var(--fill-0, #F0DCB5)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.1487" id="filter0_g_55_527" width="12.8915" x="-1.31549e-08" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.54857587814331055" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_55_527">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
          </defs>
        </SecondaryHelper>
      </div>
      <div className="-translate-y-1/2 absolute flex h-[11.422px] items-center justify-center left-[8.46px] top-[calc(50%+0.07px)] w-[14.686px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[11.422px] relative w-[14.686px]">
            <SecondaryHelper additionalClassNames="inset-[-2.85%_-2.22%_-2.86%_-2.22%]">
              <g id="Group 427322599">
                <g filter="url(#filter0_g_55_550)" id="Rectangle 39727">
                  <path d={svgPaths.p20f97900} fill="var(--fill-0, #F0DCB5)" />
                </g>
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.1487" id="filter0_g_55_550" width="12.8915" x="1.06629e-08" y="-1.49012e-08">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2957" type="fractalNoise" />
                  <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="0.54857587814331055" width="100%" xChannelSelector="R" yChannelSelector="G" />
                  <feMerge result="effect1_texture_55_550">
                    <feMergeNode in="displacedImage" />
                  </feMerge>
                </filter>
              </defs>
            </SecondaryHelper>
          </div>
        </div>
      </div>
    </div>
  );
}