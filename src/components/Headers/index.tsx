import React, { useState, useEffect } from 'react';
import { Dropdown, Menu } from 'antd';
import { history, useModel } from 'umi';
// const { location } = history;
import styles from './index.less';
import { logout } from './servers';
import { clearLoginStorage } from '@/utils/common.utils';
// import { stringify } from 'querystring';
// import type { MenuInfo } from 'rc-menu/lib/interface';
import { getUserInfo_ls } from './servers';
import { LogoutOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

const Headers: React.FC<any> = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  useEffect(() => {
    // 获取用户的头像以及名称
    getUserInfo_ls().then((rs) => {
      setUserInfo(rs.data);
    });
  }, []);
  const { setInitialState } = useModel('@@initialState');
  // const onMenuClick = useCallback(
  //   (event: MenuInfo) => {
  //     const { key } = event;
  //     if (key === 'logout') {
  //       setInitialState((s) => ({ ...s, currentUser: undefined }));
  //       loginOut();
  //       return;
  //     }
  //     history.push(`/user/${key}`);
  //   },
  //   [setInitialState],
  // );
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    setInitialState((s: any) => {
      const obj = { ...s, currentUser: undefined };
      return obj;
    });
    try {
      const tcode = sessionStorage.getItem('tcode');
      clearLoginStorage();
      logout(location.origin + `/uc/?tcode=${tcode}`);
    } catch (e) {}
  };
  const menu = (
    <Menu
      items={[
        // {
        //   label: <span onClick={() => history.push('/uc/selfInfo')}>应用中心</span>,
        //   key: '1',
        // },
        {
          label: (
            <span
              onClick={() => history.push('/person/PCuserInfor')}
              style={{ display: 'inline-block', width: '100%' }}
            >
              <InfoCircleOutlined style={{ marginRight: '10px' }} />
              个人信息
            </span>
          ),
          key: '2',
        },
        {
          label: (
            <span
              onClick={() => {
                const tcode = sessionStorage.getItem('tcode');
                sessionStorage.clear();
                location.href = `${location.origin}/uc/?tcode=${tcode}`;
              }}
              style={{
                width: '100%',
                display: userInfo?.permissions_sets?.length == 0 ? 'none' : 'inline-block',
              }}
            >
              <SettingOutlined style={{ marginRight: '10px' }}></SettingOutlined>
              管理平台
            </span>
          ),
          key: '3',
        },
        {
          label: (
            <span onClick={() => loginOut()} style={{ display: 'inline-block', width: '100%' }}>
              <LogoutOutlined style={{ marginRight: '10px' }}></LogoutOutlined>
              退出登录
            </span>
          ),
          key: 'logout',
        },
      ]}
    />
  );
  // const loading = (
  //   <span className={`${styles.action} ${styles.account}`}>
  //     <Spin
  //       size="small"
  //       style={{
  //         marginLeft: 8,
  //         marginRight: 8,
  //       }}
  //     />
  //   </span>
  // );
  // if (!initialState) {
  //   return loading;
  // }
  // const { currentUser } = initialState;
  // if (!currentUser || !currentUser.tenant_id) {
  //   return loading;
  // }
  return (
    <header className={styles.header}>
      {/* 左侧logo */}
      <div className={styles.topFlex}>
        <div style={{ width: '40px', height: '40px' }}>
          <img
            src="/portal/images/favicon.png"
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        </div>
        <div>
          <span style={{ color: '#fff', marginLeft: '25px', fontWeight: 'bold' }}>
            {sessionStorage.getItem('ucName')}
          </span>
        </div>
      </div>
      {/* 右侧用户名 */}
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.topFlex} style={{ cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px' }}>
            <img
              src={userInfo?.picture || '/portal/images/default-avatar.png'}
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </div>
          <div>
            <span
              style={{ color: '#fff', fontWeight: 'bold', marginRight: '30px', marginLeft: '10px' }}
            >
              {userInfo?.name || userInfo?.username}
            </span>
          </div>
        </div>
      </Dropdown>
    </header>
  );
};

export default Headers;
