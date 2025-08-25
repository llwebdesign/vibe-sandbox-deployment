export interface Position {
  x: number;
  y: number;
}

export interface TetrominoShape {
  shape: number[][];
  color: string;
}

export interface Piece {
  type: string;
  shape: number[][];
  color: string;
  position: Position;
  rotation: number;
}

export interface Tetromino {
  shape: number[][];
  color: string;
  position: Position;
  rotation: number;
}

// Board is a 2D array of strings (0 for empty, piece type for filled)
export type Board = (string | number)[][];

export interface GameBoard {
  grid: (string | null)[][];
  width: number;
  height: number;
}

export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface FullGameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  lines: number;
  status: GameState;
  clearingLines: number[];
}

export interface GameStats {
  score: number;
  level: number;
  lines: number;
  pieces: number;
}

export interface Controls {
  moveLeft: string[];
  moveRight: string[];
  moveDown: string[];
  rotate: string[];
  hardDrop: string[];
  pause: string[];
  restart: string[];
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  initialDropTime: number;
  levelSpeedIncrease: number;
  pointsPerLine: number[];
  linesPerLevel: number;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type GameAction = 
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'MOVE_DOWN'
  | 'ROTATE'
  | 'HARD_DROP'
  | 'PAUSE'
  | 'RESUME'
  | 'RESTART'
  | 'START'
  | 'GAME_OVER';

export interface CollisionResult {
  collision: boolean;
  outOfBounds: boolean;
  pieceCollision: boolean;
}

export interface LineClearing {
  clearedLines: number[];
  newBoard: (string | null)[][];
  points: number;
}