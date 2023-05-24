import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { getUserInfo_lss, getUserInfo_ls } from './servers';
import { Dropdown, Menu, Button } from 'antd';
import { history } from 'umi';
import { VerifyuserInfos } from './data';
// import moment from 'moment';
import { PicLeftOutlined } from '@ant-design/icons';

const UserInfo: React.FC<any> = () => {
  const [userInfos, setUserInfos] = useState<VerifyuserInfos>({});
  const [userData, setUserData] = useState<any>(null); // 用户名称
  useEffect(() => {
    getUserInfo_lss().then((rs) => {
      setUserInfos(rs.data);
    });
    // 获取用户登录名称
    getUserInfo_ls().then((rs) => {
      setUserData(rs.data);
    });
  }, []);

  const handleJumpLink = (params: any) => {
    if (params.key == '1') {
      history.push('/person/userapplyforControl');
    }
  };
  const menu = (
    <Menu
      onClick={handleJumpLink}
      items={[
        {
          key: '1',
          label: (
            <span>
              {' '}
              <PicLeftOutlined /> 工作台
            </span>
          ),
        },
      ]}
    />
  );
  const handleDeparment = () => {
    const strArr: any = [];
    userInfos.orgs.forEach((is: any) => {
      strArr.push(is.position);
    });
    return strArr.join() || '未设置';
  };
  const renderOrgName = () => {
    const strArr: any = [];
    userInfos.orgs.forEach((is: any) => {
      strArr.push(is.org_name);
    });
    return strArr.join();
  };

  // const handleShowTime = () => {
  //    const start = moment(userInfos.create_time).format('YYYY-MM-DD');
  //    const end = moment(userInfos.end_date).format('YYYY-MM-DD');
  //    return `${start}--${end}`;
  // };

  // 处理性别参数
  const handleGender = () => {
    const Gender = {
      MALE: '男',
      FEMALE: '女',
      SECRET: '保密',
    };
    if (userInfos.gender) {
      return Gender[userInfos.gender];
    } else {
      return '未设置';
    }
  };
  return (
    <>
      <header className={styles.header}>
        <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
          <div
            style={{
              color: '#fff',
              fontSize: '18px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '5px' }}>
              {userData?.name || userData?.username || '未设置'}
            </span>
            <img
              src={userData?.login_url ? userData.login_url : '/portal/images/default-avatar.png'}
              style={{ width: '30px', height: '30px', borderRadius: '30px' }}
            />
          </div>
        </Dropdown>
      </header>
      {Object.keys(userInfos).length ? (
        <div style={{ marginTop: '20px', marginLeft: '80px' }}>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>用户名:</h3>
            </div>
            <span>{userInfos.nickname || userInfos?.username}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>手机号:</h3>
            </div>
            <span>{userInfos.phone_number || '暂未留下手机号'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>邮箱:</h3>
            </div>
            <span>{userInfos.email || '暂无留下邮件'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>性 别:</h3>
            </div>
            <span>{handleGender()}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>昵 称:</h3>
            </div>
            <span>{userInfos.nickname || userInfos?.username}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>部门:</h3>
            </div>
            <span>{userInfos.orgs.length || userInfos.orgs ? handleDeparment() : '未设置'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>职位:</h3>
            </div>
            <span>{userInfos.orgs.length || userInfos.orgs ? renderOrgName() : '未设置'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ width: '80px', textAlign: 'left' }}>
              <h3>有效期:</h3>
            </div>
            {/* <span>{moment(userInfos.create_time).format('YYYY-MM-DD')}</span> */}
            <span>
              {/* {userInfos.create_time && userInfos.end_date ? handleShowTime() : '永不过期'} */}
              {userInfos?.end_date || '永不过期'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '35%' }}>
            <Button
              type="primary"
              onClick={() => history.push('/person/userApplyforRenewal')}
              style={{ marginBottom: '30px' }}
              disabled={userInfos?.end_date ? false : true}
            >
              续期申请
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default UserInfo;
