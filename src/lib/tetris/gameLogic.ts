import { GameState, Position, Piece, Board } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT, PIECES, INITIAL_FALL_SPEED, LEVEL_SPEED_INCREASE } from './constants';

export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

export const getRandomPiece = (): Piece => {
  const pieceTypes = Object.keys(PIECES) as (keyof typeof PIECES)[];
  const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  return {
    type: randomType,
    shape: PIECES[randomType].shape,
    color: PIECES[randomType].color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    rotation: 0
  };
};

export const isValidPosition = (board: Board, piece: Piece, position: Position, rotation: number = piece.rotation): boolean => {
  const shape = getRotatedShape(piece.shape, rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export const getRotatedShape = (shape: number[][], rotation: number): number[][] => {
  let rotatedShape = shape;
  
  for (let i = 0; i < rotation; i++) {
    const rows = rotatedShape.length;
    const cols = rotatedShape[0].length;
    const newShape = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        newShape[x][rows - 1 - y] = rotatedShape[y][x];
      }
    }
    
    rotatedShape = newShape;
  }
  
  return rotatedShape;
};

export const placePieceOnBoard = (board: Board, piece: Piece): Board => {
  const newBoard = board.map(row => [...row]);
  const shape = getRotatedShape(piece.shape, piece.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / 10);
};

export const calculateFallSpeed = (level: number): number => {
  return Math.max(50, INITIAL_FALL_SPEED - (level * LEVEL_SPEED_INCREASE));
};

export const movePiece = (piece: Piece, direction: 'left' | 'right' | 'down'): Piece => {
  const newPosition = { ...piece.position };
  
  switch (direction) {
    case 'left':
      newPosition.x -= 1;
      break;
    case 'right':
      newPosition.x += 1;
      break;
    case 'down':
      newPosition.y += 1;
      break;
  }
  
  return { ...piece, position: newPosition };
};

export const rotatePiece = (piece: Piece): Piece => {
  return { ...piece, rotation: (piece.rotation + 1) % 4 };
};

export const hardDrop = (board: Board, piece: Piece): Piece => {
  let newPiece = { ...piece };
  
  while (isValidPosition(board, newPiece, { x: newPiece.position.x, y: newPiece.position.y + 1 })) {
    newPiece.position.y += 1;
  }
  
  return newPiece;
};

export const isGameOver = (board: Board, piece: Piece): boolean => {
  return !isValidPosition(board, piece, piece.position);
};

export const getGhostPiecePosition = (board: Board, piece: Piece): Position => {
  const ghostPiece = hardDrop(board, piece);
  return ghostPiece.position;
};

export const initializeFullGameState = () => {
  const currentPiece = getRandomPiece();
  const nextPiece = getRandomPiece();
  
  return {
    board: createEmptyBoard(),
    currentPiece,
    nextPiece,
    score: 0,
    level: 0,
    lines: 0,
    status: 'idle' as GameState,
    clearingLines: []
  };
};

export const updateGameStats = (stats: any, linesCleared: number, level: number): any => {
  const scoreGained = calculateScore(linesCleared, level);
  const newTotalLines = stats.lines + linesCleared;
  const newLevel = calculateLevel(newTotalLines);
  
  return {
    score: stats.score + scoreGained,
    level: newLevel,
    lines: newTotalLines
  };
};

// Additional functions needed by useTetris hook
export const isValidMove = (board: Board, piece: Piece, position: Position): boolean => {
  return isValidPosition(board, piece, position);
};

export const placePiece = (board: Board, piece: Piece, position: Position): Board => {
  const pieceWithPosition = { ...piece, position };
  return placePieceOnBoard(board, pieceWithPosition);
};

export const getLevel = (totalLines: number): number => {
  return calculateLevel(totalLines);
};

export const getDropInterval = (level: number): number => {
  return calculateFallSpeed(level);
};