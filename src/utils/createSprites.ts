export function createSprites(): void {
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/2xBAR.png'), 'symbol-2-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/3xBAR.png'), 'symbol-3-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/BAR.png'), 'symbol-1-bar');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/7.png'), 'symbol-7');
  PIXI.Texture.addToCache(PIXI.Texture.from('resources/Cherry.png'), 'symbol-cherry');
}

export function fromCacheAsTexture(textureName: string): PIXI.Texture {
  return PIXI.utils.TextureCache[textureName];
}

export function fromCacheAsSprite(textureName: string): PIXI.Sprite {
  return new PIXI.Sprite(fromCacheAsTexture(textureName));
}
