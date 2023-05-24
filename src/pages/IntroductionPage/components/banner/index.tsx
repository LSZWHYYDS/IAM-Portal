import styles from './index.less';
const banner = () => {
  return (
    <>
      <div className={styles.bannerbg}>
        <div className={styles.wrappers}>
          <div className={styles.headerWrapper}>
            <h2 className={styles.lead}>
              <h2 className={styles.h1style}>企业数字化第一步</h2>
              <h2 className={styles.h1style}>将用户身份连接至云</h2>
            </h2>
            <h2 className={styles.desc}>安全的连接管理员工账号、认证源、企业应用</h2>
          </div>
          <div>
            <img src="https://console.digitalsee.cn/wp-content/uploads/2021/06/cloud_linker.svg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default banner;
