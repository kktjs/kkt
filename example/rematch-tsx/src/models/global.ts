import { createModel } from '@rematch/core';
import { Dispatch } from './';

export interface GlobalState {
  test?: string;
}

export default createModel()({
  state: {
    test: '测试全局State',
  } as GlobalState,
  reducers: {
    updateState: (state, payload: GlobalState) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch: any) => ({
    async verify() {
      const dph = dispatch as Dispatch;
      dph.global.updateState({ test: '测试2' });
    },
  }),
});
