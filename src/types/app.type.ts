import { SpinningPresenter, UiControlPresenter } from '../presenters';

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
  UiControlView: Symbol('UiControlView'),

  // Presenters
  UiControlPresenter: Symbol('UiControlPresenter'),
  SpinningPresenter: Symbol('SpinningPresenter')
};
