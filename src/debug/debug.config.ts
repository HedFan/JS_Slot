import { Coordinates, Size } from '../utils';

export interface GuiInfo {
  readonly balance: number;
  readonly save: () => void;
  readonly reels: number;
}

export interface ReelFolder {
  readonly reelIndex: number;
  readonly symbol: SymbolName;
  readonly position: PositionType;
}

export const enum PositionType {
  TOP,
  MIDDLE,
  BOTTOM
}

export const enum SymbolName {
  BAR = 'symbol-1-bar',
  BARx2 = 'symbol-2-bar',
  BARx3 = 'symbol-3-bar',
  SEVEN = 'symbol-7',
  CHERRY = 'symbol-cherry'
}
export const TEXT_STYLE = {
  fill: 0x364955,
  fontSize: 15
};
export const POSITION: Coordinates = {
  x: 0,
  y: 550
};
export const RESULT_POSITION: Coordinates = {
  x: 55,
  y: 13
};
export const DEBUG_CONTAINER_POSITION: Coordinates = {
  x: 5,
  y: 55
};
export const DEBUG_BUTTON: Coordinates = {
  x: 5,
  y: 5
};
export const BACKGROUND_SIZE: Size = {
  width: 450,
  height: 54
};
export const BUTTON_SIZE: Size = {
  width: 175,
  height: 172
};
export const BUTTON_SCALE: number = 0.25;
export const BACKGROUND_HEIGHT: number = 180;
