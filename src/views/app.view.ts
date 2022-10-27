import { GarbageBag } from '../components';
import { createSprites } from '../utils';

export class AppView extends PIXI.Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();
      resolve();
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }
}
