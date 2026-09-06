import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
};

export default Loader;