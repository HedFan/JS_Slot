import { injectable, inject } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect } from '../components';
import { PaytableView } from '../views';
import { AppFlowModel } from '../model';

@injectable()
export class PaytablePresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.PaytableView) private readonly _paytableView: PaytableView,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { action$ } = this._appFlowModel;

    this._garbageBag.completable$(action$).subscribe((action) => {
      switch (action.type) {
        case 'SPIN_START':
          this._paytableView.stopBlinking();
          break;
        case 'SPIN_RESULT':
          this._paytableView.startBlinking(action.data);
          break;
      }
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }
}
