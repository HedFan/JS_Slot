import { Container, Graphics } from 'pixi.js';
import { Sprite } from 'pixi.js-legacy';

const TWEEN = require('@tweenjs/tween.js');

import { repeat, fromCacheAsSprite, getRandom, unwrap, mod } from '../../utils';
import { GarbageBag, GarbageCollect } from '../garbage-bag';
import {
  MASK_SIZE,
  MASK_POSITION,
  REEL_POSITION,
  STRIPE_GRAPHIC_PARAMETERS,
  SLOT_CONFIG,
  SLOT_SIZE,
  MOVE_POSITIONS,
  SYMBOLS_CONTAINER_Y_POSITION,
  WinPosition
} from './slot-machine.config';
import { REEL_SYMBOLS } from './slot-machine.paytable';
import { Observable, Subject } from 'rxjs';

export class SlotMachine extends Container implements GarbageCollect {
  readonly name = 'slot-machine-container';

  private readonly _garbageBag = new GarbageBag();
  private readonly _reelsContainer = new Container();
  private readonly _sendResultSubject$ = new Subject<Map<number, WinPosition>>();
  private _reelsStripe = new Map<number, Container>();
  private _reelsSymbols = new Map<number, Array<Sprite>>();
  private _animationRunning = false;
  private _requestAnimation: number | undefined;
  private _winPositions = new Map<number, WinPosition>();

