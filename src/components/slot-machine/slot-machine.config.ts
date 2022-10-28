import { Coordinates, Size } from '../../utils';

// 0
// 70
// 140

// 210
// 140
// 280
// 350

// 490
// 560
// 630
export const SLOT_SIZE: Size = {
  width: 141,
  height: 121
};
export const SLOT_CONTAINER_Y_POSITION = -105;
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
  y: 125,
  width: 135,
  height: 310,
  radius: 120
};
export const SLOT_CONFIG = {
  spinDuration: 2000,
  spinSpeed: 0.7,
  spinDelay: 500
};

export const REEL_STRIPES = ['symbol-3-bar', 'symbol-1-bar', 'symbol-2-bar', 'symbol-7', 'symbol-cherry'];
