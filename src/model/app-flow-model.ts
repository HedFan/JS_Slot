import { injectable } from 'inversify';

import { GarbageBag, GarbageCollect } from '../components/garbage-bag';

@injectable()
export class AppFlowModel implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();

  constructor() {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }
}
