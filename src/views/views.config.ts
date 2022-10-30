import { Coordinates, Size } from '../utils';

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
