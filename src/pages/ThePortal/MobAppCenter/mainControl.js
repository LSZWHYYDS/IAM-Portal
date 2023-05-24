import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  Row,
  Col,
  Input,
  DatePicker,
  Space,
  Card,
  Tabs,
  Drawer,
  Empty,
  message,
  Modal,
  Spin,
} from 'antd';
// import { Calendar } from 'antd-mobile'
// import { DemoBlock, DemoDescription } from 'demos'
// import { DemoBlock } from 'demos';
import styles from './mainControl.less';
import {
  getAppLists,
  requestDatas,
  getAppLists_ls,
  getUserInfo_ls,
  getMeApplicationList_mob,
  deleteMeApplicationList_mob,
  addMeApplicationList_mob,
} from './servers';
import { history } from 'umi';
import MPullToRefresh from './m-pull-to-refresh';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  PicLeftOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { DeleteTwoTone, MenuUnfoldOutlined } from '@ant-design/icons';
import mapUrl from '../../../utils/pictureMap';

const { Search } = Input;
const { TabPane } = Tabs;
const pageSize = 10;
let pageNum = 1;

export default function MainControl() {
  const [loading, setLoading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const ref = useRef();
  let pars = { page: 1, size: 40 };
  const [appclassification, setAppclassification] = useState([]);
  const [changeTab, setChangeTab] = useState('');
  const [requestData, setRequestData] = useState([]);
  // 触底加载相关hook
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  // 搜索输入框内容
  const [searchInput, setSearchInput] = useState('');
  // 分类ID数组
  const [categoryid, setCategoryid] = useState([]);
  const [userData, setUserData] = useState(null); // 用户名称
  // 我的应用数组
  const [meApplicationArray, setMeApplicationArray] = useState([{}, {}, {}, {}, { id: 1 }]);
  // 我的应用列表
  const [meArrlist, setMeArrList] = useState([]);
  const [visible, setVisible] = useState(false);
  // 声明delte删除的对象和存放索引变量
  const [mapItems, setMapItems] = useState('');
  const [mapIndex, setMapIndex] = useState(0);
  // 刷新页面重新传递路由参数
  const [refreshs, setRefreshs] = useState(false);
  // 保存我的应用ID
  // const [meId, setMeId] = useState()
  // 控制是否显示删除图标
  const [isShowIcon, setIsShowIcon] = useState(false);
  const [repair, setRepair] = useState(0);

  useEffect(() => {
    getAppLists().then((rs) => {
      setRequestData(rs.data);
    });

    // 获取类别数据
    requestDatas().then((res) => {
      res.data.forEach((rs) => {
        setCategoryid((state) => {
          const arr = [];
          arr.push(rs.id);
          return arr;
        });
      });
      setAppclassification((state) => [
        { category_name: '全部', id: 'all' },
        ...res.data,
        { category_name: '其他', id: 'other' },
      ]);
    });

    // 获取用户登录名称
    getUserInfo_ls().then((rs) => {
      setUserData(rs.data);
    });

    // 请求我的所有应用分类列表
    getMeApplicationList_mob().then((rs) => {
      try {
        // const as = [];
        // rs.data.items.forEach((items, inx) => {
        //   as.push(items.client_id)
        // });
        // setMeId(as);
        const tempArr = rs.data.items;
        const tempArr_id = [];
        tempArr.forEach((is, inx) => {
          tempArr_id.push(is.client_id);
        });
        sessionStorage.setItem('idArr', JSON.stringify(tempArr_id));
        setMeArrList(tempArr.concat([{ id: 1 }]));
        setLoading(false);
      } catch {
        message.error('暂未数据');
      }
    });
  }, []);

  useEffect(() => {
    refreshs && setTimeout(() => setRefreshs(false));
  }, [refreshs]);

  const handleJumpLink = (params) => {
    if (params.key == 'personCener') {
      // history.push('/person/userdetilsInfo');
      history.push('/person/userInfoLs');
    }
  };
  const menu = (
    <Menu
      onClick={handleJumpLink}
      items={[
        {
          key: 'personCener',
          label: <>个人中心</>,
        },
      ]}
    />
  );
  const config = {
    title: 'Use Hook!',
    content: (
      <>
        <h1>删除对话框</h1>
      </>
    ),
  };
  // 刷新
  const doRefresh = () => setRefreshs(true);
  // 处理图片错误
  const handleErrorFuncs = (e) => {
    e.target.src = '/portal/images/application.png';
  };
  const jumpLinkFunc_total = (val) => {
    if (val) {
      window.location.href = val;
    } else {
      message.error('此应用未设置链接');
    }
  };
  /**
   * 显示模态框
   */
  const showModel_total = (val, client_ids, bol, items) => {
    return bol ? jumpLinkFunc_total(val) : clickApplication(client_ids, bol, items);
  };
  // 渲染全部应用
  const renderTotalApplication = () => {
    if (requestData) {
      return requestData.length ? (
        requestData.map((mapIs, mapInx) => {
          return (
            <div
              className={styles.icon_one}
              key={mapInx}
              onClick={() => {
                showModel_total(mapIs.client_uri, mapIs.client_id, mapIs.authed, mapIs);
              }}
            >
              <div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto',
                    position: 'relative',
                  }}
                >
                  <img
                    src={
                      mapIs?.logo_uri ||
                      (mapUrl.get(mapIs?.link_client_id)
                        ? `/portal/images/logo/${mapUrl.get(mapIs?.link_client_id)}`
                        : '/portal/images/application.png')
                    }
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                    }}
                    onError={() => handleErrorFuncs(event)}
                  />
                  {mapIs.authed ? '' : rendreApplyIcon()}
                </div>
                <div className={styles.ellipsis} title={mapIs.client_name}>
                  {mapIs.client_name}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ height: '120px' }}>
          <Empty style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
      );
    }
  };
  // 改变tab函数
  const onChangeTabs = (val) => {
    setLoading(true);
    setChangeTab(val);
    if (val == 'all') {
      getAppLists().then((rs) => {
        setRequestData(rs.data);
        setLoading(false);
      });
    } else if (val == 'other') {
      getAppLists().then((rs) => {
        let filterArr = rs.data.filter((filIs, filInx) => {
          return !categoryid.includes(filIs.custom_class);
        });
        setLoading(false);
        setRequestData(filterArr);
      });
    } else {
      // 切换tab  发送接口
      getAppLists_ls({ category_id: val }).then((rs) => {
        const a = rs.data.items.filter((is) => is.authed != null);
        const b = rs.data.items.filter((is) => is.authed == null);
        setRequestData(b.concat(a));
        setLoading(false);
      });
    }
  };
  // 搜索一函数
  const serarchFunc_one = (val) => {
    if (val) {
      const tempArr = meArrlist.filter((maps, mapInx) => {
        return maps.client_name?.indexOf(val) != -1;
      });
      setMeArrList(tempArr);
    } else {
      getMeApplicationList_mob().then((rs) => {
        try {
          const tempArr = rs.data.items;
          setMeArrList(tempArr.concat([{ id: 1 }]));
        } catch {
          message.error('暂未数据');
        }
      });
    }
  };
  // 搜索二函数
  const serarchFunc = (val) => {
    // 这里自动收集搜索内容
    getAppLists_ls({ client_name: val }).then((rs) => {
      const a = rs.data.items.filter((is) => is.authed != null);
      const b = rs.data.items.filter((is) => is.authed == null);
      setRequestData(b.concat(a));
    });
  };
  // 搜索一
  const Cardtitle = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>我的应用</div>
        <div>
          <Search placeholder="应用中心" allowClear onSearch={serarchFunc_one} />
        </div>
        <div>
          <Button
            type="primary"
            size="middle"
            style={{ marginLeft: '8px' }}
            onClick={() => setIsShowIcon((value) => !value)}
          >
            {isShowIcon ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {isShowIcon ? '取消' : '管理'}
          </Button>
        </div>
      </div>
      {/* <Space>
      </Space>
      <Space style={{ marginLeft: '5%' }}>
        <Search
          placeholder="应用中心"
          style={{
            width: '70%',
          }}
          allowClear
          onSearch={serarchFunc_one}
        />
      </Space>
      <Space align="center" direction="vertical">
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: '8px', position: 'relative', top: '3px' }}
          onClick={() => setIsShowIcon((value) => !value)}
        >
          <MenuUnfoldOutlined />
          {isShowIcon ? '取消' : '管理'}
        </Button>
      </Space> */}
    </>
  );
  // 搜索二
  const Cardtitle_one = (
    <>
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>
          <span>应用中心</span>
        </div>
        <div>
          <Search
            placeholder="搜索应用"
            style={{
              width: 200,
            }}
            allowClear
            onSearch={serarchFunc}
          />
        </div>
      </div>

      {/* <Space align="center">
      </Space>
      <Space style={{ marginLeft: '25px' }}>
      </Space> */}
    </>
  );
  // 跳转到某个应用
  const clickApplication = (client_id, status, items) => {
    if (!status) {
      history.push({
        pathname: '/person/userapplyfor',
        state: {
          //传递的数据
          a: items,
        },
      });
    }
  };
  // 渲染应用的遮罩层
  const rendreApplyIcon = () => {
    return (
      <div className={styles.borderInfo}>
        <span style={{ color: '#fff', fontSize: '14px' }}>申请</span>
      </div>
    );
  };
  // 删除应用函数
  const delteMeApplication = (items, client_id) => {
    setMapItems(items);
    setMapIndex(client_id);
    setVisible(true);
  };
  const handleErrorFuncss = (e) => {
    e.target.src = '/portal/images/application.png';
  };
  const jumpLinkFunc = (val) => {
    if (val) {
      window.location.href = val;
    } else {
      // alert('链接为空');
      message.error('此应用未设置链接');
    }
  };
  const showModel = (val) => {
    return jumpLinkFunc(val);
  };
  // 渲染我的应用
  const renderMeApplication = () => {
    return meArrlist.map((mapIs, mapInx) => {
      return mapIs.id == 1 ? (
        <div
          className={styles.icon_one_ls_add}
          onClick={() => history.push(`/person/userapplyAdd`)}
        >
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              margin: '0 auto',
              border: '2px solid #808080',
              borderRadius: '5px',
              fontFamily: 'times',
            }}
          >
            <span className={styles.addIcon}>+</span>
          </div>
        </div>
      ) : (
        <div
          className={styles.icon_one_ls}
          onClick={() => showModel(mapIs.client_uri, mapIs.client_id, mapIs.authed, mapIs)}
        >
          <img
            src={
              mapIs?.logo_uri ||
              (mapUrl.get(mapIs?.link_client_id)
                ? `/portal/images/logo/${mapUrl.get(mapIs?.link_client_id)}`
                : '/portal/images/application.png')
            }
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            onError={() => handleErrorFuncss(event)}
          />
          <div className={styles.ellipsis}>{mapIs.client_name || '未设置昵称'}</div>
          {isShowIcon ? (
            <DeleteTwoTone
              className={styles.deleIcon}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                delteMeApplication(mapIs.client_name, mapIs.client_id);
              }}
            />
          ) : (
            ''
          )}
        </div>
      );
    });
  };
  // 点击确定框处理事件
  const handleOk = () => {
    const newTags = meArrlist.filter((tag) => tag.client_name !== mapItems);
    deleteMeApplicationList_mob(mapIndex).then((rs) => {
      if (!Number(rs.error)) {
        setMeArrList(newTags);
        setVisible(false);
        doRefresh();
        getMeApplicationList_mob().then((rss) => {
          try {
            const tempArr = rss.data.items;
            const zwhArr = [];
            tempArr.forEach((is, inx) => {
              zwhArr.push(is.client_id);
            });
            sessionStorage.setItem('idArr', JSON.stringify(zwhArr));
            setMeArrList(tempArr.concat([{ id: 1 }]));
          } catch {
            message.error('暂未数据');
          }
        });
        message.success('删除成功~');
      }
    });
  };

  // 图片错误加载默认图片
  const handleErrorFunc = (e) => {
    e.target.src = '/portal/images/application.png';
  };

  const resizeChangeWH = () => {
    if (document.getElementById('domRef')) {
      const childNodes = domRef?.childNodes;
      let row = 0,
        beforeNode = null;
      if (childNodes && requestData.length) {
        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i];
          if (!beforeNode) {
            beforeNode = node;
            continue;
          }
          if (node.offsetTop !== beforeNode.offsetTop) {
            row = i;
            break;
          }
        }
        setRepair(
          row > 1
            ? requestData.length % row == 0
              ? requestData.length % row
              : row - (requestData.length % row)
            : 0,
        );
      }
    }
  };

  const renderTags = () => {
    return Array(repair)
      .fill(true)
      ?.map((mapIs, mapInx) => {
        return <div style={{ width: '80px', height: '80px' }} key={mapInx}></div>;
      });
  };
  if (document.getElementById('domRef')) {
    new ResizeObserver(resizeChangeWH).observe(document.getElementById('domRef'));
  }

  return (
    <>
      <div>
        <header className={styles.header}>
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            trigger={['click']}
            onChange={handleJumpLink}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '18px',
                marginRight: '20px',
                display: 'flex',
                width: 'fit-content',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '5px', float: 'right' }}>
                {userData?.name || userData?.username || '未设置'}
              </span>
              <img
                src={userData?.login_url ? userData.login_url : '/portal/images/default-avatar.png'}
                style={{ width: '30px', height: '30px', borderRadius: '30px' }}
                onError={() => handleErrorFunc(event)}
              />
            </div>
          </Dropdown>
        </header>
        <Card
          title={Cardtitle}
          style={{ marginTop: '10px', padding: '0 5px' }}
          bodyStyle={{ padding: '6% 0 0' }}
        >
          <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
            {meArrlist.length ? renderMeApplication() : ''}
          </Space>
        </Card>
        <Card title={Cardtitle_one} bodyStyle={{ padding: '0' }}>
          <Spin spinning={loading}>
            <Tabs
              defaultActiveKey="0"
              size="large"
              onChange={onChangeTabs}
              tabBarStyle={{ marginLeft: '7%' }}
            >
              {appclassification.map((items_s, indexs_s) => (
                <TabPane
                  tab={items_s.category_name}
                  key={items_s.id}
                  style={{ height: 'fit-content', overflow: 'auto', scrollbarWidth: 'none' }}
                  className={styles.tab_scroll}
                >
                  <Space wrap style={{ justifyContent: 'space-between' }}>
                    <div
                      id="domRef"
                      style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
                    >
                      {renderTotalApplication()}
                      {renderTags()}
                    </div>
                  </Space>
                </TabPane>
              ))}
            </Tabs>
          </Spin>
        </Card>
      </div>
      <Modal
        visible={visible}
        title="删除"
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        width="80%"
        centered={true}
      >
        <p>你确定要删除应用么？</p>
      </Modal>
    </>
  );
}
