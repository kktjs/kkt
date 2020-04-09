
import { init, RematchRootState, RematchDispatch, Models } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import global from './global';
import login from './login';

const models = { global, login } as RootModel;

// no need to extend from Models
export interface RootModel extends Models {
	global: typeof global;
	login: typeof login;
}

export interface LoadingPlugin {
  loading: {
    global: boolean;
    models: {
      [key in keyof RootModel]: boolean;
    };
    // effects: Dispatch;
    effects: {
        [index: string]: any;
    };
  }
}

const loadingPlugin = createLoadingPlugin({});

export const store = init({
  models: {
    global: global,
  },
  plugins: [
    loadingPlugin,
  ],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel> & LoadingPlugin;