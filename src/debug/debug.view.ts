import { fromEvent, Observable, Subject, merge } from 'rxjs';
import { Container, Sprite, Text } from 'pixi.js-legacy';
const dat = require('dat.gui');

import { repeat, fromCacheAsSprite, createButton } from '../utils';
import { GarbageBag, GarbageCollect, WinPosition } from '../components';
import {
  BACKGROUND_HEIGHT,
  BACKGROUND_SIZE,
  DEBUG_BUTTON,
  DEBUG_CONTAINER_POSITION,
  POSITION,
  RESULT_POSITION,
  TEXT_STYLE,
  GuiInfo,
  ReelFolder,
  PositionType,
  SymbolName,
  BUTTON_SIZE,
  BUTTON_SCALE
} from './debug.config';

export class DebugView extends Container implements GarbageCollect {
  readonly name = 'debug-container';

  private readonly _garbageBag = new GarbageBag();
  private readonly _clickToggleButtonSubject$ = new Subject<boolean>();
  private readonly _sentBalanceSubject$ = new Subject<number>();
  private readonly _spinWithResultSubject$ = new Subject<Array<WinPosition>>();

  private readonly _onButton: Sprite;
  private readonly _offButton: Sprite;
  private readonly _background: Sprite;
  private readonly _debugContainer = new Container();
  private readonly _dynamicResult: Text;
  private readonly _guiInfo: GuiInfo;
  private _isActiveButton: boolean;

  constructor() {
    super();
    this._guiInfo = {
      balance: 100,
      save: () => this._sentBalanceSubject$.next(this._guiInfo.balance),
      reels: 100
    };
    const guiReels = {
      spin: () => sendSpin()
    };

    const gui = new dat.GUI({ name: 'JS_Slot' });
    const container = gui.domElement.parentElement;
    gui.domElement.style.left = '0px';
    gui.domElement.style.position = 'absolute';
    if (container) {
      container.setAttribute('id', 'debug-gui-controlPanel');
      container.style.zIndex = '100';
      container.style.userSelect = 'none';
    }
    const firstReelFolder: ReelFolder = {
      reelIndex: 0,
      symbol: SymbolName.BAR,
      position: PositionType.TOP
    };
    const secondReelFolder: ReelFolder = {
      reelIndex: 1,
      symbol: SymbolName.BAR,
      position: PositionType.TOP
    };
    const thirdReelFolder: ReelFolder = {
      reelIndex: 2,
      symbol: SymbolName.BAR,
      position: PositionType.TOP
    };
    const balance = gui.add(this._guiInfo, 'balance');
    balance.max(5000).step(1).min(1);
    gui.add(this._guiInfo, 'save').name('save');

    const reelsFolder = gui.addFolder('reels');
    reelsFolder.name = 'Reels';
    const reel_1 = reelsFolder.addFolder('reel_1');
    reel_1.add(firstReelFolder, 'symbol', {
      BAR: 'symbol-1-bar',
      '2xBAR': 'symbol-2-bar',
      '3xBAR': 'symbol-3-bar',
      '7': 'symbol-7',
      CHERRY: 'symbol-cherry'
    });
    reel_1.add(firstReelFolder, 'position', {
      TOP: 0,
      MIDDLE: 1,
      BOTTOM: 2
    });
    const reel_2 = reelsFolder.addFolder('reel_2');
    reel_2.add(secondReelFolder, 'symbol', {
      BAR: 'symbol-1-bar',
      '2xBAR': 'symbol-2-bar',
      '3xBAR': 'symbol-3-bar',
      '7': 'symbol-7',
      CHERRY: 'symbol-cherry'
    });
    reel_2.add(secondReelFolder, 'position', {
      TOP: 0,
      MIDDLE: 1,
      BOTTOM: 2
    });
    const reel_3 = reelsFolder.addFolder('reel_3');
    reel_3.add(thirdReelFolder, 'symbol', {
      BAR: 'symbol-1-bar',
      '2xBAR': 'symbol-2-bar',
      '3xBAR': 'symbol-3-bar',
      '7': 'symbol-7',
      CHERRY: 'symbol-cherry'
    });
    reel_3.add(thirdReelFolder, 'position', {
      TOP: 0,
      MIDDLE: 1,
      BOTTOM: 2
    });
    reelsFolder.add(guiReels, 'spin').name('spin');
    gui.close();

    const sendSpin = (): void => {
      const resultArray = new Array<WinPosition>();
      repeat(3).map((value) => {
        const folder = value === 0 ? firstReelFolder : value === 1 ? secondReelFolder : thirdReelFolder;
        const result = {
          nameSymbol: folder.symbol,
          positionOnReel: Number(folder.position)
        };
        resultArray.push(result);
      });
      this._spinWithResultSubject$.next(resultArray);
    };

    this.position.copyFrom(POSITION);

    this._onButton = createButton('on-button', BUTTON_SIZE.width, BUTTON_SIZE.height);
    this._onButton.position.copyFrom(DEBUG_BUTTON);
    this._onButton.scale.set(BUTTON_SCALE);
    this._onButton.visible = false;

    this._offButton = createButton('off-button', BUTTON_SIZE.width, BUTTON_SIZE.height);
    this._offButton.position.copyFrom(DEBUG_BUTTON);
    this._offButton.scale.set(BUTTON_SCALE);
    this._isActiveButton = false;

    const clickButton$ = merge(fromEvent(this._onButton, 'pointerdown'), fromEvent(this._offButton, 'pointerdown'));

    this._garbageBag.completable$(clickButton$).subscribe(() => {
      this.toggleButton();
      this.updateView();
      this._clickToggleButtonSubject$.next(this._isActiveButton);
    });

    const { width, height } = BACKGROUND_SIZE;
    this._background = fromCacheAsSprite('debug-background');
    this._background.width = width;
    this._background.height = height;

    const staticResultText = new Text('Result:', TEXT_STYLE);
    staticResultText.y = RESULT_POSITION.y;
    this._dynamicResult = new Text('', TEXT_STYLE);
    this._dynamicResult.position.copyFrom(RESULT_POSITION);

    this._debugContainer.addChild(staticResultText, this._dynamicResult);
    this._debugContainer.position.copyFrom(DEBUG_CONTAINER_POSITION);
    this._debugContainer.visible = false;
    this.addChild(this._background);
    this.addChild(this._onButton);
    this.addChild(this._offButton);
    this.addChild(this._debugContainer);

    this._garbageBag.add(gui);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  updateDynamicResult(data: Array<Array<string>> | undefined): void {
    if (data === undefined) {
      return;
    }
    this._dynamicResult.text = '';
    data.forEach((value, index) => {
      this._dynamicResult.text += `${index} line index: `;
      value.forEach((line) => (this._dynamicResult.text += `${line}; `));
      this._dynamicResult.text += '\n';
    });
  }

  get clickToggleButton$(): Observable<boolean> {
    return this._clickToggleButtonSubject$;
  }

  get sentBalance$(): Observable<number> {
    return this._sentBalanceSubject$;
  }

  get spinWithResult$(): Observable<Array<WinPosition>> {
    return this._spinWithResultSubject$;
  }

  private toggleButton(): void {
    const isActive = this._isActiveButton;
    this._onButton.visible = !isActive;
    this._offButton.visible = isActive;
    this._isActiveButton = !isActive;
  }

  private updateView(): void {
    const isActive = this._isActiveButton;
    this._background.height = isActive ? BACKGROUND_HEIGHT : BACKGROUND_SIZE.height;
    this._debugContainer.visible = isActive;
    this._dynamicResult.text = '';
  }
}
