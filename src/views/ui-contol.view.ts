import { Subject, Observable, fromEvent } from 'rxjs';
import { Container, Sprite, Text } from 'pixi.js';

import { ButtonState } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { fromCacheAsSprite, createButton, Coordinates } from '../utils';

const BALANCE_POSITION: Coordinates = {
  x: 150,
  y: 400
};
export class UiControlView extends Container implements GarbageCollect {
  readonly name = 'ui-control-container';
  private readonly _garbageBag = new GarbageBag();

  private readonly _clickSpinButtonSubject$ = new Subject<void>();
  private readonly _spinButton: Sprite;
  private readonly _unActiveSpinButton: Sprite;
  private readonly _balanceContainer = new Container();
  private readonly _dynamicText: Text;
  private readonly _messageText: Text;
  private _currentStateButton: ButtonState;

  constructor() {
    super();
    const FontFaceObserver = require('fontfaceobserver');
    const font = new FontFaceObserver('Output Sans', {
      weight: 300,
      style: 'italic'
    });

    const scaleSet = Math.min(window.innerWidth / 1500, 1);
    this._spinButton = createButton('active-button', 150, 150);
    this._spinButton.position.set(150, 450);
    this._spinButton.scale.set(scaleSet);

    this._unActiveSpinButton = fromCacheAsSprite('un-active-button');
    this._unActiveSpinButton.position.set(150, 450);
    this._unActiveSpinButton.scale.set(scaleSet);
    this._unActiveSpinButton.visible = false;
    this._currentStateButton = ButtonState.ACTIVE;

    const balanceText = new Text('Balance:', { fill: 0xffffff, fontSize: 20 });

    // todo make it bitmap
    this._dynamicText = new Text('100', { fill: 0xffffff, fontSize: 20 });
    this._dynamicText.x = 90;
    this._messageText = new Text('Update your balance', { fill: 0xcf2f27, fontSize: 20 });
    this._messageText.y = 25;
    this._messageText.visible = false;

    this._balanceContainer.addChild(balanceText, this._dynamicText, this._messageText);
    this._balanceContainer.position.copyFrom(BALANCE_POSITION);
    const clickButton$ = fromEvent(this._spinButton, 'pointerdown');

    this._garbageBag.completable$(clickButton$).subscribe(() => {
      this.updateButtonState();
      this.updateBalance(-1);
      this._clickSpinButtonSubject$.next();

      // if (this._currentPage) {
      //   this._startAnimationSubject$.next({ action: ButtonAction.START_ANIMATION, state: this._currentPage });
      // }
    });

    this.addChild(this._spinButton);
    this.addChild(this._unActiveSpinButton);
    this.addChild(this._balanceContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  toggleButtonState(): void {
    this.updateButtonState();
  }

  updateBalance(text: number): void {
    const amount = Number(this._dynamicText.text) + text;
    this._dynamicText.text = amount.toString();
  }

  get clickSpinButton$(): Observable<void> {
    return this._clickSpinButtonSubject$;
  }

  get currentState() {
    return this._currentStateButton;
  }

  private updateButtonState(): void {
    if (Number(this._dynamicText.text) === 0) {
      this._messageText.visible = true;
      return;
    }
    const isActive = this._currentStateButton === ButtonState.ACTIVE;
    this._spinButton.visible = !isActive;
    this._unActiveSpinButton.visible = isActive;
    this._currentStateButton = isActive ? ButtonState.UN_ACTIVE : ButtonState.ACTIVE;
  }
}
