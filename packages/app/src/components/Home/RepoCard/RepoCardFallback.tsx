import * as styles from './RepoCard.css';
import {fallback} from '#ui/components/Fallback.css';

export function RepoCardFallback() {
  return (
    <div class={styles.repoCard}>
      <div class={styles.repoCardInfoWrapper}>
        <div class={styles.repoCardInfo}>
          <h4 class={fallback}>My repo name</h4>
          <p class={fallback}>
            Repo description text placeholder. Repo description text
            placeholder. Repo description.
          </p>
        </div>

        <div class={`${styles.repoCardStars} ${fallback}`}>S 100</div>
      </div>

      <div class={styles.repoCardWorkflows}>
        <span class={fallback}>Item 1</span>
        <span class={fallback}>Item 2</span>
        <span class={fallback}>Item 3</span>
      </div>
    </div>
  );
}
