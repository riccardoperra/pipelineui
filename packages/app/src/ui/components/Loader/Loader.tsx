import styles from './Loader.module.css';

export function Loader() {
  return <span class={styles.loader}></span>;
}

export function OverlayLoader() {
  return (
    <div class={styles.overlay}>
      <Loader />
    </div>
  );
}
