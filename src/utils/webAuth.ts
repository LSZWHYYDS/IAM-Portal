import staticMethod from '@/utils/staticMethod';
import { history } from 'umi';
import request from 'umi-request';
import RLSafeBase64 from 'urlsafe-base64';
import conf from '@/utils/conf';
const queryObj: any = staticMethod.parseQueryString(window.location.href);
let scope: string;

export const loginSuccess = function (accessToken: string, tcode: string, callback: any) {
  sessionStorage.setItem(
    'reduxPersist:login',
    JSON.stringify({
      loggedIn: true,
    }),
  );
  request.interceptors.request.use((url, options) => {
    const authHeader = { Authorization: `Bearer ${accessToken}`, tcode };
    if (options.headers && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
    if (url.includes('configs/policies') && options.method === 'get') {
      delete authHeader.Authorization;
    }
    return {
      url: url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  });
  if (typeof callback === 'function') {
    callback();
  }
};

export const ThereAreAccessTokenHandle = (successCb: any, failureCb: any) => {
  // parseQueryString作用构建符合后台的一个URL
  const query: any = staticMethod.parseQueryString(window.location.href);
  const localState = sessionStorage.getItem('state');

  if (!localState || (localState && localState === query.state)) {
    const accessTokenReceivedAt = new Date().getTime();
    const expiresIn = parseInt(query.expires_in, 10) * 1000;
    sessionStorage.setItem('access_token', query.access_token);
    sessionStorage.setItem('id_token', query.id_token);
    sessionStorage.setItem('expires_in', expiresIn.toString());
    sessionStorage.setItem('access_token_received_at', accessTokenReceivedAt.toString());
    if (typeof successCb === 'function') {
      successCb(query.access_token, query.id_token, accessTokenReceivedAt, expiresIn);
    }
    return true;
  } else {
    if (typeof failureCb === 'function') {
      failureCb('invalid_state', 'invalid_state');
    }
    return false;
  }
};

// 存在access_token
export const ThereAreAccessToken = (callback?: any) => {
  return ThereAreAccessTokenHandle(
    (accessToken: any) => {
      const tmpAccessToken = sessionStorage.getItem('id_token'),
        tokenInfo = JSON.parse(
          RLSafeBase64.decode(
            tmpAccessToken && tmpAccessToken.split('.').length && tmpAccessToken.split('.')[1],
          ),
        );
      loginSuccess(accessToken, tokenInfo.tid, callback);
    },
    (errorType: any, errorDescription: any) => {
      if (errorType === 'invalid_state') {
        history.replace('/authorizationError/' + errorType + '/' + errorDescription);
      }
      sessionStorage.clear();
    },
  );
};

// 未授权走的逻辑(最终拼接一个地址进行GET访问)
export const authorize = () => {
  window.sessionStorage.clear();
  const state = new Date().getTime();
  //  如果没有access——toke构建URl地址
  const params = {
    response_type: 'token',
    client_id: 'portal',
    scope: scope,
    state: state,
  };
  if (queryObj.tcode) {
    params['tcode'] = queryObj.tcode;
  }
  sessionStorage.setItem('state', state.toString());
  params['redirect_uri'] = location.origin + location.pathname;

  location.href = conf.getBackendUrl() + '/authorize' + staticMethod.createQueryString(params);
};

export const noLogin = () => {
  return (
    //下列页面不需要授权就可以访问
    window.location.href.indexOf('register') !== -1 ||
    window.location.href.indexOf('mailSent') !== -1 ||
    window.location.href.indexOf('smsSent') !== -1 ||
    window.location.href.indexOf('dingding') !== -1 ||
    window.location.href.indexOf('resetPassword') !== -1 ||
    window.location.href.indexOf('forget_password') !== -1 ||
    window.location.href.indexOf('forcedUpdatePwd') !== -1 ||
    window.location.href.indexOf('verify_email_address') !== -1 ||
    window.location.href.indexOf('#/cert') !== -1 ||
    window.location.href.indexOf('#/email') !== -1 ||
    window.location.href.indexOf('#/sms') !== -1 ||
    window.location.pathname === '/user/login' ||
    window.location.pathname === '/user/login/' ||
    window.location.pathname === '/login/guide' ||
    window.location.pathname === '/login/guide/' ||
    window.location.pathname === '/portal/introductionPage' ||
    window.location.pathname === '/portal/introductionPage/' ||
    window.location.pathname === '/portal/introductionPage/index.html'
  );
};

export const isAuthed = () => {
  return (
    //下列页面不需要授权就可以访问
    window.location.href.indexOf('register') !== -1 ||
    window.location.href.indexOf('mailSent') !== -1 ||
    window.location.href.indexOf('smsSent') !== -1 ||
    window.location.href.indexOf('forget_password') !== -1 ||
    window.location.href.indexOf('resetPassword') !== -1 ||
    window.location.href.indexOf('verify_email_address') !== -1 ||
    window.location.href.indexOf('#/cert') !== -1 ||
    window.location.href.indexOf('#/email') !== -1 ||
    window.location.href.indexOf('#/sms') !== -1 ||
    window.location.pathname === '/user/login' ||
    window.location.pathname === '/user/login/' ||
    window.location.pathname === '/login/guide' ||
    window.location.pathname === '/login/guide/' ||
    window.location.pathname === '/portal/introductionPage' ||
    window.location.pathname === '/portal/introductionPage/' ||
    window.location.pathname === '/portal/introductionPage/index.html' ||
    (window.location.href.indexOf('/dingding') !== -1 &&
      window.location.href.indexOf('continue') !== -1) || //请求dingding登录页面，并且已经包含了continue页面，则不发起授权请求
    (window.location.href.indexOf('#login') !== -1 &&
      window.location.href.indexOf('continue') !== -1) //请求login登录页面，并且已经包含了continue页面，则不发起授权请求
  );
};

// 不存在access_token情况   目的为了构建URL
export const startInitAuth = () => authorize();
