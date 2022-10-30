import { injectable, inject, postConstruct } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect, SlotMachine } from '../components';
import { AppFlowModel } from '../model';

@injectable()
export class SpinningPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.SlotMachine) private readonly _slotMachine: SlotMachine,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { sendResultComplete$ } = this._slotMachine;
    const { action$ } = this._appFlowModel;

    this._garbageBag.completable$(sendResultComplete$).subscribe((result) => {
      this._appFlowModel.call({ type: 'SPIN_COMPLETE', data: result });
    });

    this._garbageBag.completable$(action$).subscribe((action) => {
      if (action.type === 'SPIN_START') {
        this._slotMachine.spin(action.data);
      }
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {}
}
