import { Board, Position, Piece } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

export const isValidPosition = (board: Board, piece: Piece, position: Position): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing pieces (but allow negative Y for spawning)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placePieceOnBoard = (board: Board, piece: Piece, position: Position): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.shape[y][x];
        }
      }
    }
  }
  
  return newBoard;
};

export const findCompletedLines = (board: Board): number[] => {
  const completedLines: number[] = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== 0)) {
      completedLines.push(y);
    }
  }
  
  return completedLines;
};

export const clearLines = (board: Board, linesToClear: number[]): Board => {
  const newBoard = board.filter((_, index) => !linesToClear.includes(index));
  
  // Add empty lines at the top
  const emptyLines = Array(linesToClear.length)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));
  
  return [...emptyLines, ...newBoard];
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

export const calculateLevel = (totalLinesCleared: number): number => {
  return Math.floor(totalLinesCleared / 10);
};

export const calculateDropSpeed = (level: number): number => {
  // Speed increases with level, minimum 50ms
  return Math.max(50, 1000 - (level * 50));
};

export const rotatePiece = (piece: Piece): Piece => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated
  };
};

export const getGhostPiecePosition = (board: Board, piece: Piece, position: Position): Position => {
  let ghostY = position.y;
  
  while (isValidPosition(board, piece, { x: position.x, y: ghostY + 1 })) {
    ghostY++;
  }
  
  return { x: position.x, y: ghostY };
};

export const canPieceMove = (board: Board, piece: Piece, position: Position, direction: 'left' | 'right' | 'down'): boolean => {
  const moves = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 }
  };
  
  const move = moves[direction];
  const newPosition = {
    x: position.x + move.x,
    y: position.y + move.y
  };
  
  return isValidPosition(board, piece, newPosition);
};

export const tryWallKick = (board: Board, piece: Piece, position: Position): Position | null => {
  // Try different wall kick positions
  const wallKicks = [
    { x: 0, y: 0 },   // No kick
    { x: 1, y: 0 },   // Right
    { x: -1, y: 0 },  // Left
    { x: 0, y: -1 },  // Up
    { x: 1, y: -1 },  // Right + Up
    { x: -1, y: -1 }  // Left + Up
  ];
  
  for (const kick of wallKicks) {
    const newPosition = {
      x: position.x + kick.x,
      y: position.y + kick.y
    };
    
    if (isValidPosition(board, piece, newPosition)) {
      return newPosition;
    }
  }
  
  return null;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getRandomPieceType = (): number => {
  return Math.floor(Math.random() * 7) + 1;
};

export const isGameOver = (board: Board): boolean => {
  // Check if any pieces are above the visible board area
  return board[0].some(cell => cell !== 0) || board[1].some(cell => cell !== 0);
};