export const APP_TYPES = {
  // Components
  Renderer: Symbol('Renderer'),
  BucketRenderer: Symbol('BucketRenderer'),
  LoaderScreen: Symbol('LoaderScreen'),
  EventBus: Symbol('EventBus'),
  Ticker: Symbol('Ticker'),
  SlotMachine: Symbol('SlotMachine'),

  AppFlowModel: Symbol('AppFlowModel'),

  // debug
  DebugPresenter: Symbol('DebugPresenter'),
  DebugView: Symbol('DebugView'),

  // Views
  AppView: Symbol('AppView'),
  PaylinesView: Symbol('PaylinesView'),
  UiControlView: Symbol('UiControlView'),
  PaytableView: Symbol('PaytableView'),

  // Presenters
  UiControlPresenter: Symbol('UiControlPresenter'),
  PaylinesPresenter: Symbol('PaylinesPresenter'),
  SpinningPresenter: Symbol('SpinningPresenter'),
  PaytablePresenter: Symbol('PaytablePresenter')
};
