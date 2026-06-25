import { useEffect, useState } from "react";
import svgPaths from "../../imports/svg-2yrc6vclh3";

interface TutorialHintProps {
  visible: boolean;
}

export default function TutorialHint({ visible }: TutorialHintProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setMounted(true), 600);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [visible]);

  return (
    <>
      <style>{`
        @keyframes tutorial-float {
          0%   { transform: translateY(0px);  }
          45%  { transform: translateY(-10px); }
          100% { transform: translateY(0px);  }
        }
        @keyframes tutorial-fade-in {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes tutorial-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        @keyframes tutorial-arrow-pulse {
          0%   { opacity: 0.7; }
          50%  { opacity: 1;   }
          100% { opacity: 0.7; }
        }
        .tutorial-wrapper {
          animation:
            tutorial-fade-in 0.6s ease-out forwards,
            tutorial-float 2.2s ease-in-out 0.6s infinite;
        }
        .tutorial-wrapper-out {
          animation: tutorial-fade-out 0.45s ease-out forwards;
        }
        .tutorial-arrow {
          animation: tutorial-arrow-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`pointer-events-none ${mounted ? (visible ? "tutorial-wrapper" : "tutorial-wrapper-out") : "opacity-0"}`}
        style={{
          position: "relative",
          width: "260px",
          height: "80px",
        }}
      >
        {/* Text */}
        <p
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            fontFamily: "'Averia Serif Libre', serif",
            fontWeight: "bold",
            fontSize: "24px",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
            color: "#6D542F",
            WebkitTextStroke: "0px transparent",
            paintOrder: "stroke fill",
            width: "165px",
            whiteSpace: "pre-wrap",
            margin: 0,
          }}
        >
          Click on your Cards to play!
        </p>

        {/* Arrow SVG — same shape as Figma, positioned to the right of the text */}
        <div
          className="tutorial-arrow absolute"
          style={{
            left: "163px",
            top: "15px",
            width: "82px",
            height: "22px",
          }}
        >
          <svg
            width="82"
            height="22"
            viewBox="0 0 80.1499 20.9774"
            fill="none"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <g>
              <path
                d={svgPaths.p2248b400}
                stroke="#6D542F"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d={svgPaths.p3f028c80}
                stroke="#6D542F"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}