import { errorCode } from '@/utils/common.utils';
import * as WebAuth from '@/utils/webAuth';
import { Modal } from 'antd';
import { history } from 'umi';
import { extend } from 'umi-request';
const request = extend({
  timeout: 5000,
});
// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let access_token = sessionStorage.getItem('access_token');
  if (null === access_token) {
    access_token = '';
  }
  const authHeader = { Authorization: `Bearer ${access_token}` };
  if (!options.method) {
    options.method = 'get';
  }
  if (options.headers && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
});
request.interceptors.response.use(async (response, options) => {
  if (response.status === 401) {
    sessionStorage.clear();
    localStorage.clear();
    WebAuth.authorize();
    return response;
  }
  if (response.status === 200) {
    if (options.responseType === 'blob') {
      return response;
    }
  }
  const data = await response.clone().json();
  if (options.noTip) {
    return response;
  }

  // 不同操作情况不同，由各个地方发出请求时进行判断需不需要显示，以及如何显示提示信息
  if (data.code === '0' || data.error === '0') {
    // if (['PUT', 'POST', 'DELETE'].includes(options.method || '')) {
    //   message.success('操作成功。');
    // }
    // result = response;
  } else if (
    data.error !== 'invalid_token' &&
    ((data.error && errorCode[data.error]) || data.error_description)
  ) {
    if (data.error === '1010212') {
      //需要修改密码
      Modal.error({
        title: '提示',
        content: (data.error && errorCode[data.error]) || data.error_description,
        onOk: () => {
          history.push('/user/resetPassword');
        },
      });
      return;
    }
    if (data.error == 'access_denied') {
      Modal.error({
        title: '提示',
        content: '服务器错误：' + '该账号暂无权限',
      });
      return;
    }
    Modal.error({
      title: '提示',
      content: '服务器错误：' + ((data.error && errorCode[data.error]) || data.error_description),
    });
  }
  return response;
});

/**
 * 获取当前的用户
 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/iam/api/self/user_info', {
    method: 'GET',
    noTip: true,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /iam/api/login/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/iam/api/login/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  sessionStorage.setItem('loginId', body.username || '');
  return request<API.LoginResult>('/login/basic_auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getConfigsPolicies() {
  return request('/iam/api/configs/policies', {
    method: 'GET',
  });
}
