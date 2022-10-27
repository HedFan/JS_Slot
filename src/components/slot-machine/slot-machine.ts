import { GarbageBag, GarbageCollect } from '../garbage-bag';

export class SlotMachine extends PIXI.Container implements GarbageCollect {
  readonly name = 'slot-machine-container';
  private readonly _garbageBag = new GarbageBag();

  constructor() {
    super();
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }
}
