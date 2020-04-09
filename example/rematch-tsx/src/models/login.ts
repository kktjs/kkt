import { Dispatch } from './';
import { login } from '../servers/login';

export interface LoginState {
  token?: string;
  userData?: {
    username: string;
  };
}

export default {
  state: {
    userData: null,
    token: null,
  },
  reducers: {
    updateState: (state: LoginState, payload: LoginState): LoginState => ({ ...state, ...payload }),
  },
  effects: (dispatch: Dispatch) => ({
    async submit(payload: LoginState['userData']) {
      await login({ username: 'test', password: 'www' });
      // dispatch.sharks.increment(payload)
      // `dispatch.s` will suggest `sharks`
    },
  }),
};
