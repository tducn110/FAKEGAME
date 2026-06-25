import clsx from "clsx";
import svgPaths from "../../imports/svg-ckhft3gg6s";

function Ornament({
  children,
  additionalClassNames = "",
}: React.PropsWithChildren<{ additionalClassNames?: string }>) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="h-[74.91px] relative w-[127.971px]">
        <div className="absolute inset-[-7.64%_-4.47%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 139.416 86.3544"
          >
            {children}
          </svg>
        </div>
      </div>
    </div>
  );
}

interface GameMessageBoxProps {
  text: string;
}

export default function GameMessageBox({ text }: GameMessageBoxProps) {
  return (
    /* Fixed-size container that the absolutely-placed children are relative to */
    <div className="relative" style={{ width: "560px", height: "130px" }}>
      {/* Main banner shape */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-50% + 0.76px), calc(-50% - 2.7px))",
          width: "415.5px",
          height: "98.506px",
        }}
      >
        <div style={{ transform: "scaleY(-1)" }}>
          <div style={{ width: "415.5px", height: "98.506px", position: "relative" }}>
            <svg
              className="absolute block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 415.5 98.5063"
            >
              <path
                d={svgPaths.p7090700}
                fill="#FFF7E8"
                id="Rectangle 39938"
                stroke="#CBBBA5"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Text label */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-50% + 3.01px), calc(-50% - 7.54px))",
          width: "322px",
          height: "57px",
        }}
      >
        <div style={{ width: "322px", height: "57px" }}>
          <div
            className="flex flex-col justify-center text-center not-italic"
            style={{
              width: "322px",
              height: "57px",
              fontFamily: "'Averia Serif Libre', serif",
              fontWeight: "bold",
              fontSize: "22px",
              letterSpacing: "-1.1px",
              background: "linear-gradient(to bottom, #1a1008 8%, #5c4e38 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            <p className="leading-[1.2] whitespace-nowrap overflow-hidden text-ellipsis">
              {text}
            </p>
          </div>
        </div>
      </div>

      {/* Right ornament */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-50% + 152px), calc(-50% + 14.5px))",
          width: "127.971px",
          height: "74.91px",
        }}
      >
        <Ornament additionalClassNames="rotate-180">
          <g filter="url(#filter_right)" id="Vector 1088">
            <path d={svgPaths.pe949500} fill="#EBDBC6" />
            <path d={svgPaths.p4963600} stroke="#CBBBA5" strokeWidth="3.12124" />
            <path d={svgPaths.p4963600} stroke="url(#grad_right)" strokeWidth="3.12124" />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="86.3544"
              id="filter_right"
              width="139.416"
              x="0"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence
                baseFrequency="0.01 0.01"
                numOctaves="3"
                seed="3148"
                type="fractalNoise"
              />
              <feDisplacementMap
                height="100%"
                in="shape"
                result="displacedImage"
                scale="8.323"
                width="100%"
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feMerge result="effect1_texture">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="grad_right"
              x1="69.2034"
              x2="69.2122"
              y1="8.41525"
              y2="80.6323"
            >
              <stop stopColor="#FFE8D7" />
              <stop offset="0.278883" stopColor="#7E6C5F" />
              <stop offset="0.754693" stopColor="#E4C3AC" />
              <stop offset="1" stopColor="#8C7869" />
            </linearGradient>
          </defs>
        </Ornament>
      </div>

      {/* Left ornament */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(calc(-50% - 152px), calc(-50% + 14.5px))",
          width: "127.971px",
          height: "74.91px",
        }}
      >
        <Ornament additionalClassNames="-scale-y-100">
          <g filter="url(#filter_left)" id="Vector 1089">
            <path d={svgPaths.pe949500} fill="#EBDBC6" />
            <path d={svgPaths.p4963600} stroke="url(#grad_left)" strokeWidth="3.12124" />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="86.3544"
              id="filter_left"
              width="139.416"
              x="0"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence
                baseFrequency="0.01 0.01"
                numOctaves="3"
                seed="3148"
                type="fractalNoise"
              />
              <feDisplacementMap
                height="100%"
                in="shape"
                result="displacedImage"
                scale="8.323"
                width="100%"
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feMerge result="effect1_texture">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="grad_left"
              x1="138.722"
              x2="14.4262"
              y1="-3.27772"
              y2="39.8694"
            >
              <stop stopColor="#FFE8D7" />
              <stop offset="0.278883" stopColor="#7E6C5F" />
              <stop offset="0.754693" stopColor="#E4C3AC" />
              <stop offset="1" stopColor="#8C7869" />
            </linearGradient>
          </defs>
        </Ornament>
      </div>
    </div>
  );
}