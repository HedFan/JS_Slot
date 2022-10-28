import { repeat } from './toolControls';

export function createSprites(): void {
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/2xBAR.png'), 'symbol-2-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/3xBAR.png'), 'symbol-3-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/BAR.png'), 'symbol-1-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/7.png'), 'symbol-7');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/Cherry.png'), 'symbol-cherry');

  const buttonsTexture = PIXI.Texture.from('resources/spinButton.png');

  let width = 150;
  let height = 150;
  repeat(2).map((index) => {
    const buttonName = index === 0 ? 'un-active-button' : 'active-button';
    const texture = new PIXI.Texture(
      buttonsTexture.baseTexture,
      new PIXI.Rectangle(width * index + index * 55, 0, width, height),
      buttonsTexture.orig,
      buttonsTexture.trim
    );
    PIXI.Texture.addToCache(texture, buttonName);
  });
}

export function fromCacheAsTexture(textureName: string): PIXI.Texture {
  return PIXI.utils.TextureCache[textureName];
}

export function fromCacheAsSprite(textureName: string): PIXI.Sprite {
  return new PIXI.Sprite(fromCacheAsTexture(textureName));
}
