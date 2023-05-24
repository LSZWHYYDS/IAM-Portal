import * as WebAuth from '@/utils/webAuth';
import staticMethod from '@/utils/staticMethod';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { handleHaveToken } from './utils/Hooks/UserInfo';
export const initialStateConfig = {
  loading: <PageLoading />,
};
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  licData?: DIGITALSEE.LicData;
  fetchUserInfo?: () => Promise<DIGITALSEE.CurrentUser | undefined>;
  getPolicyData?: () => Promise<API.ResponseData | undefined>;
  policyData?: API.ResponseData;
}> {
  /**
   * 如果访问是不需要鉴权的页面 则直接访问
   */
  if (WebAuth.isAuthed()) return {};
  const query: any = staticMethod.parseQueryString(window.location.href);
  const access_token: any = query && query?.access_token;
  const lastToken = sessionStorage.getItem('access_token');
  if (access_token) {
    if (!WebAuth.ThereAreAccessToken()) return {};
  } else {
    if (!lastToken) {
      WebAuth.startInitAuth();
      return {};
    }
  }
  // 判断有token并且是管理平台的首页则执行这段代码
  if (sessionStorage.getItem('access_token')) {
    const promiseObj: any = handleHaveToken();
    return promiseObj;
  }
  return {};
}

export const layout: RunTimeLayoutConfig = ({ initialState }: { initialState: any }) => {
  return {
    disableContentMargin: false,
    title: initialState?.policyData?.uc_name,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
};
