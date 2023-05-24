import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const base = process.env.NODE_ENV === 'production' ? '' : '';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  headerHeight: 64,
  pwa: false,
  // logo: base + '/images/logo.png',
  // iconfontUrl: '/iconfont/iconfont.js',
};

export default Settings;
