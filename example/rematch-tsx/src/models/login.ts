import { createModel } from '@rematch/core';
import { login } from '../servers/login';
import { RootModel } from './';

export type LoginState = {
  token?: string;
  userData?: {
    username: string;
    password: string;
    terms: boolean;
  };
};

export default createModel<RootModel>()({
  state: {
    userData: null,
    token: null,
  } as unknown as LoginState,
  reducers: {
    updateState: (state, payload: LoginState): LoginState => ({ ...state, ...payload }),
  },
  effects: (dispatch) => ({
    async logout() {
      // await logout();
    },
    async submit(payload: LoginState['userData']) {
      const data = await login({ ...payload } as LoginState['userData']);
      if (data && data.token) {
        dispatch.login.updateState({ token: data.token, userData: data });
      }
    },
  }),
});
