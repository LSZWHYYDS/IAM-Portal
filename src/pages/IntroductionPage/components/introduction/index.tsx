import { Col, Row } from 'antd';
import styles from './index.less';
const certification = () => {
  return (
    <>
      <div className={styles.warrper}>
        <Row style={{ width: '100%' }}>
          <Col xs={24} sm={12} md={8}>
            <div className={styles.itemHeader}>
              <div className={styles.icon}>
                <img src="https://console.digitalsee.cn/wp-content/uploads/2021/06/people_4.svg" />
              </div>
              <div className={styles.name}>数字化——身份服务必在云端</div>
              <div className={styles.content}>
                从AD同步AD
                Azure吗？还是从数字化平台直接扩展吧！我们提供云原生的用户目录，让它帮您加速企业数字化的步伐，不再SaaS应用上继续构建账户烟囱
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div className={styles.itemHeader}>
              <div className={styles.icon}>
                <img src="https://console.digitalsee.cn/wp-content/uploads/2021/06/people_4.svg" />
              </div>
              <div className={styles.name}>让云原生的数字化更便捷</div>
              <div className={styles.content}>
                双向桥接让您在云端一站式的管理用户及登录凭证的生命周期，不管是IDP、应用用户数据，还是即开即用的LDAP即服务，或是SaaS云端的用户源灵活同步
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div className={styles.itemHeader}>
              <div className={styles.icons}>
                <img src="https://console.digitalsee.cn/wp-content/uploads/2021/06/people_4.svg" />
              </div>
              <div className={styles.name}>开箱即用够认真</div>
              <div className={styles.content}>
                用户源商店、SSO商店、认证源商店，预置上百个配置模块，主流用户目录及应用开箱即支持，不支持的类型通过数犀的适配框架可进行低代码开发
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default certification;
