import { useEffect, useCallback } from 'react';

export interface KeyboardControls {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  pause: () => void;
  restart: () => void;
}

interface UseKeyboardProps {
  controls: KeyboardControls;
  isGameActive: boolean;
}

export const useKeyboard = ({ controls, isGameActive }: UseKeyboardProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isGameActive) {
      // Only allow pause and restart when game is not active
      if (event.code === 'KeyP') {
        event.preventDefault();
        controls.pause();
      } else if (event.code === 'KeyR') {
        event.preventDefault();
        controls.restart();
      }
      return;
    }

    switch (event.code) {
      case 'ArrowLeft':
        event.preventDefault();
        controls.moveLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        controls.moveRight();
        break;
      case 'ArrowDown':
        event.preventDefault();
        controls.moveDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        controls.rotate();
        break;
      case 'Space':
        event.preventDefault();
        controls.hardDrop();
        break;
      case 'KeyP':
        event.preventDefault();
        controls.pause();
        break;
      case 'KeyR':
        event.preventDefault();
        controls.restart();
        break;
    }
  }, [controls, isGameActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};