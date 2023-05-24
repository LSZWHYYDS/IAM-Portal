import { Col, Row } from 'antd';
import styles from './index.less';

const cloudIdentity = () => {
  return (
    <>
      <div className={styles.bannerbg}>
        <div className={styles.wrapper}>
          <Row style={{ width: '100%' }} justify="center" align="middle">
            <Col xs={24} sm={24} md={12}>
              <div className={styles.insertBoxWidth}>
                <div style={{ textAlign: 'center' }}>
                  <h2 className={styles.header}>云端身份、权限连接</h2>
                </div>
                <div className={styles.desc}>
                  <div style={{ display: 'inline-block', margin: '0 auto' }}>
                    <span>灵活同步流向设置</span>
                    <span>自定义用户画像、LDAP即服务</span>
                    <span>字段匹配、实时增量同步</span>
                    <span>生命周期管理对接</span>
                    <span>角色权限/属性权限对接</span>
                    <span>钉钉工作流审批注册/授权</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src="https://console.digitalsee.cn/wp-content/uploads/2021/06/cloud_linker_1.svg"
                  className={styles.imgstyle}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default cloudIdentity;
