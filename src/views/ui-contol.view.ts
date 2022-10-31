import { Subject, Observable, fromEvent } from 'rxjs';
import { Container, Sprite, Text } from 'pixi.js-legacy';

import { GarbageBag, GarbageCollect } from '../components';
import { fromCacheAsSprite, createButton } from '../utils';
import {
  BALANCE_POSITION,
  ButtonState,
  WIN_POSITION,
  SPIN_BUTTON_POSITION,
  SPIN_BUTTON_SIZE,
  BALANCE_TEXT_X_POSITION,
  MESSAGE_Y_POSITION,
  WIN_TEXT_X_POSITION
} from './views.config';
import { WinResultData } from '../model';

export class UiControlView extends Container implements GarbageCollect {
  readonly name = 'ui-control-container';
  private readonly _garbageBag = new GarbageBag();

  private readonly _clickSpinButtonSubject$ = new Subject<void>();
  private readonly _spinButton: Sprite;
  private readonly _unActiveSpinButton: Sprite;
  private readonly _dynamicBalanceText: Text;
  private readonly _messageText: Text;
  private readonly _dynamicWinText: Text;
  private _currentStateButton: ButtonState;

  constructor() {
    super();

    this.position.set(60, -30);
    const { width, height } = SPIN_BUTTON_SIZE;
    this._spinButton = createButton('active-button', width, height);
    this._spinButton.position.copyFrom(SPIN_BUTTON_POSITION);
    this._spinButton.scale.set(0.5);

    this._unActiveSpinButton = fromCacheAsSprite('un-active-button');
    this._unActiveSpinButton.position.copyFrom(SPIN_BUTTON_POSITION);
    this._unActiveSpinButton.scale.set(0.5);
    this._unActiveSpinButton.visible = false;
    this._currentStateButton = ButtonState.ACTIVE;

    const balanceText = new Text('Balance:', { fill: 0xffffff, fontSize: 20 });

    this._dynamicBalanceText = new Text('100', { fill: 0xffffff, fontSize: 20 });
    this._dynamicBalanceText.x = BALANCE_TEXT_X_POSITION;

    this._messageText = new Text('Update your balance', { fill: 0xcf2f27, fontSize: 20 });
    this._messageText.y = MESSAGE_Y_POSITION;
    this._messageText.visible = false;

    const balanceContainer = new Container();
    balanceContainer.addChild(balanceText, this._dynamicBalanceText, this._messageText);
    balanceContainer.position.copyFrom(BALANCE_POSITION);

    // todo make it bitmap
    this._dynamicWinText = new Text('0', { fill: 0xffffff, fontSize: 20 });
    this._dynamicWinText.x = WIN_TEXT_X_POSITION;
    const winText = new Text('Win:', { fill: 0xffffff, fontSize: 20 });

    const winContainer = new Container();
    winContainer.addChild(winText, this._dynamicWinText);
    winContainer.position.copyFrom(WIN_POSITION);

    const clickButton$ = fromEvent(this._spinButton, 'pointerdown');
    this._garbageBag.completable$(clickButton$).subscribe(() => {
      this._clickSpinButtonSubject$.next();
    });

    this.addChild(this._spinButton);
    this.addChild(this._unActiveSpinButton);
    this.addChild(balanceContainer);
    this.addChild(winContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  toggleButtonState(): void {
    this.updateButtonState();
  }

  updateBalance(winData: number | string | Array<WinResultData>): void {
    if (typeof winData === 'string') {
      this._dynamicBalanceText.text = winData;
      if (this._currentStateButton === ButtonState.UN_ACTIVE) {
        this.updateButtonState();
      }
      return;
    }
    let amount = 0;
    if (typeof winData === 'number') {
      amount = winData;
    } else if (winData.length) {
      winData.forEach((value) => (amount += value.winAmount));
      this.updateWin(amount);
    }
    this._dynamicBalanceText.text = (Number(this._dynamicBalanceText.text) + amount).toString();
  }

  updateStateButton(): void {
    this.updateButtonState();
    this.updateBalance(-1);
    this.updateWin(0);
  }

  get clickSpinButton$(): Observable<void> {
    return this._clickSpinButtonSubject$;
  }

  private updateButtonState(): void {
    if (Number(this._dynamicBalanceText.text) === 0) {
      this._messageText.visible = true;
      return;
    }
    this._messageText.visible = false;
    const isActive = this._currentStateButton === ButtonState.ACTIVE;
    this._spinButton.visible = !isActive;
    this._unActiveSpinButton.visible = isActive;
    this._currentStateButton = isActive ? ButtonState.UN_ACTIVE : ButtonState.ACTIVE;
  }

  private updateWin(text: number): void {
    this._dynamicWinText.text = text.toString();
  }
}
