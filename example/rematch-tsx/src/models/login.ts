import { createModel } from '@rematch/core';
import { login } from '../servers/login';
import history from '../routes/history';
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
  effects: () => ({
    async submit(payload: LoginState['userData']) {
      await login({ ...payload } as  LoginState['userData']);
      history.push('/');
    },
  }),
});
