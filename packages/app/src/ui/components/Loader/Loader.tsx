import styles from './Loader.module.css';

export function Loader() {
  return <span class={styles.loader}></span>;
}

export interface OverlayLoaderProps {
  relative?: boolean;
}
export function OverlayLoader(props: OverlayLoaderProps) {
  return (
    <div class={styles.overlay} data-relative={props.relative}>
      <Loader />
    </div>
  );
}
