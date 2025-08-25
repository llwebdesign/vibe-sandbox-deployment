import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopProps {
  isRunning: boolean;
  onTick: () => void;
  tickRate: number; // milliseconds between ticks
}

export const useGameLoop = ({ isRunning, onTick, tickRate }: UseGameLoopProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const now = Date.now();
    if (now - lastTickRef.current >= tickRate) {
      onTick();
      lastTickRef.current = now;
    }
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning, onTick, tickRate]);

  const start = useCallback(() => {
    if (!isRunning) return;
    
    lastTickRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [isRunning, tick]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }

    return stop;
  }, [isRunning, start, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop };
};