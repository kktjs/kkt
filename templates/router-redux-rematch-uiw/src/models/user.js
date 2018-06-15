import request from '../utils/request';

const getToken = () => localStorage.getItem('token');
const getUsername = () => {
  let user = localStorage.getItem('userData');
  try {
    user = JSON.parse(user) || {};
  } catch (error) {
    user = {};
  }
  return user;
};

export const user = {
  state: {
    token: getToken(),
    userData: getUsername(),
    loading: false,
    message: '',
  },
  reducers: {
    updateState(state, payload) {
      return { ...state, ...payload };
    },
  },
  effects: {
    async login({ username, password }) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      // Fetch 请求实例
      this.updateState({ loading: true });
      const data = await request('/api/user/login', {
        method: 'POST',
        body: { username, password },
      });
      if (data.data) {
        await this.updateState({ userData: data.data });
        await localStorage.setItem('userData', JSON.stringify(data.data));
      } else if (data.error) {
        await this.updateState({ message: data.error });
      }
      this.updateState({ loading: false });
    },
    async logout() {
      // await localStorage.removeItem('token');
      await localStorage.removeItem('userData');
      await this.updateState({ userData: {}, token: null });
    },
  },
};
