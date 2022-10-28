import { injectable } from 'inversify';
import { Subject, Observable } from 'rxjs';

import { GarbageBag, GarbageCollect } from '../components/garbage-bag';

export const enum ButtonState {
  ACTIVE = 'active',
  UN_ACTIVE = 'un-active'
}

export const enum GameAction {
  SPIN_START = 'spin-start',
  SPIN_COMPLETE = 'spin-complete'
}

@injectable()
export class AppFlowModel implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();
  private readonly _actionSubject$ = new Subject<{ action?: GameAction }>();

  constructor() {
    // const { clickSpinButton$ } =
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  call(action?: GameAction): void {
    this._actionSubject$.next({ action });
    // if(action === GameAction.SPIN_START) {
    //
    // }
  }

  spinCompleted(): void {}
  // updateAction(incomeState: ButtonState, incomeAction?: GameAction): Promise<void> {
  //   this.call(incomeState, incomeAction);
  //   return Promise.resolve();
  // }

  get action$(): Observable<{ action?: GameAction }> {
    return this._actionSubject$;
  }
}
