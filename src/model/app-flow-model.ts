import { injectable } from 'inversify';
import { Subject, Observable } from 'rxjs';

import { GarbageBag, GarbageCollect, WinPosition, paylinesConfig, REEL_SYMBOLS } from '../components';
import { getNext, getPrev, repeat, unwrap } from '../utils';
import { WinResultData, GameAction } from './app-flow-model.config';

@injectable()
export class AppFlowModel implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();
  private readonly _actionSubject$ = new Subject<GameAction>();

  constructor() {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  call(action: GameAction): void {
    if (action.type === 'SPIN_COMPLETE') {
      const spinResult = this.spinResult(action.data);
      this._actionSubject$.next({ type: 'SPIN_RESULT', data: spinResult });
    }
    this._actionSubject$.next(action);
  }

  get action$(): Observable<GameAction> {
    return this._actionSubject$;
  }

  private spinResult(action: Map<number, WinPosition>): Array<WinResultData> {
    const linesSpinResult = this.parseSpinLinesResult(action);
    return this.findWinResultData(linesSpinResult);
  }

  private parseSpinLinesResult(action: Map<number, WinPosition>): Array<Array<string>> {
    const linesResult = new Array<Array<string>>();
    repeat(3).map(() => linesResult.push(new Array<string>()));
    repeat(action.size).map((index) => {
      const winPosition: WinPosition = unwrap(action.get(index), `action result ${index} is undefined`);
      const { nameSymbol, positionOnReel } = winPosition;

      const currIndex = REEL_SYMBOLS.indexOf(nameSymbol);
      switch (positionOnReel) {
        case 0:
          const getNextIndex = getNext(currIndex, REEL_SYMBOLS.length - 1, 0);
          linesResult[0].push(nameSymbol);
          linesResult[2].push(REEL_SYMBOLS[getNextIndex]);
          break;
        case 1:
          linesResult[1].push(nameSymbol);
          break;
        case 2:
          const getPrevIndex = getPrev(currIndex, REEL_SYMBOLS.length - 1);
          linesResult[0].push(REEL_SYMBOLS[getPrevIndex]);
          linesResult[2].push(nameSymbol);
          break;
      }
    });
    return linesResult;
  }

  private findWinResultData(linesSpinResult: Array<Array<string>>): Array<WinResultData> {
    const winResultData = new Array<WinResultData>();
    paylinesConfig.forEach((payline) => {
      const { line, winAmount, paytableIndex, symbol, multipleSymbols, quantity } = payline;
      linesSpinResult.forEach((lineResult, lineIndex) => {
        if (!lineResult.length || lineIndex !== line) {
          return;
        }
        if (lineResult.length === 3 && quantity === 3) {
          if (lineResult.every((value) => value === symbol)) {
            winResultData.push({ paytableIndex, winAmount, lineIndex });
          }
        } else if (multipleSymbols) {
          if (multipleSymbols.every((multipleSymbol) => lineResult.some((value) => value === multipleSymbol))) {
            winResultData.push({ paytableIndex, winAmount, lineIndex });
          }
        } else if (quantity === 1) {
          if (lineResult.some((value) => value === symbol)) {
            winResultData.push({ paytableIndex, winAmount, lineIndex });
          }
        }
      });
    });
    return winResultData;
  }
}
