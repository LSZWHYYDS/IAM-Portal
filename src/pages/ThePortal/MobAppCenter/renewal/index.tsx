import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button, message } from 'antd';
import { getUserInfo_ls } from '../servers';
import { history } from 'umi';
import styles from '../index.less';
import { Divider, Cell, TextArea, DatePicker } from '@nutui/nutui-react';
import '@nutui/nutui-react/dist/style.css';
import { modifyRenew } from './server';
import moment from 'moment';
const Index: React.FC<any> = () => {
  const [userInfos, setUserInfos] = useState<any>();
  const [userData, setUserData] = useState<any>(null); // 用户名称
  const [value2] = useState('');
  const [show1, setShow1] = useState(false);
  const [time, setTime] = useState('请选择时间');
  const [textArea, setTextArea] = useState('');
  const confirm1 = (values: any, options: any[]) => {
    const a = options
      .map((option) => option.text)
      .join(' ')
      .replaceAll('年 ', '-');
    const b = a.replaceAll('月 ', '-');
    const c = b.replaceAll('日', '');
    setTime(c);
  };

  useEffect(() => {
    // 获取用户登录名称
    getUserInfo_ls().then((rs) => {
      setUserInfos(rs.data);
      setUserData(rs.data);
    });
  }, []);

  const submit_ls = () => {
    if (!textArea) return message.error('请填写申请原因');
    modifyRenew({
      apply_explain: textArea,
      detail_url: '',
      end_date: time,
      apply_type: '申请延期',
      // user_count: '1',
      user_number: '1',
    }).then((ra) => {
      if (ra.status == 500) {
        message.success('服务器错误');
      } else {
        message.success('申请成功');
      }
    });
  };

  const handleDeparment = () => {
    const strArr: any = [];
    if (userInfos.orgs) {
      userInfos.orgs.forEach((is: any) => {
        strArr.push(is.position);
      });
    }
    return strArr.join();
  };
  const renderOrgName = () => {
    const strArr: any = [];
    if (userInfos.orgs) {
      userInfos.orgs.forEach((is: any) => {
        strArr.push(is.org_name);
      });
    }
    return strArr.join();
  };
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
          label: <span>工作台</span>,
        },
      ]}
    />
  );

  const tetxOnchange = (value: any) => {
    setTextArea(value);
  };

  return (
    <div style={{ background: '#F7F8FA', height: '100%', maxHeight: 'unset' }}>
      {userInfos?.end_date ? (
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
                  src={
                    userData?.login_url ? userData.login_url : '/portal/images/default-avatar.png'
                  }
                  style={{ width: '30px', height: '30px', borderRadius: '30px' }}
                />
              </div>
            </Dropdown>
          </header>
          <Divider contentPosition="left">续期申请</Divider>
          <div>
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    用户名:
                  </span>
                  <span>{userInfos?.nickname || userInfos?.username}</span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    手机号:
                  </span>
                  <span>{userInfos?.phone_number || '未设置'}</span>{' '}
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    邮箱:
                  </span>
                  <span>{userInfos?.email || '未设置'}</span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    性别:
                  </span>
                  <span>
                    {userInfos?.gender == 'MALE'
                      ? '男'
                      : userInfos?.gender == 'FEMALE'
                      ? '女'
                      : '保密'}
                  </span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    昵称:
                  </span>
                  <span>{userInfos?.nickname || userInfos?.username}</span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    部门:
                  </span>
                  <span>{userInfos ? handleDeparment() : '未设置'}</span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    职位:
                  </span>
                  <span>{userInfos ? renderOrgName() : '未设置'}</span>
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '80px',
                      textAlign: 'right',
                      marginRight: 15,
                    }}
                  >
                    创建时间:
                  </span>
                  {moment.utc(Number(userInfos?.create_time)).format('YYYY-MM-DD') || '未设置'}
                </div>
              }
            />
            <Cell
              title={
                <div>
                  <Cell
                    title={
                      <div>
                        <span>续期时间:</span>
                        <span style={{ marginLeft: '5%' }}>{time}</span>
                      </div>
                    }
                    onClick={() => setShow1(true)}
                    descTextAlign="left"
                  />
                  <DatePicker
                    title="日期选择"
                    visible={show1}
                    minDate={userInfos?.end_date ? new Date(userInfos?.end_date) : new Date()}
                    isShowChinese
                    onCloseDatePicker={() => setShow1(false)}
                    onConfirmDatePicker={(values, options) => confirm1(values, options)}
                  />
                </div>
              }
            />
            <Cell
              title={
                <div style={{ display: 'flex' }} className={styles.cellstyle}>
                  <span
                    style={{
                      marginLeft: '20px',
                      marginRight: '10px',
                      width: '80px',
                      display: 'inline-block',
                    }}
                  >
                    申请说明:
                  </span>
                  <TextArea
                    defaultValue={value2}
                    maxlength="50"
                    onChange={tetxOnchange}
                    style={{ border: '1px solid #e8e8e8', padding: '5px 10px' }}
                  />
                </div>
              }
            />

            <Button
              type="primary"
              style={{ marginLeft: '40%', marginTop: '10px', marginBottom: '30px' }}
              onClick={submit_ls}
            >
              提交
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Index;
