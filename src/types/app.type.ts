import { SpinningPresenter, UiControlPresenter } from '../presenters';
import { PaylinesView } from '../views/paylines.view';
import { PaylinesPresenter } from '../presenters/paylines.presenter';

export const APP_TYPES = {
  // Components
  Renderer: Symbol('Renderer'),
  BucketRenderer: Symbol('BucketRenderer'),
  LoaderScreen: Symbol('LoaderScreen'),
  EventBus: Symbol('EventBus'),
  Ticker: Symbol('Ticker'),
  SlotMachine: Symbol('SlotMachine'),

  AppFlowModel: Symbol('AppFlowModel'),

  // Views
  AppView: Symbol('AppView'),
  PaylinesView: Symbol('PaylinesView'),
  UiControlView: Symbol('UiControlView'),

  // Presenters
  UiControlPresenter: Symbol('UiControlPresenter'),
  PaylinesPresenter: Symbol('PaylinesPresenter'),
  SpinningPresenter: Symbol('SpinningPresenter')
};
