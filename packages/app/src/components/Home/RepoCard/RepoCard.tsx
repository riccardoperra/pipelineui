import {
  getGithubRepoWorkflowFiles,
  type GithubRepository,
} from '~/lib/githubApi';
import * as styles from './RepoCard.css';
import {Icon} from '#ui/components/Icon';
import {createAsync, A} from '@solidjs/router';
import {For, Suspense} from 'solid-js';
import {Button} from '@codeui/kit';

export interface RepoCardProps {
  repo: GithubRepository;
}

export function RepoCard(props: RepoCardProps) {
  const workflows = createAsync(() =>
    getGithubRepoWorkflowFiles(props.repo.repo, props.repo.defaultBranch),
  );

  return (
    <div class={styles.repoCard}>
      <div class={styles.repoCardInfoWrapper}>
        <div class={styles.repoCardInfo}>
          <h4>{props.repo.name}</h4>
          <p class={styles.repoCardDescription}>{props.repo.description}</p>
        </div>

        <div class={styles.repoCardStars}>
          <Icon name={'star'} class={styles.repoCardStarsIcon} />
          {props.repo.stars}
        </div>
      </div>

      <div class={styles.repoCardWorkflows}>
        <For each={workflows()}>
          {workflow => (
            <Button
              class={styles.repoCardWorkflowItem}
              as={A}
              pill
              title={`Edit ${workflow.path}`}
              href={`/editor/${props.repo.repo}/${props.repo.defaultBranch}/${workflow.path}`}
              size={'md'}
              theme={'secondary'}
            >
              {workflow.path.replace('.github/workflows/', '')}

              <Icon name={'arrow_right_alt'} />
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
