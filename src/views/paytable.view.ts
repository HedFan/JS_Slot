import { Container, Graphics, Sprite, Text } from 'pixi.js-legacy';
import TWEEN from '@tweenjs/tween.js';
import { Tween } from '@tweenjs/tween.js';

import { repeat, fromCacheAsSprite, Size } from '../utils';
import { GarbageBag, GarbageCollect } from '../components';
import {
  BACKGROUND_SYMBOL_SIZE,
  BACKGROUND_SYMBOL_ALPHA,
  PAYTABLE_POSITION,
  PAYTABLE_VIEW_DATA,
  SIGN_POSITION,
  SIGN_BACKGROUND_POSITION,
  BACKGROUND_AMOUNT_SIZE,
  AMOUNT_WIN_POSITION,
  ANCHOR,
  TEXT_STYLE,
  TITLE_X_POSITION,
  PAYTABLE_CONTAINER_Y_POSITION,
  BLINK_DURATION,
  BLINK_DELAY
} from './views.config';

import { WinResultData } from '../model';

export class PaytableView extends Container implements GarbageCollect {
  readonly name = 'paytable-container';

  private readonly _garbageBag = new GarbageBag();
  private readonly _paytableContainer = new Container();
  private readonly _backgroundArray = new Array<Graphics>();
  private _tweenAnimation: Tween<{ alpha: number }> | undefined;
  private _winBackgroundArray = new Array<Graphics>();
  private _requestAnimation: number | undefined;
  private _animationRunning = false;

  constructor() {
    super();

    this.position.copyFrom(PAYTABLE_POSITION);
    const titleText = new Text('PAYTABLE:', { ...TEXT_STYLE, fill: 0xe5b35a, fontSize: 40 });
    titleText.x = TITLE_X_POSITION;

    this.buildPaytable();
    this._paytableContainer.y = PAYTABLE_CONTAINER_Y_POSITION;
    this.addChild(titleText);
    this.addChild(this._paytableContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
    this.cancelAnimationListener();
    this.cancelTweenAnimation();
  }

  stopBlinking(): void {
    if (!this._winBackgroundArray.length) {
      return;
    }
    this.cancelAnimationListener();
    this.cancelTweenAnimation();
    this._winBackgroundArray.forEach((background) => {
      background.visible = false;
      background.alpha = 1;
    });
    this._winBackgroundArray = [];
  }

  startBlinking(winData: Array<WinResultData>): void {
    if (!winData.length) {
      return;
    }
    this._animationRunning = true;
    this._requestAnimation = requestAnimationFrame(this.spinAnimate);

    winData.forEach((value) => {
      this._winBackgroundArray.push(this._backgroundArray[value.paytableIndex]);
    });
    this.blinkAnimation();
  }

  private blinkAnimation(): void {
    this._winBackgroundArray.forEach((item) => (item.visible = true));
    this._tweenAnimation = new TWEEN.Tween({ alpha: 1 })
      .to({ alpha: 0.5 }, BLINK_DURATION)
      .onUpdate(({ alpha }: { alpha: number }) => {
        this._winBackgroundArray.forEach((item) => (item.alpha = alpha));
      })
      .delay(BLINK_DELAY)
      .yoyo(true)
      .repeat(Infinity);
    this._tweenAnimation.start();
  }

  private buildPaytable(): void {
    PAYTABLE_VIEW_DATA.forEach((data, dataIndex) => {
      const { winAmount, symbolName, multipleSymbolNames, textPosition, symbolWithText, specialSign } = data;
      const plateContainer = new Container();
      const background = this.drawBackground(BACKGROUND_SYMBOL_SIZE, BACKGROUND_SYMBOL_ALPHA);
      plateContainer.addChild(background);
      if (specialSign) {
        const signText = new Text(specialSign, { ...TEXT_STYLE, fontSize: 13 });
        signText.position.copyFrom(SIGN_POSITION);
        const signBackground = new Graphics();
        const { x, y } = SIGN_BACKGROUND_POSITION;
        signBackground.beginFill(0x48213f).drawRect(x, y, signText.width + 9, 19);
        signBackground.endFill();
        signBackground.addChild(signText);
        plateContainer.addChild(signBackground);
      }
      if (symbolName) {
        repeat(3).map((index) => {
          const symbol = this.createSprite(symbolName, index, 0.4, 35, 25);
          plateContainer.addChild(symbol);
        });
      } else if (multipleSymbolNames && textPosition) {
        const anyText = new Text('ANY', { ...TEXT_STYLE, fontSize: 18 });
        anyText.position.copyFrom(textPosition);
        plateContainer.addChild(anyText);
        multipleSymbolNames.forEach((multipleSymbol, index) => {
          const symbol = this.createSprite(multipleSymbol, index, 0.4, 92, 25);
          plateContainer.addChild(symbol);
        });
      } else if (symbolWithText && textPosition) {
        const { x, y } = textPosition;
        repeat(3).map((index) => {
          const anyText = new Text('ANY', { ...TEXT_STYLE, fontSize: 11 });
          anyText.x = x * index + 22;
          anyText.y = y;
          plateContainer.addChild(anyText);
          const symbol = this.createSprite(symbolWithText, index, 0.37, 35, 30);
          plateContainer.addChild(symbol);
        });
      }

      const amountBackground = this.drawBackground(BACKGROUND_AMOUNT_SIZE, 1);
      const winBackground = this.drawBackground(BACKGROUND_AMOUNT_SIZE, 1, 0xa55921);
      winBackground.visible = false;
      amountBackground.x = winBackground.x = BACKGROUND_SYMBOL_SIZE.width;
      const winAmountText = new Text(winAmount.toString(), { ...TEXT_STYLE, fontSize: 29 });
      winAmountText.position.copyFrom(AMOUNT_WIN_POSITION);
      winAmountText.anchor.set(ANCHOR);
      plateContainer.addChild(amountBackground, winBackground, winAmountText);
      this._backgroundArray.push(winBackground);

      plateContainer.position.y = 60 * dataIndex;
      this._paytableContainer.addChild(plateContainer);
    });
  }

  private drawBackground(size: Size, alpha: number, color = 0x3b3a3b): Graphics {
    const background = new Graphics();
    const { width, height } = size;
    background.beginFill(color).drawRect(0, 0, width, height);
    background.endFill();
    background.alpha = alpha;
    return background;
  }

  private createSprite(symbolName: string, index: number, scale: number, widthGap: number, y: number): Sprite {
    const symbol = fromCacheAsSprite(symbolName);
    symbol.anchor.set(ANCHOR);
    symbol.scale.set(scale);
    symbol.x = 55 * index + widthGap;
    symbol.y = y;
    return symbol;
  }

  private readonly spinAnimate = (time: number) => {
    if (!this._animationRunning) {
      return;
    }
    TWEEN.update(time);
    window.requestAnimationFrame(this.spinAnimate);
  };

  private cancelAnimationListener(): void {
    this._animationRunning = false;
    if (this._requestAnimation !== undefined) {
      cancelAnimationFrame(this._requestAnimation);
    }
  }

  private cancelTweenAnimation(): void {
    if (this._tweenAnimation !== undefined) {
      this._tweenAnimation.stop();
      this._tweenAnimation = undefined;
    }
  }
}
