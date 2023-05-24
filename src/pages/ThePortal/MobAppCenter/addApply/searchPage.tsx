import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Input, Button, Empty, message } from 'antd';
import { history } from 'umi';
import styles from './search.less';
import { getUserInfo_ls, getAppLists_ls, addMeApplicationList_mob } from '../servers';
import { SearchOutlined } from '@ant-design/icons';
import type { MapIs, VerifyUserInfo } from './data';
const Index: React.FC<any> = (props) => {
  const [userData, setUserData] = useState<VerifyUserInfo>();
  const [inputValue, setInputValue] = useState('');
  const [addApplyation, setAddApplyation] = useState<any>([]);
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
  }, []);
  const handleJumpLink = (params: any) => {
    if (params.key == 'personCener') {
      history.push('/person/userapplyforControl');
    } else {
      props.showHandle();
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
        {
          key: 'personAdd',
          label: <span>添加应用</span>,
        },
      ]}
    />
  );
  // 调用搜索接口
  const serarchFunc = (val: string) => {
    getAppLists_ls({ client_name: val }).then((rs) => {
      const first = rs.data.items.filter((is: any) => is.authed != null);
      const last = rs.data.items.filter((is: any) => is.authed == null);

      rs.data.items.forEach((is: any) => {
        is.isDisabled = false;
        const parseObj: any = sessionStorage.getItem('idArr');
        if (JSON.parse(parseObj).indexOf(String(is.client_id)) != -1) {
          is.isDisabled = true;
        }
      });

      setAddApplyation(last.concat(first));
    });
  };

  const handleIsShowSearchPage = (e: any) => {
    setInputValue(e.target.value);
    if (e.target.value !== '') {
      serarchFunc(e.target.value);
    } else {
      setAddApplyation([]);
    }
  };
  // 渲染应用的遮罩层
  const rendreApplyIcon = () => {
    return (
      <div className={styles.borderInfo}>
        <span style={{ color: '#fff' }}>申请</span>
      </div>
    );
  };
  // 处理图片错误
  const handleErrorFuncs = (e: any) => {
    e.target.src = '/portal/images/application.png';
  };

  /**
   * 添加应用
   */
  const addMeApplication = (client_id: any, inx: number) => {
    addMeApplicationList_mob(client_id).then((rs: any) => {
      if (!Number(rs.error)) {
        message.success('添加成功~');
        // 将按钮变为不可选
        addApplyation[inx].isDisabled = true;
        doRefresh();
      }
    });
  };

  const renderAddApply = () => {
    return addApplyation.map((mapIs: MapIs, mapInx: number) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
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
                  src={mapIs.logo_uri ? mapIs.logo_uri : '/portal/images/application.png'}
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
            <span style={{ marginLeft: '20px' }}>{mapIs.client_name}</span>
          </div>
          <Button
            onClick={() => addMeApplication(mapIs.client_id, mapInx)}
            disabled={mapIs.isDisabled}
          >
            添加
          </Button>
        </div>
      );
    });
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
            <span style={{ marginRight: '5px' }}>{userData ? userData.username : ''}</span>
            <img
              src={userData?.login_url ? userData.login_url : '/portal/images/default-avatar.png'}
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
            onChange={handleIsShowSearchPage}
            value={inputValue}
          ></Input>
        </div>
        <div>
          {!addApplyation.length ? (
            <div style={{ marginTop: '45%' }}>
              <Empty />
            </div>
          ) : (
            renderAddApply()
          )}
        </div>
      </main>
    </>
  );
};
export default Index;
