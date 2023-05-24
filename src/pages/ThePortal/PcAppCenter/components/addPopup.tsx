import React, { useState, useEffect } from 'react';
import { Drawer, List, Row, Col, Select, Input, Button, Space, message, Spin, Empty } from 'antd';
import type { VerifyProps } from '../data.d';
import styles from './style/addPopup.less';
import { requestData, getAppLists_ls } from '../../MobAppCenter/servers';
import { addMeApplicationList } from '../server';
import mapUrl from '../../../../utils/pictureMap';
import _ from 'lodash';
const { Option } = Select;
const { Search } = Input;
/**
 * render function start
 */
const AddPopup: React.FC<VerifyProps> = (props) => {
  const [secondCity, setSecondCity] = useState<any[]>([]);
  const [cities, setCities] = useState<any>([]);
  const [categoryid, setCategoryid] = useState<any>([]); // 分类ID数组
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const idArr: any = [];
  useEffect(() => {
    // 请求分类接口
    requestData().then((res: any) => {
      setCities(() => [
        { category_name: '全部', id: 1 },
        ...res.data,
        { category_name: '其他', id: 2 },
      ]);
      //  把ID取出来
      res.data.forEach((rss: any) => {
        setCategoryid(() => {
          const arr = [];
          arr.push(rss.id);
          return arr;
        });
      });
      setLoading(false);
      setLoading1(false);
    });
  }, [props.delteIndex, props.MeIds]);

  useEffect(() => {
    // 获取所有列表
    getAppLists_ls({}).then((rs: any) => {
      const a = rs.data.items.filter((is: any) => is.authed != null);
      const b = rs.data.items.filter((is: any) => is.authed == null);
      let arr = a.concat(b);

      arr = arr.filter((filterIS: any) => {
        return filterIS.authed !== false;
      });
      arr.unshift({});
      // 抽取传递过来的数组id
      props.myApplicationList.forEach((is) => {
        idArr.push(is.client_id);
      });
      arr.forEach((is: any, inx: any) => {
        if (inx) {
          is.isDisabled = false;
          if (idArr.indexOf(is.client_id) != -1) {
            is.isDisabled = true;
          }
        }
      });
      setSecondCity(arr);
      if (typeof props.delteIndex == 'number') {
        if (secondCity.length) {
          secondCity[props.delteIndex].isDisabled = false;
        }
        // secondCity.length ? secondCity[props.delteIndex].isDisabled = false : '';
      }

      // 防止刷新页面禁选状态丢失问题
      arr.forEach((items: any) => {
        if (props.MeIds.includes(items.client_id)) {
          items.isDisabled = true;
        }
      });
    });
  }, [props.controlShow]);

  /**
   * 添加应用
   */
  const addMeApplication = (client_id: any, inx: number) => {
    addMeApplicationList(client_id).then((rs: any) => {
      if (!Number(rs.error)) {
        message.success('添加成功~');
        // 更新父组件中的我的应用列表
        props.refreshMeAppList();
        // 将按钮变为不可选
        secondCity[inx].isDisabled = true;
      }
    });
  };
  /**
   * select 选择事件
   */
  const onSecondCityChange = (value: any) => {
    setLoading1(true);
    if (value == 1) {
      getAppLists_ls().then((rs: any) => {
        const firstArr = rs.data.items.filter((is: any) => is.authed != null);
        const lastArr = rs.data.items.filter((is: any) => is.authed == null);
        const arr = lastArr.concat(firstArr);
        const arrs = arr.filter((filterIS: any) => {
          return filterIS.authed !== false;
        });
        arrs.unshift({});
        setSecondCity(arrs);
        setLoading1(false);
      });
    } else if (value == 2) {
      getAppLists_ls().then((rs) => {
        const filterArr = rs.data.items.filter((filIs: any) => {
          return !categoryid.includes(filIs.custom_class);
        });
        filterArr.unshift({});
        setSecondCity(filterArr);
        setLoading1(false);
      });
    } else {
      getAppLists_ls({ category_id: value }).then((rs) => {
        const a = rs.data.items.filter((is: any) => is.authed != true);
        const b = rs.data.items.filter((is: any) => is.authed == true);
        const arr = b.concat(a);
        const arrs_ls = arr.filter((filterIS: any) => {
          return filterIS.authed !== false;
        });
        arrs_ls.unshift({});
        setSecondCity(arrs_ls);
        setLoading1(false);
      });
    }
  };
  /**
   * 搜索框事件
   * */
  const onSearch = (value: string) => {
    getAppLists_ls({ client_name: value }).then((rs: any) => {
      const a = rs.data.items.filter((is: any) => is.authed != null);
      const b = rs.data.items.filter((is: any) => is.authed == null);
      const arr = b.concat(a);
      arr.unshift({});
      setSecondCity(arr);
    });
  };
  /**
   * 渲染抽屉顶部搜索以及下拉框
   */
  const renderTopSearch = () => {
    return (
      <>
        <List.Item>
          <Row>
            <Col span={4}>
              <h3 className={styles.title}>分类</h3>
            </Col>
            <Col span={6}>
              <Select style={{ width: 200 }} defaultValue={'全部'} onChange={onSecondCityChange}>
                {cities.map((city: any) => (
                  <Option key={city.id}>{city.category_name}</Option>
                ))}
              </Select>
            </Col>
            <Col offset={7} span={4}>
              <Search
                placeholder="请输入应用名称"
                onSearch={onSearch}
                style={{ width: 200 }}
                allowClear
              />
            </Col>
          </Row>
        </List.Item>
      </>
    );
  };
  const handleErrorFunc = (e: any) => {
    e.target.src = '/portal/images/application.png';
  };

  /**
   * 渲染抽屉列表信息
   */
  const renderListInfo = (item: any, inx: number) => {
    return (
      <Spin spinning={loading1} style={{ height: '100vh', backgroundColor: '#fff' }} key={inx}>
        <List.Item>
          <Space size={[135, 16]} style={{ marginLeft: '70px' }}>
            <div style={{ position: 'relative', width: '40px' }}>
              <img
                // src={item.logo_uri ? item.logo_uri : '/images/application.png'}
                src={
                  item?.logo_uri ||
                  (mapUrl.get(item?.link_client_id)
                    ? `/portal/images/logo/${mapUrl.get(item?.link_client_id)}`
                    : '/portal/images/application.png')
                }
                width={40}
                style={{ borderRadius: '10px' }}
                onError={() => handleErrorFunc(event)}
              />
              {item.authed ? '' : <div className={styles.mask}>申请</div>}
            </div>
            <h3 className={styles.espline} title={item.client_name}>
              {item.client_name}
            </h3>
            <Button
              onClick={() => addMeApplication(item.client_id, inx)}
              disabled={item.isDisabled}
            >
              添加
            </Button>
          </Space>
        </List.Item>
      </Spin>
    );
  };

  return (
    <>
      <Drawer
        title="应用列表"
        placement="right"
        onClose={props.controlClose}
        visible={props.controlShow}
        width="600px"
      >
        <Spin spinning={loading} style={{ height: '100vh', backgroundColor: '#fff' }}>
          <List
            itemLayout="horizontal"
            dataSource={secondCity}
            renderItem={(item: any, inx) => {
              if (secondCity.length == 1 && _.isEmpty(secondCity[0])) {
                return (
                  <>
                    <List.Item key={inx}>
                      <Row>
                        <Col span={4}>
                          <h3 className={styles.title}>分类</h3>
                        </Col>
                        <Col span={6}>
                          <Select
                            style={{ width: 200 }}
                            defaultValue={'全部'}
                            onChange={onSecondCityChange}
                          >
                            {cities.map((city: any) => (
                              <Option key={city.id}>{city.category_name}</Option>
                            ))}
                          </Select>
                        </Col>
                        <Col offset={7} span={4}>
                          <Search
                            placeholder="请输入应用名称"
                            onSearch={onSearch}
                            style={{ width: 200 }}
                            allowClear
                          />
                        </Col>
                      </Row>
                    </List.Item>
                    <Empty></Empty>
                  </>
                );
              } else {
                return Object.keys(item).length ? renderListInfo(item, inx) : renderTopSearch();
              }
            }}
          />
        </Spin>
      </Drawer>
    </>
  );
};
export default AddPopup;
