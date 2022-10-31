import { Texture, Sprite, Rectangle } from 'pixi.js-legacy';

import { repeat } from './toolControls';
import { Size } from './commonInterfaces';

export function createSprites(): void {
  Texture.addToCache(Texture.from('resources/2xBAR.png'), 'symbol-2-bar');
  Texture.addToCache(Texture.from('resources/3xBAR.png'), 'symbol-3-bar');
  Texture.addToCache(Texture.from('resources/BAR.png'), 'symbol-1-bar');
  Texture.addToCache(Texture.from('resources/7.png'), 'symbol-7');
  Texture.addToCache(Texture.from('resources/Cherry.png'), 'symbol-cherry');
  Texture.addToCache(Texture.from('resources/background.png'), 'debug-background');

  buildButtonTexture({ width: 150, height: 150 }, 'spinButton', 55, 'un-active-button', 'active-button');
  buildButtonTexture({ width: 176, height: 172 }, 'toggleButton', 44, 'on-button', 'off-button');
}

export function fromCacheAsTexture(textureName: string): Texture {
  return PIXI.utils.TextureCache[textureName];
}

export function fromCacheAsSprite(textureName: string): Sprite {
  return new Sprite(fromCacheAsTexture(textureName));
}

function buildButtonTexture(
  size: Size,
  assetName: string,
  multiple: number,
  firstName: string,
  secondName: string
): void {
  const buttonsTexture = Texture.from(`resources/${assetName}.png`);
  const { width, height } = size;
  repeat(2).map((index) => {
    const buttonName = index === 0 ? firstName : secondName;
    const texture = new Texture(
      buttonsTexture.baseTexture,
      new Rectangle(width * index + index * multiple, 0, width, height),
      buttonsTexture.orig,
      buttonsTexture.trim
    );
    Texture.addToCache(texture, buttonName);
  });
}
