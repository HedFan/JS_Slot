import { Container } from 'pixi.js';

import { GarbageBag } from '../components';
import { createSprites, unwrap } from '../utils';
import { SlotMachine } from '../components/slot-machine/slot-machine';

export class AppView extends Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();

  private _slotMachine: SlotMachine | undefined;

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();

      this._slotMachine = new SlotMachine();

      this.addChild(this.slotMachine);

      this._garbageBag.add(this.slotMachine);

      resolve();
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  get slotMachine(): SlotMachine {
    return unwrap(this._slotMachine, 'this._slotMachine is undefined');
  }
}
