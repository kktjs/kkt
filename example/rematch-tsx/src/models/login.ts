import { createModel } from '@rematch/core';
// import { Dispatch } from './';
import { login } from '../servers/login';

export interface LoginState {
  token?: string;
  userData?: {
    username: string;
  };
}

export default createModel({
  state: {
    userData: null,
    token: null,
  },
  reducers: {
    updateState: (state: LoginState, payload: LoginState): LoginState => ({ ...state, ...payload }),
  },
  effects: () => ({
    async submit(payload: LoginState['userData']) {
      await login({ username: 'test', password: 'www' });
    },
  }),
});
