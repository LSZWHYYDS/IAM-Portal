import React, { useState, useEffect } from 'react';
import type { Moment } from 'moment';
import {
  Card,
  Typography,
  Menu,
  Dropdown,
  Spin,
  Button,
  Row,
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  message,
} from 'antd';
// import Headers from '@/components/Headers';
import { LogoutOutlined, SettingOutlined, PicLeftOutlined } from '@ant-design/icons';
import { logout } from '@/pages/Account/service';
import { clearLoginStorage } from '@/utils/common.utils';
// import { stringify } from 'querystring';
// import type { MenuInfo } from 'rc-menu/lib/interface';
import moment from 'moment';
import styles from './userinfo.less';
import { history, useModel } from 'umi';
const { Title } = Typography;
// const { location } = history;
const { TextArea } = Input;
import { getUserInfo_ls } from '../server';

import type { VerifyuserInfos } from '../data';

import { modifyPassword, modifyRenew } from './servers';
import useStateCallback from './utils';
const dateFormat = 'YYYY-MM-DD';

const ModifyCom: React.FC<any> = (props) => {
  const onFinish = (values: any) => {
    modifyPassword({
      new_password: values.new_password,
      old_password: values.old_password,
      username: props.userInfos?.username,
    }).then(() => {
      message.success('修改成功');
    });
  };
  return (
    <>
      <div style={{ width: '800px', marginLeft: '10px' }}>
        <Card
          title={
            <div
              style={{
                backgroundColor: '#F2F2F2',
                width: '800px',
                height: '50px',
                paddingTop: '10px',
              }}
            >
              <span style={{ marginLeft: '10px' }}>修改密码</span>
            </div>
          }
          style={{ width: '100%', height: '100%' }}
          headStyle={{ padding: '0 5px' }}
        >
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <div>
              <div style={{ marginLeft: '70px' }}>
                <h3 style={{ fontWeight: '600' }}>密码复杂度要求:</h3>
                <ul>
                  <li style={{ fontWeight: '600', marginTop: '10px' }}>最短长度: 7位</li>
                  <li style={{ fontWeight: '600', marginTop: '10px' }}>
                    {' '}
                    必须包含:大小写字母以及数字
                  </li>
                </ul>
              </div>
              <Divider dashed style={{ width: '240%' }} />
            </div>
          </div>
          <div>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
              onFinish={onFinish}
              autoComplete="off"
              size="small"
            >
              <Form.Item
                label="当前密码"
                name="old_password"
                rules={[{ required: true, message: '请输入的当前密码' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="new_password"
                label="新密码"
                rules={[
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['new_password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请输入你的确认密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码必须保持一致'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item labelCol={{ span: 7 }} label=" " colon={false}>
                <Row>
                  <Col span={15}>
                    <Button type="primary" block htmlType="submit" size="middle">
                      提交
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};

const AccessRenewal: React.FC<any> = (props) => {
  const onFinishRenewal = (values: any) => {
    modifyRenew({
      apply_explain: values.RenewalName,
      detail_url: '',
      end_date: values.RenewalTime.format('YYYY-MM-DD'),
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
    props.userInfos?.orgs.forEach((is: any) => {
      strArr.push(is.position);
    });
    return strArr.join();
  };
  const renderOrgName = () => {
    const strArr: any = [];
    props.userInfos?.orgs.forEach((is: any) => {
      strArr.push(is.org_name);
    });
    return strArr.join();
  };
  const handleGender = () => {
    const objGneder = {
      MALE: '男',
      FEMALE: '女',
      SECRET: '保密',
    };
    return objGneder[props.userInfos?.gender];
  };
  // 开始时间可选范围
  const handleStartDisabledDate = (current: Moment) => {
    // return current < moment().add(-1, 'day');
    return current < moment(new Date(props.userInfos?.end_date).getTime());
  };
  return (
    <>
      <div style={{ width: '800px', marginLeft: '10px' }}>
        <Card
          title={
            <div
              style={{
                backgroundColor: '#F2F2F2',
                width: '800px',
                height: '50px',
                paddingTop: '10px',
              }}
            >
              <span style={{ marginLeft: '10px' }}>续期申请</span>
            </div>
          }
          style={{ width: '100%' }}
          headStyle={{ padding: '0 5px' }}
        >
          <div style={{ width: '90%', height: 'fit-content', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  用户名:
                </strong>
                <span>{props.userInfos?.nickname || props.userInfos?.username}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  部&nbsp;&nbsp;&nbsp;门&nbsp;:
                </strong>
                <span style={{ width: '200px', display: 'inline-block' }}>
                  {handleDeparment() || '---'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  手机号:
                </strong>
                <span>{props.userInfos?.phone_number || '---'}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  职&nbsp;&nbsp;&nbsp;位&nbsp;:
                </strong>
                <span style={{ width: '200px', display: 'inline-block' }}>
                  {' '}
                  <span>{renderOrgName() || '---'}</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  邮箱:
                </strong>
                <span>{props.userInfos?.email || '---'}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  创建时间:
                </strong>
                <span style={{ width: '200px', display: 'inline-block' }}>
                  {moment.utc(Number(props.userInfos?.create_time)).format('YYYY-MM-DD') || '---'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  性别:
                </strong>
                <span>{handleGender() || '---'}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  昵称:
                </strong>
                <span style={{ width: '200px', display: 'inline-block' }}>
                  {props.userInfos?.nickname || props.userInfos?.username}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', marginBottom: '20px' }}>
              <div style={{ display: 'flex' }}>
                <strong style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>
                  账号有效期:
                </strong>
                <span>
                  {' '}
                  {/* {moment.utc(Number(props.userInfos?.end_date)).format('YYYY-MM-DD') || '永不过期'} */}
                  {props.userInfos?.end_date || '永不过期'}
                </span>
              </div>
            </div>
            <Form
              name="basicss"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 8 }}
              initialValues={{ remember: true }}
              onFinish={onFinishRenewal}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="small"
              style={{ marginTop: '60px' }}
            >
              <Form.Item
                label="续期时间"
                name="RenewalTime"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker
                  size={'middle'}
                  style={{ width: '100%' }}
                  format={dateFormat}
                  disabledDate={handleStartDisabledDate}
                />
              </Form.Item>

              <Form.Item
                label="申请说明"
                name="RenewalName"
                rules={[{ required: true, message: '请输入你的申请说明' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入你的申请说明"
                  maxLength={6}
                  style={{ resize: 'none' }}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 6 }}
                label=" "
                colon={false}
                style={{ marginTop: '30px' }}
              >
                <Row>
                  <Col span={10}>
                    <Button type="primary" block htmlType="submit">
                      提交
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};

const BaseInfoMation: React.FC<any> = (props) => {
  const handleDeparment = () => {
    const strArr: any = [];
    props.userInfos?.orgs.forEach((is: any) => {
      strArr.push(is.position);
    });
    return strArr.join();
  };

  const renderOrgName = () => {
    const strArr: any = [];
    props.userInfos?.orgs.forEach((is: any) => {
      strArr.push(is.org_name);
    });
    return strArr.join();
  };
  const handleGender = () => {
    const objGneder = {
      MALE: '男',
      FEMALE: '女',
      SECRET: '保密',
    };
    return objGneder[props.userInfos?.gender];
  };
  return (
    <>
      <div style={{ width: '800px', marginLeft: '10px' }}>
        <Card
          title={
            <div
              style={{
                backgroundColor: '#F2F2F2',
                width: '800px',
                height: '50px',
                paddingTop: '10px',
              }}
            >
              <span style={{ marginLeft: '10px' }}>基本信息</span>
            </div>
          }
          style={{ width: '100%' }}
          headStyle={{ padding: '0 5px' }}
        >
          <div style={{ display: 'flex', marginBottom: '50px' }}>
            <div style={{ width: '50%' }}>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                用户名&nbsp;:
              </span>
              <span>{props.userInfos?.nickname || props.userInfos?.username}</span>
            </div>
            <div>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                部&nbsp;&nbsp;&nbsp;门&nbsp;:
              </span>
              <span>{handleDeparment() || '---'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '50px' }}>
            <div style={{ width: '50%' }}>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                手机号&nbsp;:
              </span>
              <span>{props.userInfos?.phone_number || '---'}</span>
            </div>
            <div>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位&nbsp;:
              </span>
              <span>{renderOrgName() || '---'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '50px' }}>
            <div style={{ width: '50%' }}>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱&nbsp;:
              </span>
              <span>{props.userInfos?.email || '---'}</span>
            </div>
            <div>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                创建时间&nbsp;:
              </span>
              {moment.utc(Number(props.userInfos?.create_time)).format('YYYY-MM-DD') || '---'}
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '50px' }}>
            <div style={{ width: '50%' }}>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别&nbsp;:
              </span>
              {handleGender() || '---'}
            </div>

            <div style={{ width: '50%' }}>
              <span style={{ width: '80px', marginRight: '30px', fontWeight: 'bold' }}>
                昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称&nbsp;:
              </span>
              {props.userInfos?.nickname || props.userInfos?.username}
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '50px' }}>
            <div style={{ display: 'flex', marginBottom: '50px' }}>
              <div>
                <span style={{ marginRight: '0', fontWeight: 'bold' }}>
                  账号有效期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                {/* {props.userInfos?.end_date
                  ? moment.utc(Number(props.userInfos?.end_date)).format('YYYY-MM-DD')
                  : '永不过期'} */}
                {props.userInfos?.end_date ? props.userInfos?.end_date : '永不过期'}
              </div>
            </div>

            <Button
              type="primary"
              style={{ marginLeft: '30%' }}
              onClick={() => props.modifyVariable('1')}
              disabled={props.userInfos?.end_date ? false : true}
            >
              续期申请
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

const UserInfos: React.FC<any> = () => {
  const [userInfos, setUserInfos] = useState<VerifyuserInfos>();
  const [first, setFirst] = useStateCallback('2');
  const [loadings, setLoadings] = useState(true);
  const hanldeSwitchCom = (val: any) => {
    setFirst(val);
  };
  useEffect(() => {
    getUserInfo_ls().then((rs) => {
      setUserInfos(rs.data);
      hanldeSwitchCom(first);
      setLoadings(false);
    });
  }, []);
  const { setInitialState } = useModel('@@initialState');
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    try {
      const tcode = sessionStorage.getItem('tcode');
      clearLoginStorage();
      logout(location.origin + `/uc/?tcode=${tcode}`);
    } catch (e) {}
  };
  const menu = (
    <Menu
      items={[
        {
          label: (
            <span
              onClick={() => history.push('/person/selfInfo')}
              style={{ display: 'inline-block', width: '100%' }}
            >
              <PicLeftOutlined style={{ marginRight: '10px' }} />
              工作台
            </span>
          ),
          key: '1',
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
                display: userInfos?.permissions_sets?.length == 0 ? 'none' : 'inline-block',
                width: '100%',
              }}
            >
              <SettingOutlined style={{ marginRight: '10px' }}></SettingOutlined>
              管理平台
            </span>
          ),
          key: '2',
        },

        {
          label: (
            <span onClick={() => loginOut()}>
              {' '}
              <LogoutOutlined style={{ marginRight: '5px' }} /> 退出登录
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

  let a;
  if (userInfos && first == '0') {
    a = <ModifyCom userInfos={userInfos}></ModifyCom>;
  } else if (userInfos && first == '1') {
    a = <AccessRenewal userInfos={userInfos}></AccessRenewal>;
  } else {
    a = <BaseInfoMation userInfos={userInfos} modifyVariable={hanldeSwitchCom}></BaseInfoMation>;
  }
  return (
    <div style={{ backgroundColor: '#e8e8e8', height: '100%' }}>
      <Spin spinning={loadings} style={{ backgroundColor: '#e8e8e8', maxHeight: 'unset' }}>
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
                  src={
                    userInfos?.logo_uri ? userInfos.logo_uri : '/portal/images/default-avatar.png'
                  }
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              </div>
              <div>
                <span
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    marginRight: '30px',
                    marginLeft: '10px',
                  }}
                >
                  {userInfos?.name || userInfos?.username}
                </span>
              </div>
            </div>
          </Dropdown>
        </header>
        <div
          style={{
            width: 'fit-content',
            height: 'fit-content',
            margin: '50px auto 0',
            display: 'flex',
          }}
        >
          <div style={{ width: '260px', display: 'flex', flexDirection: 'column' }}>
            <Card
              style={{
                width: 260,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', textAlign: 'center' }}>
                  <img
                    src={
                      userInfos?.logo_uri ? userInfos.logo_uri : '/portal/images/default-avatar.png'
                    }
                    style={{ width: '100%', height: '100%', borderRadius: '20px' }}
                  />
                </div>
                <h5 style={{ marginTop: '20px', fontSize: '20px' }}>
                  {userInfos?.name || userInfos?.username}
                </h5>
              </div>
            </Card>
            <Card
              style={{
                width: 260,
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px 0',
                marginTop: '10px',
                position: 'relative',
                bottom: 0,
                left: 0,
              }}
            >
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Title
                  level={5}
                  style={{
                    marginBottom: '40px',
                    cursor: 'pointer',
                    width: '100%',
                    lineHeight: '2',
                  }}
                  className={`${styles.titleHover} ${first == '2' ? styles.active : ''}`}
                  onClick={() => hanldeSwitchCom('2')}
                >
                  个人信息
                </Title>
                <Title
                  level={5}
                  style={{
                    marginBottom: '40px',
                    cursor: 'pointer',
                    width: '100%',
                    lineHeight: '2',
                  }}
                  className={`${styles.titleHover} ${first == '0' ? styles.active : ''}`}
                  onClick={() => hanldeSwitchCom('0')}
                >
                  修改密码
                </Title>
                {/* <Title
                level={5}
                className={`${styles.titleHover} ${first == '1' ? styles.active : ''}`}
                style={{ marginBottom: '40px', cursor: 'pointer' }}
                onClick={() => hanldeSwitchCom('1')}
              >
                延期续费
              </Title> */}
              </div>
            </Card>
          </div>
          {userInfos ? a : ''}
        </div>
      </Spin>
    </div>
  );
};

export default UserInfos;
