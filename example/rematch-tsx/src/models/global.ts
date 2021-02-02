import { createModel } from '@rematch/core';
import { RootModel } from './';

export interface GlobalState {
  test?: string;
}

export default createModel<RootModel>()({
  state: {
    test: '测试全局State',
  } as GlobalState,
  reducers: {
    updateState: (state, payload: GlobalState) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async verify() {
      dispatch.global.updateState({ test: '测试2' });
    },
  }),
});
