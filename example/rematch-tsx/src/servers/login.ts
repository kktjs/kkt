import request from '../utils/request';

export interface Login {
  username: string;
  password: string;
  terms?: boolean;
}

/**
 * 提交登录
 * @param {Object} params
 */
export function login(params: Login) {
  return request('/api/login', {
    method: 'POST',
    body: { ...params },
  });
}
