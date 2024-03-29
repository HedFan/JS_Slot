import { Container } from 'pixi.js-legacy';

import { GarbageBag, SlotMachine } from '../components';
import { createSprites, unwrap } from '../utils';
import { UiControlView, PaylinesView, PaytableView } from './index';
import { DebugView } from '../debug';

export class AppView extends Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();

  private _slotMachine: SlotMachine | undefined;
  private _paylinesView: PaylinesView | undefined;
  private _uiControlView: UiControlView | undefined;
  private _paytableView: PaytableView | undefined;
  // debug
  private _debugView: DebugView | undefined;

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();
      this._slotMachine = new SlotMachine();
      this._paylinesView = new PaylinesView();
      this._uiControlView = new UiControlView();
      this._paytableView = new PaytableView();

      this.addChild(this.paylinesView.reelBackgroundContainer);
      this.addChild(this.slotMachine);
      this.addChild(this.paylinesView.paylinesContainer);
      this.addChild(this.uiControlView);
      this.addChild(this.paytableView);

      this._garbageBag.add(this.slotMachine);
      this._garbageBag.add(this.uiControlView);
      this._garbageBag.add(this.paylinesView);
      this._garbageBag.add(this.paylinesView);

      // debug
      this._debugView = new DebugView();
      this.addChild(this.debugView);
      this._garbageBag.add(this._debugView);

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

  get paytableView(): PaytableView {
    return unwrap(this._paytableView, 'this._paytableView is undefined');
  }

  // debug
  get debugView(): DebugView {
    return unwrap(this._debugView, 'this._debugView is undefined');
  }
}
