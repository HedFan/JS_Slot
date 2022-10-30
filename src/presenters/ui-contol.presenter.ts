import { injectable, inject, postConstruct } from 'inversify';
import { Observable } from 'rxjs';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect } from '../components';
import { UiControlView } from '../views';
import { AppFlowModel, WinResultData } from '../model';

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
      if (action.type === 'SPIN_COMPLETE') {
        this.toggleButton();
      }
      if (action.type === 'SPIN_RESULT') {
        this.updateBalance(action.data);
      }
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {}

  toggleButton(): void {
    this._iControlView.toggleButtonState();
  }

  updateBalance(winData: Array<WinResultData>): void {
    this._iControlView.updateBalance(winData);
  }
}
