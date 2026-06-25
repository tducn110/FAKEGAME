import React from 'react';

export interface PlayingCardProps {
  card: any;
  index: number;
  totalCards: number;
  side: 'player' | 'enemy';
  handSpacing: number;
  cardW: number;
  cardH: number;
  isMobile: boolean;
  isPlaying?: boolean;
  drawAnimKey?: number;
  isDiscarding?: boolean;
  cardsLocked?: boolean;
  gameOver?: boolean;
  isPlayerTurn?: boolean;
  playerMana?: number;
  cardImages: Record<string, string>;
  visualMode?: 'dom' | 'interactionOnly';
  onClick?: () => void;
}

export function PlayingCard({
  card, index, totalCards, side, handSpacing, cardW, cardH, isMobile,
  isPlaying = false, drawAnimKey = 0, isDiscarding = false, cardsLocked = false,
  gameOver = false, isPlayerTurn = false, playerMana = 0,
  cardImages, visualMode = 'dom', onClick
}: PlayingCardProps) {
  const centerIndex = (totalCards - 1) / 2;
  const distanceFromCenter = index - centerIndex;
  
  const horizontalSpacing = handSpacing;
  const xOffset = distanceFromCenter * horizontalSpacing;
  
  const arcHeight = 40;
  const normalizedDistance = Math.abs(distanceFromCenter / Math.max(centerIndex, 1));
  const yOffset = arcHeight - (normalizedDistance * normalizedDistance * arcHeight);
  const rotationAngle = distanceFromCenter * 8;
  
  const drawDelay = index * 85;
  const discardDelay = (totalCards - 1 - index) * 65;

  const bgImage = cardImages[card.name] || cardImages['Defend'];

  const transparentCardStyle: React.CSSProperties = {
    width: `${cardW}px`,
    height: `${cardH}px`,
    borderRadius: '8px',
    opacity: 0,
  };

  if (side === 'enemy') {
    return (
      <div
        key={`enemy-${drawAnimKey}-${card.id}`}
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: `${yOffset}px`,
          transform: `translateX(calc(-50% + ${xOffset}px)) rotate(${rotationAngle}deg)`,
          zIndex: isPlaying ? 200 : 100 + index,
          filter: isPlaying
            ? 'drop-shadow(0 0 24px rgba(255,210,60,1)) drop-shadow(0 0 8px rgba(255,255,150,0.9))'
            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
          transition: 'filter 0.2s ease',
        }}
      >
        <div
          style={{
            animation: isDiscarding
              ? `card-discard-out 0.42s ease-in ${discardDelay}ms both`
              : isPlaying
              ? 'enemy-card-play 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) forwards'
              : `card-draw-in 0.48s cubic-bezier(0.34, 1.38, 0.64, 1) ${drawDelay}ms both`,
          }}
        >
          <div
            style={visualMode === 'interactionOnly' ? transparentCardStyle : {
              width: `${cardW}px`,
              height: `${cardH}px`,
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              opacity: (!isPlaying && !isDiscarding && !cardsLocked) ? 1 : (isPlaying ? 1 : 0.45),
              transition: 'opacity 0.25s ease',
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {visualMode === 'dom' && (
              <>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(160, 20, 20, 0.28)', borderRadius: '8px' }} />
            {isPlaying && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(255, 210, 50, 0.18)',
                boxShadow: 'inset 0 0 28px rgba(255,210,50,0.5)',
                borderRadius: '8px',
              }} />
            )}
            <div style={{
              position: 'absolute', top: '6px', left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(140,10,10,0.82)',
              border: '1.5px solid rgba(255,100,100,0.55)',
              borderRadius: '6px',
              padding: '1px 8px',
              pointerEvents: 'none',
            }}>
              <span style={{ fontSize: '11px', fontFamily: "'Averia Serif Libre', serif", color: '#ffcccc', letterSpacing: '0.5px', fontWeight: 'bold' }}>ENEMY</span>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Player side
  const canPlay = !gameOver && isPlayerTurn && !isDiscarding && !cardsLocked && playerMana >= card.cost;
  const isTooExpensive = playerMana < card.cost;

  return (
    <div
      key={`${drawAnimKey}-${card.id}`}
      onClick={() => {
        if (canPlay && onClick) onClick();
      }}
      className="absolute cursor-pointer transition-all duration-300 group hover:!z-[300] pointer-events-auto"
      style={{
        left: '50%',
        bottom: `${yOffset}px`,
        transform: `translateX(calc(-50% + ${xOffset}px)) rotate(${rotationAngle}deg)`,
        zIndex: 100 + index,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        pointerEvents: isDiscarding || cardsLocked ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          animation: isDiscarding
            ? `card-discard-out 0.42s ease-in ${discardDelay}ms both`
            : `card-draw-in 0.48s cubic-bezier(0.34, 1.38, 0.64, 1) ${drawDelay}ms both`,
        }}
      >
        <div
          className={`
            rounded-lg overflow-hidden relative
            ${!isPlayerTurn || isTooExpensive || gameOver || cardsLocked ? 'opacity-50' : `group-hover:scale-125 ${isMobile ? 'group-hover:-translate-y-[80px]' : 'group-hover:-translate-y-[100px]'}`}
            transition-all duration-200
          `}
          style={visualMode === 'interactionOnly' ? {
            ...transparentCardStyle,
            opacity: 1,
            background: 'transparent',
          } : {
            width: `${cardW}px`,
            height: `${cardH}px`,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {visualMode === 'dom' && isTooExpensive && isPlayerTurn && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-bold text-sm text-center px-2">Not Enough<br/>Mana</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
