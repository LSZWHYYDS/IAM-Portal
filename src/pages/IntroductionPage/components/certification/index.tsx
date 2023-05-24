import { Col, Row } from 'antd';
import styles from './index.less';
const certifcation = () => {
  return (
    <>
      <div className={styles.bannerbg}>
        <div className={styles.wrapper}>
          <Row justify="center" align="middle" style={{ width: '100%' }}>
            <Col xs={24} sm={24} md={12}>
              <div>
                <img
                  src="https://console.digitalsee.cn/wp-content/uploads/2021/06/cloud_linker_2.svg"
                  className={styles.imgstyle}
                />
              </div>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <div className={styles.insertBoxWidth}>
                <div style={{ textAlign: 'center' }}>
                  <h2 className={styles.header}>认证及单点登陆</h2>
                </div>
                <div className={styles.desc}>
                  <div style={{ display: 'inline-block', margin: '0 auto' }}>
                    <span>多种预置认证源</span>
                    <span>AD/LDAP、自定义IDP认证集成</span>
                    <span>钉钉、⻜书、企微、GWS、AD Azure开箱即用</span>
                    <span>单点商店90+应用支持</span>
                    <span>OIDC、SAML、CAS多种认证协议支持</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default certifcation;
