import { Container, Graphics } from 'pixi.js-legacy';

import { repeat } from '../utils';
import { GarbageBag, GarbageCollect, SLOT_SIZE } from '../components';
import {
  LINES_X_POSITION,
  LINES_Y_POSITIONS,
  PAYLINES_POSITION,
  LINE_GRAPHIC_CONFIG,
  STRIPE_GRAPHIC_CONFIG
} from './views.config';
import { WinResultData } from '../model';

export class PaylinesView extends Container implements GarbageCollect {
  readonly name = 'paylines-container';

  private readonly _garbageBag = new GarbageBag();
  private readonly _reelBackgroundContainer = new Container();
  private readonly _paylinesContainer = new Container();
  private readonly _paylinesArray = new Array<Graphics>();

  constructor() {
    super();

    this._reelBackgroundContainer.position.copyFrom(PAYLINES_POSITION);
    this._paylinesContainer.position.copyFrom(PAYLINES_POSITION);
    this.buildReelBackground();

    this.addChild(this._reelBackgroundContainer);
    this.addChild(this._paylinesContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  hideAllLines(): void {
    this._paylinesArray.forEach((winLine) => (winLine.visible = false));
  }

  showWinLines(winData: Array<WinResultData>): void {
    if (!winData.length) {
      return;
    }
    winData.forEach((value) => (this._paylinesArray[value.lineIndex].visible = true));
  }

  get reelBackgroundContainer(): Container {
    return this._reelBackgroundContainer;
  }

  get paylinesContainer(): Container {
    return this._paylinesContainer;
  }

  private buildReelBackground(): void {
    repeat(3).map((reelIndex) => {
      const graphicStripe = this.drawReelBackground();
      const bgGraphicLine = this.drawLine(reelIndex);
      const winGraphicLine = this.drawLine(reelIndex, true);
      winGraphicLine.visible = false;
      graphicStripe.x = reelIndex * SLOT_SIZE.width + 5;

      this._reelBackgroundContainer.addChild(graphicStripe, bgGraphicLine);
      this._paylinesContainer.addChild(winGraphicLine);
      this._paylinesArray.push(winGraphicLine);
    });
  }

  private drawReelBackground(): Graphics {
    // todo think about this shape
    const stripe = new Graphics();
    const { x, y, width, height, radius } = STRIPE_GRAPHIC_CONFIG;
    stripe.beginFill(0xffffff).drawRoundedRect(x, y, width, height, radius);
    stripe.endFill();
    return stripe;
  }

  private drawLine(index: number, isWinLine = false): Graphics {
    const line = new Graphics();
    const { width, height, winColor, bgColor } = LINE_GRAPHIC_CONFIG;
    line.lineStyle(height, isWinLine ? winColor : bgColor, 1, 0);
    line.drawRect(0, 0, width, height);
    line.endFill();
    line.position.set(LINES_X_POSITION, LINES_Y_POSITIONS[index]);
    return line;
  }
}
