export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

export const GAME_SPEED = {
  INITIAL: 800,
  MIN: 50,
  DECREASE_RATE: 50
};

export const INITIAL_FALL_SPEED = 800;
export const LEVEL_SPEED_INCREASE = 50;

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

export const PIECE_COLORS = {
  I: '#00f5ff',
  O: '#ffff00',
  T: '#800080',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ffa500',
  GHOST: 'rgba(255, 255, 255, 0.3)',
  EMPTY: 'transparent'
};

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  SPACE: ' ',
  PAUSE: 'p',
  RESTART: 'r'
};

export const INITIAL_POSITION = {
  x: Math.floor(BOARD_WIDTH / 2) - 1,
  y: 0
};

export const LINES_PER_LEVEL = 10;

export const WALL_KICK_TESTS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [-1, -1],
  [1, -1]
];

// Tetromino piece shapes
export const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'I'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'O'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'T'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'S'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'Z'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'L'
  }
};

export const COLORS = PIECE_COLORS;