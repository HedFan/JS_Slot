import { Container } from 'pixi.js';

import { GarbageBag } from '../components';
import { createSprites, unwrap } from '../utils';
import { SlotMachine } from '../components/slot-machine/slot-machine';
import { UiControlView } from './ui-contol.view';

export class AppView extends Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();

  private _slotMachine: SlotMachine | undefined;
  private _uiControlView: UiControlView | undefined;

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();

      this._slotMachine = new SlotMachine();
      this._uiControlView = new UiControlView();

      this.addChild(this.slotMachine);
      this.addChild(this.uiControlView);

      this._garbageBag.add(this.slotMachine);
      this._garbageBag.add(this.uiControlView);

      resolve();
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  get slotMachine(): SlotMachine {
    return unwrap(this._slotMachine, 'this._slotMachine is undefined');
  }

  get uiControlView(): UiControlView {
    return unwrap(this._uiControlView, 'this._uiControlView is undefined');
  }
}
