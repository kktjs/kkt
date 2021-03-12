import { init, RematchRootState, RematchDispatch, Models } from '@rematch/core';
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import global from './global';
import login from './login';

export interface RootModel extends Models<RootModel>, FullModel {
  global: typeof global;
  login: typeof login;
}

type FullModel = ExtraModelsFromLoading<RootModel>;

export const models = { global } as RootModel;
export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin()],
});

export const { dispatch } = store;

export type Store = typeof store;
// export type Dispatch = RootModel;
// export type Dispatch = ReduxDispatch<RootModel>;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
