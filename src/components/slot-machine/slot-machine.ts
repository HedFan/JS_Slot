import { Container, Graphics } from 'pixi.js';
import { Sprite } from 'pixi.js-legacy';

const TWEEN = require('@tweenjs/tween.js');

import { repeat, fromCacheAsSprite, getRandom, unwrap, mod, roundToNearest } from '../../utils';
import { GarbageBag, GarbageCollect } from '../garbage-bag';
import {
  MASK_SIZE,
  MASK_POSITION,
  REEL_STRIPES,
  REEL_POSITION,
  STRIPE_GRAPHIC_PARAMETERS,
  SLOT_CONFIG,
  SLOT_SIZE,
  SLOT_CONTAINER_Y_POSITION
} from './slot-machine.config';
import { Observable, Subject } from 'rxjs';

export class SlotMachine extends Container implements GarbageCollect {
  readonly name = 'slot-machine-container';

  private readonly _garbageBag = new GarbageBag();
  private readonly _reelsContainer = new Container();
  private readonly _spinCompleteSubject$ = new Subject<{ data?: Array<number> }>();
  private _reelsStripe = new Map<number, Array<PIXI.Sprite>>();
  private _animationRunning = false;
  private _requestAnimation: number | undefined;

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

  spin(result?: Array<number>): Promise<void> {
    const allDone = new Array<Promise<void>>();
    this._animationRunning = true;
    this._requestAnimation = requestAnimationFrame(this.spinAnimate);
    repeat(3).map((index) => {
      const reelStripe: Array<Sprite> = unwrap(
        this._reelsStripe.get(index),
        `this._reelsStripe.get(${index}) is undefined`
      );
      allDone.push(this.startSpin(reelStripe, index, result));
    });
    return new Promise((resolve) =>
      Promise.all(allDone).then(() => {
        this._animationRunning = false;
        this._spinCompleteSubject$.next({});
        resolve();
      })
    );
  }

  get spinComplete$(): Observable<{ data?: Array<number> }> {
    return this._spinCompleteSubject$;
  }

  private startSpin(reelStripe: Array<Sprite>, index: number, result?: Array<number>): Promise<void> {
    const { spinDuration, spinSpeed, spinDelay } = SLOT_CONFIG;
    // todo
    const randomSpeed = getRandom(5, 6);
    const timeOnStop = spinDuration - (2 - index) * spinDelay;
    const timeOnSpin = spinDuration * spinSpeed * randomSpeed - (2 - index) * spinDelay;

    return new Promise<void>((resolve) => {
      new TWEEN.Tween({ time: 0 })
        .to({ time: timeOnSpin }, timeOnStop)
        .onUpdate(({ time }: { time: number }) => {
          this.updateSlotPosition(reelStripe, time);
        })
        .onComplete(() => {
          this.showResult(reelStripe, result).then(() => resolve());
        })
        .start();
    });
  }

  private showResult(reelStripe: Array<Sprite>, result?: Array<number>): Promise<void> {
    const { spinDelay } = SLOT_CONFIG;
    const timeOnSpin = spinDelay + (Math.random() < 0.5 ? 0 : 100);
    return new Promise<void>((resolve) => {
      new TWEEN.Tween({ time: 0 })
        .to({ time: timeOnSpin }, timeOnSpin)
        .easing(TWEEN.Easing.Back.Out)
        .onUpdate(({ time }: { time: number }) => {
          this.updateSlotPosition(reelStripe, time);
        })
        .onComplete(() => {
          resolve();
        })
        .start();
    });
  }

  private updateSlotPosition(reelStripe: Array<Sprite>, time: number): void {
    const { spinSpeed } = SLOT_CONFIG;
    const { width } = SLOT_SIZE;
    reelStripe.forEach((slot, slotIndex) => {
      const startYPosition = slotIndex * width;
      slot.y = mod(time * spinSpeed + startYPosition, reelStripe.length * width);
    });
  }

  private buildReelStripe(): void {
    const { width } = SLOT_SIZE;
    repeat(3).map((stripeIndex) => {
      const graphicStripe = this.drawStripe();
      const reelStripe = new Array<PIXI.Sprite>();
      const slotsContainer = new Container();
      slotsContainer.addChild(graphicStripe);
      const randomIndex = getRandom(0, REEL_STRIPES.length - 1);
      const newStripes = REEL_STRIPES.slice(randomIndex).concat(REEL_STRIPES.slice(0, randomIndex));
      newStripes.forEach((slotName, slotIndex) => {
        const element = fromCacheAsSprite(slotName);
        element.anchor.set(0.5, 0.5);
        element.position.set(width / 2, slotIndex * width);
        element.name = slotName;

        slotsContainer.addChild(element);
        reelStripe.push(element);
      });
      slotsContainer.position.set(stripeIndex * width + 5, SLOT_CONTAINER_Y_POSITION);
      this._reelsContainer.addChild(slotsContainer);
      this._reelsStripe.set(stripeIndex, reelStripe);
    });
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
