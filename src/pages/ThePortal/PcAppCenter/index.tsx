import React, { useState, useEffect } from 'react';
import type { Moment } from 'moment';
import {
  Space,
  Card,
  Input,
  Tag,
  Tabs,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
  message,
  Empty,
  Spin,
  Form,
  Collapse,
} from 'antd';
import {
  CloseOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import AddPopup from './components/addPopup';
import { getAppLists_ls } from './server';
import type { VerifyUserInfo, AppInfoVerify } from './data.d';
import styles from './indexModel.less';
import './index.less';
import { setDefaultApp, requestData } from '../MobAppCenter/servers';
import { getMeApplicationList, deleteMeApplicationList } from './server';
// const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
const { Search, TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
import mapUrl from '../../../utils/pictureMap';
import { getTwoDates } from '@/utils/common.utils';
const defaultSearchRange = getTwoDates(moment().subtract(6, 'day'), moment().endOf('day'));
// const defaultSearchRange_ls = getTwoDates(moment().subtract(0, 'day'), moment().endOf('day'));
const { Panel } = Collapse;
type VerifyCallSearch = (str: string) => void;

const renderElementFunc1 = (callback_search: VerifyCallSearch) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Space align="center" style={{ width: '100px' }}>
        <AppstoreAddOutlined style={{ color: '#b8b8b8' }} />
        <span style={{ color: '#b8b8b8', display: 'inline-block', width: '100%' }}>应用中心</span>
      </Space>
      <Space style={{ marginLeft: '50px' }}>
        <Search
          placeholder="请输入应用名称"
          allowClear
          style={{
            width: 260,
          }}
          onSearch={callback_search}
          onPressEnter={(e) => {
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
          }}
        />
        {/* <Button type="dashed" style={{ marginLeft: '30px' }} onClick={callback_refresh}>
          刷新
        </Button> */}
      </Space>
    </div>
  );
};