  constructor() {
    super();

    const { x, y } = MASK_POSITION;
    const { width, height } = MASK_SIZE;
    const mask = new Graphics();
    mask.beginFill(0x000000);
    mask.drawRect(x, y, width, height);
    mask.endFill();
    this.mask = mask;

    this._reelsContainer.position.copyFrom(REEL_POSITION);
    this.buildReelStripe();
    this.addChild(this._reelsContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  spin(result: Array<WinPosition> = []): Promise<void> {
    const allDone = new Array<Promise<void>>();
    this._animationRunning = true;
    this._requestAnimation = requestAnimationFrame(this.spinAnimate);
    repeat(3).map((index) => {
      const reelSymbols: Array<Sprite> = unwrap(
        this._reelsSymbols.get(index),
        `this._reelsSymbols.get(${index}) is undefined`
      );
      allDone.push(this.startSpin(reelSymbols, index, result[index]));
    });
    return new Promise((resolve) =>
      Promise.all(allDone).then(() => {
        this._animationRunning = false;
        this._sendResultSubject$.next(this._winPositions);
        resolve();
      })
    );
  }

  get sendResultComplete$(): Observable<Map<number, WinPosition>> {
    return this._sendResultSubject$;
  }

  private startSpin(reelSymbols: Array<Sprite>, stripeIndex: number, result?: WinPosition): Promise<void> {
    const { spinDuration, spinSpeed, spinDelay } = SLOT_CONFIG;
    const timeOnStop = spinDuration - (2 - stripeIndex) * spinDelay;
    const timeOnSpin = spinDuration * spinSpeed * getRandom(5, 6) - (2 - stripeIndex) * spinDelay;
    const reelStripe: Container = unwrap(
      this._reelsStripe.get(stripeIndex),
      `this._reelsStripe.get(${stripeIndex}) is undefined`
    );
    return new Promise<void>((resolve) => {
      new TWEEN.Tween({ time: 0 })
        .to({ time: timeOnSpin }, timeOnStop)
        .onStart(() => (reelStripe.y = SYMBOLS_CONTAINER_Y_POSITION))
        .onUpdate(({ time }: { time: number }) => {
          this.updateSlotPosition(reelSymbols, time);
        })
        .onComplete(() => {
          const newReelSymbols = this.setWinPosition(stripeIndex, reelSymbols, reelStripe, result);
          this.showResult(newReelSymbols).then(() => resolve());
        })
        .start();
    });
  }

  private showResult(reelSymbols: Array<Sprite>): Promise<void> {
    const { spinDelay } = SLOT_CONFIG;
    const timeOnSpin = spinDelay;
    return new Promise<void>((resolve) => {
      new TWEEN.Tween({ time: 0 })
        .to({ time: timeOnSpin }, timeOnSpin)
        .easing(TWEEN.Easing.Back.Out)
        .onUpdate(({ time }: { time: number }) => {
          this.updateSlotPosition(reelSymbols, time);
        })
        .onComplete(() => resolve())
        .start();
    });
  }

  private updateSlotPosition(reelStripe: Array<Sprite>, time: number): void {
    const { spinSpeed } = SLOT_CONFIG;
    const { height } = SLOT_SIZE;
    reelStripe.forEach((slot, slotIndex) => {
      const startYPosition = slotIndex * height;
      slot.y = mod(time * spinSpeed + startYPosition, reelStripe.length * height);
    });
  }

  private setWinPosition(
    stripeIndex: number,
    reelSymbols: Array<Sprite>,
    reelStripe: Container,
    result?: WinPosition
  ): Array<Sprite> {
    let symbolIndex: number;
    if (result) {
      const { positionOnReel, nameSymbol } = result;
      const winPosition: WinPosition = {
        nameSymbol,
        positionOnReel
      };
      symbolIndex = reelSymbols.map((symbol) => symbol.name).indexOf(nameSymbol);
      this._winPositions.set(stripeIndex, winPosition);
    } else {
      symbolIndex = getRandom(0, reelSymbols.length - 1);
      const winPosition: WinPosition = {
        positionOnReel: getRandom(0, 3),
        nameSymbol: reelSymbols[symbolIndex].name
      };
      this._winPositions.set(stripeIndex, winPosition);
    }
    const winPositions: WinPosition = unwrap(
      this._winPositions.get(stripeIndex),
      `this._winPositions.get(${stripeIndex}) is undefined`
    );
    const { positionOnReel } = winPositions;
    reelStripe.y = reelStripe.y - this.randomPosition(positionOnReel);

    return reelSymbols.slice(symbolIndex).concat(reelSymbols.slice(0, symbolIndex));
  }

  private buildReelStripe(): void {
    const { width, height } = SLOT_SIZE;
    repeat(3).map((stripeIndex) => {
      const graphicStripe = this.drawStripe();
      const reelSymbols = new Array<Sprite>();
      const symbolsContainer = new Container();

      const randomIndex = getRandom(0, REEL_SYMBOLS.length - 1);
      const newStripes = REEL_SYMBOLS.slice(randomIndex).concat(REEL_SYMBOLS.slice(0, randomIndex));
      newStripes.forEach((symbolName, symbolIndex) => {
        const symbol = fromCacheAsSprite(symbolName);
        symbol.anchor.set(0.5, 0.5);
        symbol.position.set(width / 2, symbolIndex * height);
        symbol.name = symbolName;
        console.log(symbol.position.y);

        symbolsContainer.addChild(symbol);
        reelSymbols.push(symbol);
      });
      graphicStripe.x = stripeIndex * width + 5;
      symbolsContainer.position.set(stripeIndex * width + 5, SYMBOLS_CONTAINER_Y_POSITION);
      this._reelsContainer.addChild(graphicStripe, symbolsContainer);
      this._reelsSymbols.set(stripeIndex, reelSymbols);
      this._reelsStripe.set(stripeIndex, symbolsContainer);
    });
  }

  private randomPosition(index: number): number {
    switch (index) {
      case 0:
        return MOVE_POSITIONS.TOP;
      case 2:
        return MOVE_POSITIONS.BOTTOM;
      default:
        return MOVE_POSITIONS.MIDDLE;
    }
  }

  private drawStripe(): Graphics {
    // todo think about this shape
    const stripe = new PIXI.Graphics();
    const { x, y, width, height, radius } = STRIPE_GRAPHIC_PARAMETERS;
    stripe.beginFill(0xffffff);
    stripe.drawRoundedRect(x, y, width, height, radius);
    stripe.endFill();
    return stripe;
  }

  private readonly spinAnimate = (time: number) => {
    if (!this._animationRunning) {
      return;
    }
    TWEEN.update(time);
    window.requestAnimationFrame(this.spinAnimate);
  };
}
