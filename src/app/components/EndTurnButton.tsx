type EndTurnButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export default function EndTurnButton({ onClick, disabled }: EndTurnButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
      style={{
        width: '170px',
        height: '58px',
        borderRadius: 14,
        border: '2px solid rgba(83, 50, 17, 0.9)',
        background: disabled
          ? 'linear-gradient(180deg, rgba(116, 91, 57, 0.72), rgba(55, 38, 24, 0.78))'
          : 'linear-gradient(180deg, rgba(255, 232, 169, 0.98), rgba(184, 115, 45, 0.98) 58%, rgba(100, 55, 22, 0.98))',
        boxShadow: disabled
          ? '0 6px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)'
          : '0 8px 20px rgba(57,29,9,0.42), 0 0 22px rgba(255,205,91,0.34), inset 0 1px 0 rgba(255,255,255,0.62)',
        color: disabled ? 'rgba(255, 245, 225, 0.52)' : '#fff7df',
        fontFamily: "'Averia Serif Libre', serif",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 0,
        lineHeight: 1,
        textShadow: disabled ? '0 1px 2px rgba(0,0,0,0.45)' : '0 2px 4px rgba(58,28,7,0.88)',
        opacity: disabled ? 0.72 : 1,
      }}
    >
      End Turn
    </button>
  );
}
