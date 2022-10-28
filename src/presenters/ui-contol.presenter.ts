import { injectable, inject, postConstruct } from 'inversify';
// import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect, SlotMachine } from '../components';
import { UiControlView } from '../views';
import { AppFlowModel } from '../model';
import { GameAction } from '../model/app-flow-model';

//
@injectable()
export class UiControlPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();
  //
  constructor(
    @inject(APP_TYPES.UiControlView) private readonly _iControlView: UiControlView,
    @inject(APP_TYPES.SlotMachine) private readonly _slotMachine: SlotMachine,
    @inject(APP_TYPES.AppFlowModel) private readonly _appFlowModel: AppFlowModel
  ) {
    const { clickSpinButton$ } = this._iControlView;
    const { spinComplete$ } = this._slotMachine;
    const { action$ } = this._appFlowModel;

    this._garbageBag.completable$(clickSpinButton$).subscribe(() => {
      this._appFlowModel.call(GameAction.SPIN_START);
      this._slotMachine.spin();
    });

    this._garbageBag.completable$(spinComplete$).subscribe(() => {
      this._appFlowModel.call(GameAction.SPIN_COMPLETE);
      this.toggleButton();
    });
  }
  //
  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {}

  toggleButton(): void {
    this._iControlView.toggleButtonState();
  }

  get clickSpinButton$(): Observable<void> {
    return this._iControlView.clickSpinButton$;
  }
}
