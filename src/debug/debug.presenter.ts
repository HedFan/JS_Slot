import { injectable, inject, postConstruct } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect } from '../components';
import { AppFlowModel } from '../model';
import { DebugView } from './debug.view';

@injectable()
export class DebugPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.DebugView) private readonly _debugView: DebugView,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { debugAction$ } = this._appFlowModel;
    const { clickToggleButton$, sentBalance$, spinWithResult$ } = this._debugView;

    this._garbageBag.completable$(clickToggleButton$).subscribe((result) => {
      this._appFlowModel.callDebugMode({ type: 'SWITCH_MODE', data: result });
    });

    this._garbageBag.completable$(sentBalance$).subscribe((result) => {
      this._appFlowModel.callDebugMode({ type: 'UPDATE_BALANCE', data: result });
    });

    this._garbageBag.completable$(debugAction$).subscribe((action) => {
      if (action.type === 'SPIN_COMPLETE') {
        this._debugView.updateDynamicResult(action.data);
      }
    });

    this._garbageBag.completable$(spinWithResult$).subscribe((result) => {
      this._appFlowModel.callDebugMode({ type: 'SENT_MOCK_DATA', data: result });
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {}
}
