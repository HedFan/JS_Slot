import { injectable, inject, postConstruct } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect } from '../components';
import { PaylinesView } from '../views';
import { AppFlowModel } from '../model';

@injectable()
export class PaylinesPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.PaylinesView) private readonly _paylinesView: PaylinesView,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { action$ } = this._appFlowModel;

    this._garbageBag.completable$(action$).subscribe((action) => {
      if (action.type === 'SPIN_START') {
        this._paylinesView.hideAllLines();
      }
      if (action.type === 'SPIN_RESULT') {
        this._paylinesView.showWinLines(action.data);
      }
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {}
}
