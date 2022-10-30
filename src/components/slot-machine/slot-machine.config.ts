import { Coordinates, Size } from '../../utils';

export interface WinPosition {
  readonly nameSymbol: string;
  readonly positionOnReel: number;
}

export const SLOT_SIZE: Size = {
  width: 141,
  height: 141
};
export enum MOVE_POSITIONS {
  TOP = SLOT_SIZE.height,
  MIDDLE = SLOT_SIZE.height / 2,
  BOTTOM = 0
}
export const SYMBOLS_CONTAINER_Y_POSITION = -105;
export const MASK_SIZE: Size = {
  width: 430,
  height: 300
};
export const MASK_POSITION: Coordinates = {
  x: 50,
  y: 30
};
export const REEL_POSITION: Coordinates = {
  x: 50,
  y: 0
};
export const STRIPE_GRAPHIC_PARAMETERS = {
  x: 2,
  y: 25,
  width: 135,
  height: 310,
  radius: 120
};
export const SLOT_CONFIG = {
  spinDuration: 2000,
  spinSpeed: 0.7,
  spinDelay: 500
};
