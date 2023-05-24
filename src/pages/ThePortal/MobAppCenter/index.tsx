import React, { useEffect, useState } from 'react';
import styles from './index.less';
// import moment from 'moment';
import { Button, Dropdown, Menu, Row, Col, Input, Alert } from 'antd';
import { setDefaultApp, getUserInfo_ls } from './servers';
// import type { RangePickerProps } from 'antd/es/date-picker';
import { history } from 'umi';
// const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
// import type { UrlPar } from './addApply/data';
// const { RangePicker } = DatePicker;
// import { DemoBlock } = require('demos');
import MobileCompon from '@/components/MobileCom';
import mapUrl from '../../../utils/pictureMap';
const Index: React.FC = () => {
  const [textareaContent, setTextareaContent] = useState(''); // 文本区域
  const [first, setfirst] = useState(0); // 开始时间
  const [firstTwo, setfirstTwot] = useState(0); // 结束时间
  const [description, setDescription] = useState(''); // 描述
  const [title, setTitle] = useState(''); //标题
  const [userData, setUserData] = useState<any>(null); // 用户名称
  const [success, setSuccess] = useState(true); // 若申请成功则不显示主体内容
  // const GetRequest = () => {
  //    let url = location.search;
  //    let strs;
  //    const theRequest = new Object();
  //    if (url.indexOf('?') != -1) {
  //       url = url.split('?')[1];
  //       strs = url.split('&');
  //       for (let i = 0; i < strs.length; i++) {
  //          theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
  //       }
  //    }
  //    return theRequest as UrlPar;
  // };
  useEffect(() => {
    const items = history.location.state?.a;
    setDescription(items?.description);
    setTitle(items?.client_name);
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
          label: <span>工作台</span>,
        },
      ]}
    />
  );
  // // 获取开始时间
  // const onchangeStartTimeFunc = (date: any, dateStrign: any) => {
  //   setfirst(dateStrign);
  // };
  // // 获取结束时间
  // const onchangeEndTimeFunc = (date: any, dateString: any) => {
  //   setfirstTwot(dateString);
  // };
  // 获取文本内容
  const textareaOnchange = (val: any) => {
    const vals = val.target.value;
    setTextareaContent(vals);
  };
  // 处理申请接口
  const handleClickAppliy = () => {
    setDefaultApp({
      client_id: history.location.state?.a,
      end_date: firstTwo,
      reason: textareaContent,
      start_date: first,
    }).then(() => {
      // 如果成功  message.success('This is a success message');
      setSuccess(true);
    });
  };
  // 禁止时间
  // const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  //   return current && current < moment().endOf('day');
  // };
  const handleMobileEvent = (timeArr: any) => {
    setfirst(timeArr[0]);
    setfirstTwot(timeArr[1]);
  };
  return (
    <>
      <div style={{ padding: '0' }}>
        <header className={styles.header}>
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <div
              style={{
                color: '#fff',
                fontSize: '18px',
                marginRight: '20px',
              }}
            >
              <div style={{ display: 'flex' }}>
                <div>
                  <span style={{ marginRight: '5px' }}>{userData?.name || userData?.username}</span>
                </div>
                <div>
                  <img
                    src={
                      userData?.login_url
                        ? userData?.login_url
                        : '/portal/images/default-avatar.png'
                    }
                    alt=""
                    style={{ width: '30px', height: '30px', borderRadius: '30px' }}
                  />
                </div>
              </div>
            </div>
          </Dropdown>
        </header>
        <main>
          {success ? (
            <div className={styles.wrapBorder}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    className={styles.topIcon}
                    src={
                      userData?.logo_uri ||
                      (mapUrl.get(userData?.link_client_id)
                        ? `/portal/images/logo/${mapUrl.get(userData?.link_client_id)}`
                        : '/portal/images/application.png')
                    }
                  />
                  <div>
                    <span>{title}</span>
                  </div>
                </div>
              </div>
              <div className={styles.applicationProfileWrapper}>
                <div className={styles.applicationProfile} style={{ marginTop: '4vh' }}>
                  <span style={{ marginRight: '10px' }}>应用简介:</span>
                  <div style={{ width: '70%', letterSpacing: '4px' }}>
                    {description ? description : '暂无简介'}
                  </div>
                </div>
                <div className={styles.applicationReason} style={{ marginTop: '6vh' }}>
                  <span style={{ marginRight: '10px' }}>申请原因:</span>
                  <TextArea
                    maxLength={100}
                    style={{ height: '15vh', width: '70%', resize: 'none' }}
                    onChange={textareaOnchange}
                  />
                </div>
                <div
                  className={styles.userTime}
                  style={{ marginTop: '6vh', display: 'flex', marginLeft: '15px' }}
                >
                  <span style={{ marginRight: '10px' }}>选择时间:</span>
                  <div>
                    <MobileCompon onMobileEvent={handleMobileEvent}></MobileCompon>
                  </div>
                </div>

                <footer style={{ paddingBottom: '30px' }}>
                  <Row align="middle" justify="center" style={{ marginTop: '30px' }}>
                    <Col>
                      <Button
                        type="primary"
                        style={{ padding: '0 25px' }}
                        onClick={handleClickAppliy}
                      >
                        申请
                      </Button>
                    </Col>
                  </Row>
                </footer>
              </div>
            </div>
          ) : (
            <div className={styles.wrapBorder}>
              <Alert
                message="申请已提交,请关注钉钉审批结果"
                type="success"
                showIcon
                style={{ width: '70%', margin: '0 auto', marginTop: '100px' }}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};
export default Index;
