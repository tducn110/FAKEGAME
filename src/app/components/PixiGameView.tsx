import React, { useEffect, useRef } from 'react';
import { PixiEngine } from '../../pixi/PixiEngine';
import { loadPixiAssets } from '../../pixi/AssetManager';

export const PixiGameView = React.memo((props: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PixiEngine | null>(null);

  useEffect(() => {
    let engine: PixiEngine;
    let isDestroyed = false;

    const init = async () => {
      await loadPixiAssets();
      if (isDestroyed) return;

      engine = new PixiEngine();
      engineRef.current = engine;
      
      if (containerRef.current) {
        await engine.init(containerRef.current, props.onPlayCard, props.onEndTurn);
        if (isDestroyed) {
            engine.destroy();
            return;
        }
        engine.syncState(props);
      }
    };

    init();

    return () => {
      isDestroyed = true;
      if (engineRef.current) {
        engineRef.current.destroy();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Run once

  // Sync state
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.syncState(props);
    }
  }, [props]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />;
});
