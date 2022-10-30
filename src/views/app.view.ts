import { Container } from 'pixi.js';

import { GarbageBag, SlotMachine } from '../components';
import { createSprites, unwrap } from '../utils';
import { UiControlView, PaylinesView } from './index';

export class AppView extends Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();

  private _slotMachine: SlotMachine | undefined;
  private _paylinesView: PaylinesView | undefined;
  private _uiControlView: UiControlView | undefined;

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();

      this._slotMachine = new SlotMachine();
      this._paylinesView = new PaylinesView();
      this._uiControlView = new UiControlView();

      this.addChild(this.paylinesView.reelBackgroundContainer);
      this.addChild(this.slotMachine);
      this.addChild(this.paylinesView.paylinesContainer);
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

  get paylinesView(): PaylinesView {
    return unwrap(this._paylinesView, 'this._paylinesView is undefined');
  }

  get uiControlView(): UiControlView {
    return unwrap(this._uiControlView, 'this._uiControlView is undefined');
  }
}
