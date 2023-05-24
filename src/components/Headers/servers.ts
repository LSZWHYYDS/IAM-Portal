import request from 'umi-request';
import conf from '@/utils/conf';

// 获取用户名称
export async function getUserInfo_ls() {
  return request(`/iam/api/self/user_info`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
}

export function logout(redirect_uri: any) {
  location.href = conf.getBackendUrl() + '/logout' + '?redirect_uri=' + redirect_uri;
}