// strart func
const ApplicationCenter: React.FC<any> = () => {
  const [visible, setVisible] = useState(false); // 控制模态框显示
  const [textareaContent, setTextareaContent] = useState(''); // 文本区域
  const [firsts, setfirsts] = useState<any>(0); // 开始时间
  const [firstTwo, setfirstTwot] = useState<any>(0); // 结束时间
  // firsts && firstTwo
  const [visibleadd, setVisibleadd] = useState(false);
  const [clientid, setClientid] = useState<string>('');
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [appdata, setAppdata] = useState<any[]>([]);
  const [appclassification, setAppclassification] = useState<any>([]);
  // 分类ID数组
  const [categoryid, setCategoryid] = useState<any[]>([]);
  // 用户弹窗信息
  const [userPrup, setUserPrup] = useState<VerifyUserInfo>();
  // 我的应用列表
  const [meArrlist, setMeArrList] = useState<any>([]);
  // 制定删除下标索引
  const [deleteIndex, setDeleteIndex] = useState<number | string>(' ');
  // 保存我的应用ID
  const [meId, setMeId] = useState<number[]>([]);
  // 控制是否显示x号
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const [form] = Form.useForm();

  const renderElementFunc = (callback_search: VerifyCallSearch) => {
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Space align="center" style={{ width: '100px' }}>
          <CustomerServiceOutlined style={{ color: '#b8b8b8' }} />
          <span style={{ color: '#b8b8b8' }}>我的</span>
        </Space>
        <Space style={{ marginLeft: '50px' }}>
          <Search
            placeholder="请输入应用名称"
            allowClear
            style={{
              width: 260,
            }}
            onSearch={callback_search}
            onPressEnter={(e) => {
              e.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
          <SettingOutlined
            style={{
              fontSize: '20px',
              marginLeft: '10px',
              cursor: 'pointer',
              color: isShowAdd ? '#a5a5a5' : '#757575',
              transform: isShowAdd ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
              transition: '.5s',
            }}
            onClick={() => setIsShowAdd((newValue) => !newValue)}
          />
        </Space>
      </div>
    );
  };
  const [disabled, setDisabled] = useState(true);
  const requestToalAPPList = () => {
    getAppLists_ls({}).then((rs: any) => {
      const a = rs.data.items.filter((is: any) => is.authed != true);
      const b = rs.data.items.filter((is: any) => is.authed == true);
      setAppdata(() => {
        return b.concat(a);
      });
      return Promise.resolve(1);
    });
  };
  // 1全部   2其他
  const requestMeClassification = () => {
    requestData().then((res) => {
      setAppclassification(() => [
        { category_name: '全部', id: 'all' },
        ...res.data,
        { category_name: '其他', id: 'other' },
      ]);
      res.data.forEach((rss: any) => {
        setCategoryid(() => {
          const arr = [];
          arr.push(rss.id);
          return arr;
        });
      });
      return Promise.resolve(2);
    });
  };

  const requestMeAppList = () => {
    getMeApplicationList().then((rs) => {
      try {
        const as: any = [];
        rs.data.items.forEach((items: any) => {
          as.push(items.client_id);
        });
        setMeId(as);
        setMeArrList(rs.data.items);
        return Promise.resolve(3);
      } catch {
        message.error('暂未数据');
      }
      return;
    });
  };

  useEffect(() => {
    Promise.all([requestToalAPPList(), requestMeClassification(), requestMeAppList()]).then(() => {
      setTimeout(() => {
        setLoading1(false);
        setLoading2(false);
      }, 1000);
    });
  }, []);

  /**
   * 删除Tag标签
   */
  const CloseTag = (event: any, item: any, client_id: any, index: number) => {
    const newTags = meArrlist.filter((tag: any) => tag.client_name !== item);
    deleteMeApplicationList(client_id).then((rs) => {
      if (!Number(rs.error)) {
        if (newTags.length == 0) {
          newTags.push({ id: 1 });
        }
        setMeArrList(newTags);
        message.success('删除成功~');
        setDeleteIndex(index);
        // 重新请求我的应用ID
        requestMeAppList();
      }
    });
  };
  /**
   * 切换Tag标签
   */
  const onChangeTags = (val: any) => {
    setLoading2(true);
    if (val == 'all') {
      getAppLists_ls().then((rs: any) => {
        const firstArr = rs.data.items.filter((is: any) => is.authed != null);
        const lastArr = rs.data.items.filter((is: any) => is.authed == null);
        setAppdata(lastArr.concat(firstArr));
        setLoading2(false);
      });
    } else if (val == 'other') {
      getAppLists_ls().then((rs) => {
        const filterArr = rs.data.items.filter((filIs: any) => {
          return !categoryid.includes(filIs.custom_class);
        });
        setLoading2(false);
        setAppdata(filterArr);
      });
    } else {
      getAppLists_ls({ category_id: val }).then((rs) => {
        const a = rs.data.items.filter((is: any) => is.authed != null);
        const b = rs.data.items.filter((is: any) => is.authed == null);
        setLoading2(false);
        setAppdata(b.concat(a));
      });
    }
  };

  const handleFunc = (client_ids: any, items: any, val: boolean) => {
    if (!val) {
      setVisible(true);
      setDisabled(false);
      setClientid(client_ids);
      setUserPrup(items);
      setTextareaContent('');
      form.resetFields();
    }
  };

  const jumpLinkFunc = (val: any, link_client_id?: any, client_id?: any) => {
    if (val) {
      window.location.href = val;
    } else {
      // message.error('此应用未设置链接');
      if (!val && !link_client_id) {
        window.location.href = location.origin + `/iam/other/${client_id}/login`;
      } else {
        message.error('此应用未设置链接');
      }
    }
  };
  /**
   * 显示模态框
   */
  const showModel = (val: string, client_ids: string, bol: boolean, items: any) => {
    return bol
      ? jumpLinkFunc(val, items.link_client_id, items.client_id)
      : handleFunc(client_ids, items, bol);
  };
  // 获取文本内容
  const textareaOnchange = (val: any) => {
    const vals = val.target.value;
    setTextareaContent(vals);
  };
  // 处理申请接口
  const handleClickAppliy = () => {
    if (!textareaContent || !(firsts && firstTwo)) {
      message.error('请填写申请原因或选择时间');
      return;
    }
    setDisabled(true);
    setDefaultApp({
      client_id: clientid,
      end_date: firstTwo ? firstTwo : defaultSearchRange[1].format('YYYYMMDD'),
      reason: textareaContent,
      start_date: firsts ? firsts : defaultSearchRange[0].format('YYYYMMDD'),
    })
      .then(() => {
        message.success('申请成功');
        setVisible(false); // 如果成功关闭抽屉
      })
      .finally(() => {
        setVisible(false); // 如果成功关闭抽屉
        requestToalAPPList();
      });
  };
  const onClose = () => {
    setVisible(false);
  };
  const rendreApplyIcon = () => {
    return (
      <div className="borderInfo">
        <div style={{ color: '#fff', position: 'absolute', top: '-28px', fontSize: '16px' }}>
          申
        </div>
        <div
          style={{
            color: '#fff',
            position: 'absolute',
            top: '-10px',
            fontSize: '16px',
            right: '-25px',
          }}
        >
          请
        </div>
      </div>
    );
  };
  const onSearch = (val: string) => {
    getAppLists_ls({ client_name: val }).then((rs: any) => {
      const a = rs.data.items.filter((is: any) => is.authed != null);
      const b = rs.data.items.filter((is: any) => is.authed == null);
      setAppdata(b.concat(a));
    });
  };
  const onSearchs_me = (val: any) => {
    if (val) {
      const tempArr = meArrlist.filter((maps: any) => {
        return maps.client_name?.indexOf(val) != -1;
      });
      setMeArrList(tempArr);
    } else {
      getMeApplicationList().then((rs) => {
        try {
          setMeArrList(rs.data.items);
        } catch {
          message.error('暂未数据');
        }
      });
    }
  };
  const refreshData_me = () => {
    getMeApplicationList().then((rs) => {
      try {
        setMeArrList(rs.data.items);
      } catch {
        message.error('暂未数据');
      }
    });
  };
  const refreshData = () => {
    getAppLists_ls({}).then((rs: any) => {
      const a = rs.data.items.filter((is: any) => is.authed != null);
      const b = rs.data.items.filter((is: any) => is.authed == null);
      setAppdata(b.concat(a));
    });
  };
  const handleErrorFunc = (e: any) => {
    e.target.src = '/portal/images/application.png';
  };

  // 打开添加列表抽屉
  const openAddDrawer = () => {
    setVisibleadd(true);
  };

  const renderTag = () => {
    return (
      <Space
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <div
          id="domRef"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {appdata.length ? (
            appdata.map((is: AppInfoVerify, inx: number) => (
              <div
                style={{
                  width: '392px',
                  display: 'flex',
                  justifyContent: 'center',
                  margin: 0,
                }}
              >
                <Tag
                  className={styles.tags}
                  key={inx}
                  onClick={() => showModel(is.client_uri, is.client_id, is.authed, is)}
                  style={{
                    marginTop: '20px',
                    marginBottom: '50px',
                    width: '292px',
                    borderRadius: '6px',
                    border: '1px solid rgb(228, 228, 228)',
                  }}
                >
                  {is.authed ? '' : rendreApplyIcon()}
                  <div
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      alignItems: 'center',
                      padding: '2px 15px 15px',
                    }}
                  >
                    <img
                      src={
                        is?.logo_uri ||
                        (mapUrl.get(is?.link_client_id)
                          ? `/portal/images/logo/${mapUrl.get(is?.link_client_id)}`
                          : '/portal/images/application.png')
                      }
                      style={{
                        width: '60px',
                        height: '60px',
                        marginRight: '10px',
                        backgroundSize: 'cover',
                        borderRadius: '10px',
                      }}
                      onError={() => handleErrorFunc(event)}
                    />
                    <div className="ellipsis" title={is.client_name}>
                      {is.client_name || '未设置昵称'}
                    </div>
                  </div>
                </Tag>
              </div>
            ))
          ) : (
            <div style={{ height: '120px', width: '300px', margin: '0 auto', marginLeft: '700px' }}>
              <Empty></Empty>
            </div>
          )}
        </div>
      </Space>
    );
  };

  const controlCloseFunc = () => {
    setVisibleadd(false);
  };
  // 处理刷新列表
  const hanldeRefreList = () => {
    getMeApplicationList().then((rs) => {
      setMeArrList(rs.data.items);
    });
  };
  // 处理图片错误
  const handleErrorFuncs = (e: any) => {
    e.target.src = '/portal/images/application.png';
  };

  // 渲染HTML元素
  const renderHtmlElement = () => {
    return appclassification.map((items_s: any) => (
      <TabPane tab={items_s.category_name} key={items_s.id} style={{ width: '100%' }}>
        {renderTag()}
      </TabPane>
    ));
  };
  const RangeChangeFunc = (values: any) => {
    setfirsts(values[0].format('YYYY-MM-DD'));
    setfirstTwot(values[1].format('YYYY-MM-DD'));
  };
  // 开始时间可选范围
  const handleStartDisabledDate = (current: Moment) => {
    return current < moment().add(-1, 'day');
  };
  return (
    <Spin spinning={loading1} size="large" style={{ backgroundColor: '#E8E8E8', height: '100%' }}>
      <div
        style={{
          backgroundColor: '#e8e8e8',
          userSelect: 'none',
          height: 'fit-content',
          paddingBottom: '20px',
        }}
      >
        <div
          style={{
            padding: '20px 1% 0',
            backgroundColor: 'transparent',
            width: '1700px',
            margin: '0 auto',
          }}
        >
          <Collapse defaultActiveKey={['1']}>
            <Panel header={renderElementFunc(onSearchs_me, refreshData_me)} key="1">
              <Card bordered={false}>
                <Space
                  wrap={true}
                  style={{ width: '100%', justifyContent: 'space-between' }}
                  className={styles.wrapper}
                >
                  <div
                    id="domRef2"
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'start',
                      flexWrap: 'wrap',
                      position: 'relative',
                    }}
                  >
                    {meArrlist.map((item: any, index: any) => {
                      if (!item.id) {
                        return (
                          <div
                            style={{
                              width: '392px',
                              display: 'flex',
                              justifyContent: 'center',
                              margin: '0',
                            }}
                          >
                            <Tag
                              className={styles.hoverStyle}
                              style={{
                                width: '292px',
                                height: '88.97px',
                                position: 'relative',
                                padding: '18px 22px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                boxSizing: 'border-box',
                                marginBottom: '20px',
                                borderRadius: '6px',
                                border: '1px solid rgb(228, 228, 228)',
                              }}
                              key={item.name}
                              onClick={() => {
                                jumpLinkFunc(item.client_uri, item.link_client_id, item.client_id);
                              }}
                            >
                              {isShowAdd ? (
                                <>
                                  <div
                                    style={{
                                      position: 'absolute',
                                      right: '6px',
                                      top: '3px',
                                      fontSize: '14px',
                                      cursor: 'pointer',
                                      zIndex: 10,
                                      color: '#808080',
                                    }}
                                    onClick={() => {
                                      CloseTag(event, item.client_name, item.client_id, index);
                                    }}
                                  >
                                    <CloseOutlined />
                                  </div>
                                </>
                              ) : (
                                ''
                              )}
                              <img
                                src={
                                  item?.logo_uri ||
                                  (mapUrl.get(item?.link_client_id)
                                    ? `/portal/images/logo/${mapUrl.get(item?.link_client_id)}`
                                    : '/portal/images/application.png')
                                }
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '10px',
                                  backgroundSize: 'cover',
                                }}
                                onError={() => handleErrorFuncs(event)}
                              />
                              <div>
                                <div className="ellipsis" title={item.client_name}>
                                  {item.client_name || '未设置昵称'}
                                </div>
                              </div>
                            </Tag>
                          </div>
                        );
                      } else {
                        return;
                      }
                    })}
                    <div style={{ width: '292px' }}>
                      <div
                        style={{
                          width: '392px',
                          display: 'flex',
                          justifyContent: 'center',
                          marginLeft: '-5px',
                        }}
                      >
                        <div
                          className="addApplication"
                          onClick={() => openAddDrawer()}
                          style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}
                        >
                          <div className="insert_add">
                            <div className="add">
                              <img
                                src="/portal/images/add.png"
                                style={{ width: '60px', height: '60px' }}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              color: '#38adff',
                              letterSpacing: '3px',
                              fontWeight: '400',
                              marginLeft: '20px',
                            }}
                          >
                            添加你的应用
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Space>
              </Card>
            </Panel>
          </Collapse>
        </div>
        <div
          style={{
            padding: '1% 1% 0',
            backgroundColor: 'transparent',
            width: '1700px',
            margin: '0 auto',
          }}
        >
          <Collapse defaultActiveKey={['1']}>
            <Panel header={renderElementFunc1(onSearch, refreshData)} key="1">
              <Card style={{ width: '100%' }} bordered={false}>
                <Spin spinning={loading2}>
                  <Tabs
                    defaultActiveKey="0"
                    onChange={onChangeTags}
                    size="large"
                    style={{ width: '100%' }}
                    className={styles.wrapTabs}
                  >
                    {renderHtmlElement()}
                  </Tabs>
                </Spin>
              </Card>
            </Panel>
          </Collapse>
        </div>

        <Drawer
          title={'基本信息'}
          placement="right"
          onClose={onClose}
          visible={visible}
          closable={true}
          className={styles.wrapper}
          forceRender={true}
          destroyOnClose={true}
          width={'600px'}
        >
          <div className={styles.wrapBorder}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div className={styles.topIcon}>
                  <img
                    // src={userPrup?.logo_uri || '/images/default-avatar.png'}
                    src={
                      userPrup?.logo_uri ||
                      (mapUrl.get(userPrup?.link_client_id)
                        ? `/portal/images/logo/${mapUrl.get(userPrup?.link_client_id)}`
                        : '/portal/images/application.png')
                    }
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <span style={{ fontSize: '16px' }}>{userPrup?.client_name}</span>
              </div>
            </div>
            <div className={styles.applicationProfileWrapper}>
              <div className={styles.applicationProfile} style={{ marginTop: '4vh' }}>
                <h2
                  style={{
                    marginRight: '10px',
                    fontSize: '16px',
                    width: '100px',
                    textAlign: 'right',
                  }}
                >
                  应用简介：
                </h2>
                <div
                  style={{
                    width: '70%',
                    letterSpacing: '4px',
                    fontSize: '14px',
                    marginTop: '1px',
                    color: '#000',
                    opacity: '0.85',
                  }}
                >
                  {userPrup?.description || '管理员未留下任何简介.'}
                </div>
              </div>
              <div className={styles.applicationReason} style={{ marginTop: '6vh' }}>
                <h2
                  style={{
                    marginRight: '10px',
                    fontSize: '16px',
                    width: '100px',
                    textAlign: 'right',
                  }}
                >
                  <span style={{ color: '#f00' }}>*</span> 申请原因：
                </h2>
                <TextArea
                  maxLength={100}
                  style={{ height: 200, width: '400px', resize: 'none' }}
                  onChange={textareaOnchange}
                  value={textareaContent}
                />
              </div>
              <div className={styles.userTime} style={{ marginTop: '6vh' }}>
                <Row justify="start" align="middle">
                  <Col span={5}>
                    <h2
                      style={{
                        marginRight: '10px',
                        fontSize: '16px',
                        width: '100px',
                        textAlign: 'right',
                      }}
                    >
                      <span style={{ color: '#f00' }}>*</span> 使用时间：
                    </h2>
                  </Col>
                  <Form form={form}>
                    <Form.Item name="dataPicket">
                      <RangePicker
                        style={{ position: 'relative', top: '10px', width: '400px' }}
                        onChange={RangeChangeFunc}
                        disabledDate={handleStartDisabledDate}
                        dateRender={(current) => {
                          const style: React.CSSProperties = {};
                          if (current.date() === 1) {
                            style.border = '1px solid #1890ff';
                            style.borderRadius = '50%';
                          }
                          return (
                            <div className="ant-picker-cell-inner" style={style}>
                              {current.date()}
                            </div>
                          );
                        }}
                      />
                    </Form.Item>
                  </Form>
                </Row>
              </div>
            </div>
            <footer>
              <Row align="middle" justify="center" style={{ marginTop: '30px' }}>
                <Col>
                  <Button
                    type="primary"
                    style={{ padding: '0 25px' }}
                    onClick={handleClickAppliy}
                    disabled={disabled}
                  >
                    申请
                  </Button>
                </Col>
              </Row>
            </footer>
          </div>
        </Drawer>
        {visibleadd ? (
          <AddPopup
            controlShow={visibleadd}
            controlClose={controlCloseFunc}
            refreshMeAppList={hanldeRefreList}
            myApplicationList={meArrlist}
            delteIndex={deleteIndex}
            MeIds={meId}
          />
        ) : (
          ''
        )}
      </div>
    </Spin>
  );
};
export default ApplicationCenter;
