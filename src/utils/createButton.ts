import { Sprite, Rectangle } from 'pixi.js-legacy';

import { fromCacheAsTexture } from './createSprites';

export const createButton = (textureName: string, width: number, height: number): PIXI.Sprite => {
  const buttonTexture = fromCacheAsTexture(textureName);
  const button = new Sprite(buttonTexture);
  button.interactive = true;
  button.buttonMode = true;
  button.hitArea = new Rectangle(0, 0, width, height);
  return button;
};
