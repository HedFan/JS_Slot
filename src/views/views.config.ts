import { Coordinates, Size } from '../utils';

export const ANCHOR: number = 0.5;
export const SCALE: number = 0.5;
export const TEXT_STYLE = {
  fill: 0xffffff,
  fontSize: 18,
  fontWeight: 'bold',
  dropShadow: true
};

// paylines
export const LINES_Y_POSITIONS: Array<number> = [70, 144, 216];
export const LINES_X_POSITION: number = 6;
export const PAYLINES_POSITION: Coordinates = {
  x: 52,
  y: 30
};
export const STRIPE_GRAPHIC_CONFIG = {
  x: 0,
  y: 0,
  width: 135,
  height: 300,
  radius: 20
};
export const LINE_GRAPHIC_CONFIG = {
  width: 415,
  height: 2,
  bgColor: 0xffffff,
  winColor: 0xe83323
};

// ui control view
export const UI_VIEW_POSITION: Coordinates = {
  x: 60,
  y: -30
};
export const SPIN_BUTTON_SIZE: Size = {
  width: 150,
  height: 150
};
export const SPIN_BUTTON_POSITION: Coordinates = {
  x: 150,
  y: 450
};
export const BALANCE_TEXT_X_POSITION: number = 90;
export const WIN_TEXT_X_POSITION: number = 50;
export const MESSAGE_Y_POSITION: number = 25;
export const BALANCE_POSITION: Coordinates = {
  x: 55,
  y: 400
};
export const WIN_POSITION: Coordinates = {
  x: 250,
  y: 400
};
export const enum ButtonState {
  ACTIVE = 'active',
  UN_ACTIVE = 'un-active'
}

// paytable view
export const BLINK_DURATION: number = 500;
export const BLINK_DELAY: number = 200;
export const TITLE_X_POSITION: number = 20;
export const PAYTABLE_CONTAINER_Y_POSITION: number = 50;
export const PAYTABLE_POSITION: Coordinates = {
  x: 550,
  y: 20
};
export const BACKGROUND_SYMBOL_SIZE: Size = {
  width: 180,
  height: 50
};
export const BACKGROUND_AMOUNT_SIZE: Size = {
  width: 80,
  height: 50
};
export const BACKGROUND_SYMBOL_ALPHA: number = 0.55;
export const SIGN_POSITION: Coordinates = {
  x: -5,
  y: -5
};
export const SIGN_BACKGROUND_POSITION: Coordinates = {
  x: -11,
  y: -8
};
export const AMOUNT_WIN_POSITION: Coordinates = {
  x: 222,
  y: 28
};

export interface Paytable {
  readonly winAmount: number;
  readonly symbolName?: string;
  readonly multipleSymbolNames?: Array<string>;
  readonly symbolWithText?: string;
  readonly textPosition?: Coordinates;
  readonly specialSign?: string;
}

export const PAYTABLE_VIEW_DATA: Array<Paytable> = [
  {
    symbolName: 'symbol-cherry',
    winAmount: 4000,
    specialSign: 'BOTTOM'
  },
  {
    symbolName: 'symbol-cherry',
    winAmount: 2000,
    specialSign: 'TOP'
  },
  {
    symbolName: 'symbol-cherry',
    winAmount: 1000,
    specialSign: 'CENTRE'
  },
  {
    symbolName: 'symbol-7',
    winAmount: 150
  },
  {
    multipleSymbolNames: ['symbol-7', 'symbol-cherry'],
    textPosition: { x: 18, y: 15 },
    winAmount: 75
  },
  {
    symbolName: 'symbol-3-bar',
    winAmount: 50
  },
  {
    symbolName: 'symbol-2-bar',
    winAmount: 20
  },
  {
    symbolName: 'symbol-1-bar',
    winAmount: 10
  },
  {
    symbolWithText: 'symbol-1-bar',
    textPosition: { x: 55, y: 8 },
    winAmount: 5
  }
];
