import { createModel } from '@rematch/core';
import { login } from '../servers/login';
import history from '../routes/history';

export type LoginState = {
  token?: string;
  userData?: {
    username: string;
    password: string;
    terms: boolean;
  };
}

export default createModel({
  state: {
    userData: null,
    token: null,
  } as unknown as LoginState,
  reducers: {
    updateState: (state: LoginState, payload: LoginState): LoginState => ({ ...state, ...payload }),
  },
  effects: () => ({
    async submit(payload = {} as LoginState['userData']) {
      await login({ ...payload });
      history.push('/');
    },
  }),
});
