import { Container } from 'inversify';
import 'reflect-metadata';

import { APP_TYPES } from './types';
import { GarbageCollect, Renderer, EventBus, Ticker, BuildModuleLoader } from './components';
import { AppFlowModel } from './model';
import { AppView } from './views';
import { Updatable } from './utils';
import { UiControlPresenter, SpinningPresenter, PaylinesPresenter, PaytablePresenter } from './presenters';
import { DebugPresenter } from './debug';

export interface AppConfig {
  readonly forUpdate: symbol | ServiceIdentifier<Updatable>;
  readonly onBuild: ReadonlyArray<ServiceIdentifier<Updatable> | symbol>;
  readonly preInit: (appContainer: Container) => void;
  readonly onInit: (appContainer: Container) => Promise<void>;
  readonly pushToGarbage: ReadonlyArray<ServiceIdentifier<GarbageCollect> | symbol>;
  readonly onDestroy: (appContainer: Container) => void;
}

export declare type ServiceIdentifier<T = unknown> = new (...args: any[]) => T;

export const appConfig: AppConfig = {
  forUpdate: APP_TYPES.Renderer,
  onBuild: [
    APP_TYPES.AppFlowModel,
    APP_TYPES.UiControlPresenter,
    APP_TYPES.PaylinesPresenter,
    APP_TYPES.SpinningPresenter,
    APP_TYPES.PaytablePresenter,
    APP_TYPES.DebugPresenter
  ],
  preInit: (appContainer) => {
    appContainer.bind(APP_TYPES.Renderer).to(Renderer).inSingletonScope();
    appContainer.bind(APP_TYPES.Ticker).toConstantValue(new Ticker({ ignoreFocusOff: true }));

    appContainer.bind(APP_TYPES.AppFlowModel).to(AppFlowModel).inSingletonScope();
    appContainer.bind(APP_TYPES.UiControlPresenter).to(UiControlPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.PaylinesPresenter).to(PaylinesPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.SpinningPresenter).to(SpinningPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.PaytablePresenter).to(PaytablePresenter).inSingletonScope();
    // debug
    appContainer.bind(APP_TYPES.DebugPresenter).to(DebugPresenter).inSingletonScope();
  },
  onInit: (appContainer) =>
    new Promise<void>((resolve) => {
      const appViewContainer = new AppView();
      appViewContainer
        .initialize()
        .then(() => {
          const { slotMachine, paylinesView, uiControlView, paytableView, debugView } = appViewContainer;

          appContainer.bind(APP_TYPES.SlotMachine).toConstantValue(slotMachine);
          appContainer.bind(APP_TYPES.PaylinesView).toConstantValue(paylinesView);
          appContainer.bind(APP_TYPES.UiControlView).toConstantValue(uiControlView);
          appContainer.bind(APP_TYPES.PaytableView).toConstantValue(paytableView);
          // debug
          appContainer.bind(APP_TYPES.DebugView).toConstantValue(debugView);
        })
        .then(() => {
          appContainer.get<Renderer>(APP_TYPES.Renderer).addContainer(appViewContainer);
        })
        .then(() => {
          appContainer.get<EventBus>(APP_TYPES.EventBus).emit('Ready');
          resolve();
        });
    }),
  pushToGarbage: [
    APP_TYPES.Renderer,
    APP_TYPES.Ticker,
    APP_TYPES.AppFlowModel,
    APP_TYPES.UiControlPresenter,
    APP_TYPES.PaylinesPresenter,
    APP_TYPES.SpinningPresenter,
    APP_TYPES.SpinningPresenter,
    APP_TYPES.DebugPresenter
  ],
  onDestroy: (appContainer) => {
    const view = appContainer.get<AppView>(APP_TYPES.AppView);
    view.destroy();
  }
};

export function bootstrapApp(): void {
  new BuildModuleLoader(appConfig);
}
