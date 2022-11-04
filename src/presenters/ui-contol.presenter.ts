import { injectable, inject } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect } from '../components';
import { UiControlView } from '../views';
import { AppFlowModel } from '../model';

@injectable()
export class UiControlPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.UiControlView) private readonly _iControlView: UiControlView,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { clickSpinButton$ } = this._iControlView;
    const { action$ } = this._appFlowModel;

    this._garbageBag.completable$(clickSpinButton$).subscribe(() => {
      this._appFlowModel.call({ type: 'SPIN_START' });
    });

    this._garbageBag.completable$(action$).subscribe((action) => {
      switch (action.type) {
        case 'SPIN_COMPLETE':
          this._iControlView.toggleButtonState();
          break;
        case 'SPIN_RESULT':
          this._iControlView.updateBalance(action.data);
          break;
        case 'UPDATE_BALANCE':
          this._iControlView.updateBalance(action.data.toString());
          break;
        case 'SPIN_START':
          this._iControlView.updateStateButton();
          break;
      }
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }
}
