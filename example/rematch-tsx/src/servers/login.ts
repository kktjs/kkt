import request from '../utils/request';
import { LoginState } from '../models/login'

/**
 * 提交登录
 * @param {Object} params
 */
export function login(params: Exclude<LoginState['userData'], 'username' | 'password' | 'terms'>) {
  return request('/api/login', {
    method: 'POST',
    body: { ...params },
  });
}
