import { injectable } from 'inversify';
import { Container, autoDetectRenderer, settings } from 'pixi.js-legacy';

import { GarbageBag, GarbageCollect } from '../components';
import { TickerData, Updatable } from '../utils';

export interface Renderer extends Updatable {}
@injectable()
export class Renderer implements GarbageCollect, Renderer {
  private readonly _garbageBag = new GarbageBag();
  private readonly _renderer: PIXI.CanvasRenderer | PIXI.Renderer;
  private readonly _stage: Container;
  private readonly _appContainer: Container;

  constructor() {
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this._renderer = autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: devicePixelRatio,
      backgroundColor: 0x2c3e50,
      forceCanvas: true,
      autoDensity: true,
      transparent: true
    });

    this._stage = new Container();
    this._stage.name = 'stage';

    this._appContainer = new Container();
    this._appContainer.name = 'root-content-container';
    this._stage.addChild(this._appContainer);

    document.body.appendChild(this._renderer.view);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  update(tickerData: TickerData): void {
    this._renderer.render(this._stage);
  }

  addContainer(container: Container): void {
    this._appContainer.addChild(container);
  }
}
