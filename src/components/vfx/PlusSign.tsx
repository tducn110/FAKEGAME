interface PlusSignProps {
  animationName: string;
  delay: string;
}

export default function PlusSign({ animationName, delay }: PlusSignProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        animation: `${animationName} 1.2s ease-out ${delay} forwards`,
        opacity: 0,
      }}
    >
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <rect x="14" y="2" width="10" height="34" rx="4" fill="var(--color-heal)" stroke="#fff" strokeWidth="2.5"/>
        <rect x="2" y="14" width="34" height="10" rx="4" fill="var(--color-heal)" stroke="#fff" strokeWidth="2.5"/>
        <rect x="15.5" y="3.5" width="7" height="31" rx="3" fill="var(--color-heal-light)" opacity="0.45"/>
      </svg>
    </div>
  );
}
