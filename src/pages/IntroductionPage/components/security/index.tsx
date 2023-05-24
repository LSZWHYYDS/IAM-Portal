import { Col, Row } from 'antd';
import styles from './index.less';
const security = () => {
  return (
    <>
      <div className={styles.bannerbg}>
        <div className={styles.wrapper}>
          <Row justify="center" align="middle" style={{ width: '100%' }}>
            <Col xs={24} sm={24} md={12}>
              <div className={styles.insertBoxWidth}>
                <div style={{ textAlign: 'left' }}>
                  <h2 className={styles.header}>安全增强</h2>
                </div>
                <div className={styles.desc}>
                  <div>
                    <span>零信任风险监测</span>
                    <br />
                    <span>配合钉钉网关支持接入行为监测</span>
                    <br />
                    <span>多因子认证及多端授权</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src="https://console.digitalsee.cn/wp-content/uploads/2021/06/cloud_linker_3.svg"
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

export default security;
