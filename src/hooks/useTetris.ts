import { useState, useCallback, useRef } from 'react';
import { GameState, Position, Piece, Board } from '@/lib/tetris/types';
import { BOARD_WIDTH, BOARD_HEIGHT, PIECES, INITIAL_POSITION } from '@/lib/tetris/constants';
import { 
  createEmptyBoard, 
  isValidMove, 
  placePiece, 
  clearLines, 
  rotatePiece,
  getRandomPiece,
  calculateScore,
  getLevel,
  getDropInterval
} from '@/lib/tetris/gameLogic';

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>(INITIAL_POSITION);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [dropTime, setDropTime] = useState<number | null>(null);
  
  const dropTimeRef = useRef<number>(getDropInterval(1));
  const lastDropTime = useRef<number>(0);

  const spawnPiece = useCallback(() => {
    const piece = nextPiece || getRandomPiece();
    const newNextPiece = getRandomPiece();
    
    setCurrentPiece(piece);
    setNextPiece(newNextPiece);
    setCurrentPosition(INITIAL_POSITION);
    
    // Check if game over
    if (!isValidMove(board, piece, INITIAL_POSITION)) {
      setGameState('gameOver');
      return false;
    }
    
    return true;
  }, [board, nextPiece]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setCurrentPosition(INITIAL_POSITION);
    setGameState('playing');
    setDropTime(Date.now());
    dropTimeRef.current = getDropInterval(1);
    lastDropTime.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      setDropTime(null);
    } else if (gameState === 'paused') {
      setGameState('playing');
      setDropTime(Date.now());
      lastDropTime.current = Date.now();
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState('idle');
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setCurrentPosition(INITIAL_POSITION);
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(null);
  }, []);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    if (gameState !== 'playing' || !currentPiece) return false;

    const newPosition: Position = {
      x: currentPosition.x + deltaX,
      y: currentPosition.y + deltaY
    };

    if (isValidMove(board, currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
      
      // Reset drop timer if moving down manually
      if (deltaY > 0) {
        lastDropTime.current = Date.now();
      }
      
      return true;
    }

    // If trying to move down and can't, place the piece
    if (deltaY > 0) {
      placePieceOnBoard();
    }

    return false;
  }, [gameState, currentPiece, currentPosition, board]);

  const rotatePieceClockwise = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return false;

    const rotatedPiece = rotatePiece(currentPiece);
    
    // Try the rotation at current position
    if (isValidMove(board, rotatedPiece, currentPosition)) {
      setCurrentPiece(rotatedPiece);
      return true;
    }

    // Try wall kicks
    const wallKicks = [
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 },  // Right
      { x: 0, y: -1 }, // Up
      { x: -2, y: 0 }, // Left 2
      { x: 2, y: 0 },  // Right 2
    ];

    for (const kick of wallKicks) {
      const kickPosition: Position = {
        x: currentPosition.x + kick.x,
        y: currentPosition.y + kick.y
      };

      if (isValidMove(board, rotatedPiece, kickPosition)) {
        setCurrentPiece(rotatedPiece);
        setCurrentPosition(kickPosition);
        return true;
      }
    }

    return false;
  }, [gameState, currentPiece, currentPosition, board]);

  const hardDrop = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    let dropDistance = 0;
    let newY = currentPosition.y;

    // Find the lowest valid position
    while (isValidMove(board, currentPiece, { x: currentPosition.x, y: newY + 1 })) {
      newY++;
      dropDistance++;
    }

    setCurrentPosition({ x: currentPosition.x, y: newY });
    
    // Add hard drop bonus to score
    setScore(prev => prev + dropDistance * 2);
    
    // Place the piece immediately
    setTimeout(() => placePieceOnBoard(), 50);
  }, [gameState, currentPiece, currentPosition, board]);

  const placePieceOnBoard = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = placePiece(board, currentPiece, currentPosition);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    
    if (linesCleared > 0) {
      const newLines = lines + linesCleared;
      const newLevel = getLevel(newLines);
      const points = calculateScore(linesCleared, newLevel);
      
      setLines(newLines);
      setLevel(newLevel);
      setScore(prev => prev + points);
      dropTimeRef.current = getDropInterval(newLevel);
    }

    // Spawn next piece
    setTimeout(() => {
      if (!spawnPiece()) {
        setGameState('gameOver');
      }
    }, 100);
  }, [currentPiece, board, currentPosition, lines, spawnPiece]);

  const update = useCallback((time: number) => {
    if (gameState !== 'playing' || !currentPiece) return;

    if (time - lastDropTime.current > dropTimeRef.current) {
      movePiece(0, 1);
      lastDropTime.current = time;
    }
  }, [gameState, currentPiece, movePiece]);

  const getGhostPosition = useCallback((): Position | null => {
    if (!currentPiece) return null;

    let ghostY = currentPosition.y;
    while (isValidMove(board, currentPiece, { x: currentPosition.x, y: ghostY + 1 })) {
      ghostY++;
    }

    return { x: currentPosition.x, y: ghostY };
  }, [currentPiece, currentPosition, board]);

  return {
    // Game state
    gameState,
    board,
    currentPiece,
    currentPosition,
    nextPiece,
    score,
    lines,
    level,
    
    // Actions
    startGame,
    pauseGame,
    resetGame,
    movePiece,
    rotatePieceClockwise,
    hardDrop,
    update,
    
    // Utilities
    getGhostPosition,
  };
};