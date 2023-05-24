import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Dropdown, Menu, Input, Tabs, Empty, Button, message } from 'antd';
import { history } from 'umi';
import {
  getUserInfo_ls,
  requestDatas,
  getAppLists,
  getAppLists_ls,
  addMeApplicationList_mob,
  getMeApplicationList_mob,
} from '../servers';
import { SearchOutlined } from '@ant-design/icons';
import SearchPage from './searchPage';
import type { VerifyObj } from './data.d';
const { TabPane } = Tabs;
import mapUrl from '../../../../utils/pictureMap';
const Indet: React.FC<any> = () => {
  const [userData, setUserData] = useState<VerifyObj>();
  const [appclassification, setAppclassification] = useState<any[]>([]);
  // 分类ID数组
  const [categoryid, setCategoryid] = useState<any[]>([]);
  const [requestData, setRequestData] = useState<any[]>([]);
  const [controlSearchPageIsShow, setControlSearchPageIsShow] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      setTimeout(() => setRefresh(false));
    }
  }, [refresh]);
  const doRefresh = () => setRefresh(true);

  useEffect(() => {
    // 获取用户登录名称
    getUserInfo_ls().then((rs) => {
      setUserData(rs.data);
    });
    // 获取类别数据
    requestDatas().then((res) => {
      res.data.forEach((rs: any) => {
        setCategoryid(() => {
          const arr: any = [];
          arr.push(rs.id);
          return arr;
        });
      });
      setAppclassification(() => {
        const arr = [
          { category_name: '全部', id: 1 },
          ...res.data,
          { category_name: '其他', id: 2 },
        ];
        return arr;
      });
    });
    // 首次获取列表
    getAppLists().then((rs) => {
      getMeApplicationList_mob().then((rs_ls) => {
        try {
          const tempArr = rs_ls.data.items;
          const tempArr_id: any = [];
          tempArr.forEach((is: any) => {
            tempArr_id.push(is.client_id);
          });
          rs.data.forEach((is: any) => {
            is.isDisabled = false;
            if (tempArr_id.indexOf(String(is.client_id)) != -1) {
              is.isDisabled = true;
            }
          });
          setRequestData(rs.data.filter((filIs: any) => filIs.authed));
        } catch {
          message.error('暂未数据');
        }
      });
    });
  }, []);

  // 改变tab函数
  const onChangeTabs = (val: any) => {
    if (val == 1) {
      getAppLists().then((rs) => {
        const arrs_one = rs.data.filter((filterIS: any) => {
          return filterIS.authed !== false;
        });
        // setRequestData(rs.data);
        setRequestData(arrs_one);
      });
    } else if (val == 2) {
      getAppLists().then((rs) => {
        const filterArr = rs.data.filter((filIs: any) => {
          return !categoryid.includes(filIs.custom_class);
        });
        const arrs_two = filterArr.filter((filterIS: any) => {
          return filterIS.authed !== false;
        });

        // setRequestData(filterArr);
        setRequestData(arrs_two);
      });
    } else {
      // 切换tab发送接口
      getAppLists_ls({ category_id: val }).then((rs) => {
        const a = rs.data.items.filter((is: any) => is.authed != null);
        const b = rs.data.items.filter((is: any) => is.authed == null);
        const arrs_three = b.concat(a).filter((filterIS: any) => {
          return filterIS.authed !== false;
        });
        setRequestData(arrs_three);
      });
    }
  };
  const handleJumpLink = (params: any) => {
    if (params.key == 'personCener') {
      history.push('/person/userapplyforControl');
    }
  };
  const menu = (
    <Menu
      onClick={handleJumpLink}
      items={[
        {
          key: 'personCener',
          label: <span>工作台</span>,
        },
      ]}
    />
  );
  // 渲染应用的遮罩层
  const rendreApplyIcon = () => {
    return (
      <div className={styles.borderInfo}>
        <span style={{ color: '#fff' }}>申请</span>
      </div>
    );
  };

  const handleIsShowSearchPage = () => {
    setControlSearchPageIsShow(false);
  };

  const handleIsShowSeratch = () => {
    setControlSearchPageIsShow(true);
  };

  /**
   * 添加应用
   */
  const addMeApplication = (client_id: any, inx: number) => {
    addMeApplicationList_mob(client_id).then((rs: any) => {
      if (!Number(rs.error)) {
        message.success('添加成功~');
        // 将按钮变为不可选
        requestData[inx].isDisabled = true;
        doRefresh();
      }
    });
  };
  // 处理图片错误
  const handleErrorFuncs = (e: any) => {
    e.target.src = '/portal/images/application.png';
  };
  // 渲染全部应用
  const renderTotalApplication = () => {
    if (requestData) {
      return requestData.length ? (
        requestData.map((mapIs, mapInx) => {
          return (
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              key={mapInx}
            >
              <div className={styles.icon_one}>
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
                      // src={mapIs.logo_uri ? mapIs.logo_uri : '/images/application.png'}
                      src={
                        mapIs?.login_url ||
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
                      }}
                      onError={() => handleErrorFuncs(event)}
                    />
                    {mapIs.authed ? '' : rendreApplyIcon()}
                  </div>
                </div>
                <span style={{ marginLeft: '20px' }} title={mapIs.client_name}>
                  {mapIs.client_name}
                </span>
              </div>
              <Button
                onClick={() => addMeApplication(mapIs.client_id, mapInx)}
                disabled={mapIs.isDisabled}
              >
                添加
              </Button>
            </div>
          );
        })
      ) : (
        <div style={{ height: '120px' }}>
          <Empty style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
      );
    }
    return;
  };

  return (
    <>
      {controlSearchPageIsShow ? (
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
                <span style={{ marginRight: '5px' }}>{userData ? userData.username : ''}</span>
                <img
                  src={
                    userData?.login_url ? userData.login_url : '/portal/images/default-avatar.png'
                  }
                  style={{ width: '30px', height: '30px', borderRadius: '30px' }}
                />
              </div>
            </Dropdown>
          </header>
          <main style={{ padding: '0 10px' }}>
            <div style={{ marginTop: '10px' }}>
              <Input
                style={{ padding: '6px 0', paddingLeft: '10px' }}
                placeholder="搜索"
                prefix={<SearchOutlined />}
                onClick={handleIsShowSearchPage}
              />
            </div>
            <Tabs
              defaultActiveKey="0"
              size="large"
              onChange={onChangeTabs}
              tabBarStyle={{ marginLeft: '7%' }}
            >
              {appclassification.map((items_s) => (
                <TabPane
                  tab={items_s.category_name}
                  key={items_s.id}
                  style={{ height: 600, overflow: 'auto', padding: '0 20px' }}
                  className="tab_scroll"
                >
                  {/* <Space size={[8, 16]} wrap> */}
                  <div>{renderTotalApplication()} </div>
                  {/* </Space> */}
                </TabPane>
              ))}
            </Tabs>
          </main>
        </>
      ) : (
        <SearchPage showHandle={handleIsShowSeratch} />
      )}
    </>
  );
};

export default Indet;
