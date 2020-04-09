import { Dispatch } from './';


export interface GlobalState {
  test?: string;
}

export default {
  state: {
    test: '测试全局State',
  },
  reducers: {
    updateState: (state: GlobalState, payload: GlobalState): GlobalState => ({ ...state, ...payload }),
  },
  effects: (dispatch: Dispatch) => ({
    async verify() {
      dispatch.global.updateState({ test: '测试2' });
    },
  }),
};
