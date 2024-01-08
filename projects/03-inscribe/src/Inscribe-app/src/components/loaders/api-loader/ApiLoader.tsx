import styles from "./ApiLoader.module.scss";

// 初始页面
function ApiLoader() {
  return <p className={styles.loader}>Initializing API</p>;
}

export { ApiLoader };
