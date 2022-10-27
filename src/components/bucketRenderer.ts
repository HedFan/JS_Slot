import { injectable } from 'inversify';

import { bucketConfig } from '../config';
import { GarbageBag, GarbageCollect } from '../components';
import { Coordinates, Size } from '../utils';

export interface BucketRenderConfig {
  readonly width: number;
  readonly height: number;
  readonly maxScale: number;
}

export interface BucketRenderPreferences {
  readonly devicePixelRatio: number;
  readonly bucketSize: Size;
  readonly bucketPosition: Coordinates;
  readonly screenSize: Size;
  readonly scaleRatio: number;
}

@injectable()
export class BucketRenderer implements BucketRenderPreferences, GarbageCollect {
  public readonly bucketScale: number;
  public readonly maxBucketScale: number;
  public readonly bucketSize: Size;
  public readonly devicePixelRatio: number;

  private readonly _garbageBag = new GarbageBag();
  private readonly _bucketConfig: BucketRenderConfig;
  private _currentScreenSize: Size = { width: window.innerWidth, height: window.innerHeight };

  constructor() {
    this._bucketConfig = bucketConfig;

    this.bucketSize = { width: bucketConfig.width, height: bucketConfig.height };
    this.maxBucketScale = bucketConfig.maxScale;
    this.devicePixelRatio = this.normalizeDevicePixelRatio();

    this.bucketScale = this.calculateBucketScale(bucketConfig, this.devicePixelRatio, {
      width: screen.width,
      height: screen.height
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  get screenScale(): number {
    const { xRatio, yRatio } = this.calculateScreenScale();
    return Math.min(xRatio, yRatio);
  }

  get screenSize(): Size {
    return this._currentScreenSize;
  }

  get bucketPosition(): Coordinates {
    const { width: screenWidth, height: screenHeight } = this.screenSize;

    const scaleRatio = this.scaleRatio;
    const gameWidth = screenWidth - this._bucketConfig.width * scaleRatio;
    const gameHeight = screenHeight - this._bucketConfig.height * scaleRatio;

    return {
      x: Math.round(gameWidth / 2),
      y: Math.round(gameHeight / 2)
    };
  }

  get scaleRatio(): number {
    return this.screenScale * this.bucketScale;
  }

  private normalizeDevicePixelRatio(): number {
    const devicePixelRatio = window.devicePixelRatio;
    let normalizedValue = Math.min(Math.floor(devicePixelRatio), 2);
    normalizedValue = Math.max(normalizedValue, 1);
    return normalizedValue;
  }

  private calculateBucketScale(bucket: BucketRenderConfig, devicePixelRatio: number, screenSize: Size): number {
    const size = Math.max(screenSize.width, screenSize.height);
    const { maxScale } = bucket;

    const base = bucket.width > bucket.height ? bucket.width : bucket.height;
    const scale = Math.max(Math.floor((devicePixelRatio / base) * size), 1);

    if (scale > maxScale) {
      return maxScale;
    }
    return scale;
  }

  private calculateScreenScale(): { readonly xRatio: number; readonly yRatio: number } {
    const { width: gameWidth, height: gameHeight } = this.screenSize;

    const parentXRatio = gameWidth / (this._bucketConfig.width * this.bucketScale);
    const parentYRatio = gameHeight / (this._bucketConfig.height * this.bucketScale);
    return { xRatio: parentXRatio, yRatio: parentYRatio };
  }
}
