export const REEL_SYMBOLS = ['symbol-3-bar', 'symbol-1-bar', 'symbol-2-bar', 'symbol-7', 'symbol-cherry'];

export interface PaylineConfig {
  readonly index: number;
  readonly line: number;
  readonly winAmount: number;
  readonly paytableIndex: number;
  readonly symbol?: string;
  readonly multipleSymbols?: Array<string>;
  readonly quantity?: number;
}

export const paylinesConfig: ReadonlyArray<PaylineConfig> = [
  {
    index: 0,
    line: 2,
    symbol: 'symbol-cherry',
    quantity: 3,
    winAmount: 4000,
    paytableIndex: 0
  },
  {
    index: 1,
    line: 0,
    symbol: 'symbol-cherry',
    quantity: 3,
    winAmount: 2000,
    paytableIndex: 1
  },
  {
    index: 2,
    line: 1,
    symbol: 'symbol-cherry',
    quantity: 3,
    winAmount: 1000,
    paytableIndex: 2
  },
  {
    index: 3,
    line: 0,
    symbol: 'symbol-7',
    quantity: 3,
    winAmount: 150,
    paytableIndex: 3
  },
  {
    index: 4,
    line: 1,
    symbol: 'symbol-7',
    quantity: 3,
    winAmount: 150,
    paytableIndex: 3
  },
  {
    index: 5,
    line: 2,
    symbol: 'symbol-7',
    quantity: 3,
    winAmount: 150,
    paytableIndex: 3
  },
  {
    index: 6,
    line: 0,
    multipleSymbols: ['symbol-7', 'symbol-cherry'],
    winAmount: 75,
    paytableIndex: 4
  },
  {
    index: 7,
    line: 1,
    multipleSymbols: ['symbol-7', 'symbol-cherry'],
    winAmount: 75,
    paytableIndex: 4
  },
  {
    index: 8,
    line: 2,
    multipleSymbols: ['symbol-7', 'symbol-cherry'],
    winAmount: 75,
    paytableIndex: 4
  },
  {
    index: 9,
    line: 0,
    symbol: 'symbol-3-bar',
    quantity: 3,
    winAmount: 50,
    paytableIndex: 5
  },
  {
    index: 10,
    line: 1,
    symbol: 'symbol-3-bar',
    quantity: 3,
    winAmount: 50,
    paytableIndex: 5
  },
  {
    index: 11,
    line: 2,
    symbol: 'symbol-3-bar',
    quantity: 3,
    winAmount: 50,
    paytableIndex: 5
  },
  {
    index: 12,
    line: 0,
    symbol: 'symbol-2-bar',
    quantity: 3,
    winAmount: 20,
    paytableIndex: 6
  },
  {
    index: 13,
    line: 1,
    symbol: 'symbol-2-bar',
    quantity: 3,
    winAmount: 20,
    paytableIndex: 6
  },
  {
    index: 14,
    line: 2,
    symbol: 'symbol-2-bar',
    quantity: 3,
    winAmount: 20,
    paytableIndex: 6
  },
  {
    index: 15,
    line: 0,
    symbol: 'symbol-1-bar',
    quantity: 3,
    winAmount: 10,
    paytableIndex: 7
  },
  {
    index: 16,
    line: 1,
    symbol: 'symbol-1-bar',
    quantity: 3,
    winAmount: 10,
    paytableIndex: 7
  },
  {
    index: 17,
    line: 2,
    symbol: 'symbol-1-bar',
    quantity: 3,
    winAmount: 10,
    paytableIndex: 7
  },
  {
    index: 18,
    line: 1,
    symbol: 'symbol-1-bar',
    quantity: 1,
    winAmount: 5,
    paytableIndex: 8
  }
];
