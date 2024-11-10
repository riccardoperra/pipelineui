import {Icon} from '#ui/components/Icon';
import {Button} from '@codeui/kit';
import {A} from '@solidjs/router';
import {For} from 'solid-js';
import {GithubRepositoryFile, type GithubRepository} from '~/lib/githubApi';
import * as styles from './RepoCard.css';
import {useI18n} from '~/locales/i18n';
import {msg} from '@lingui/macro';

export interface RepoCardProps {
  repo: GithubRepository;
  workflows: GithubRepositoryFile[];
}

export function RepoCard(props: RepoCardProps) {
  const {_} = useI18n();

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
        <For each={props.workflows}>
          {workflow => (
            <Button
              class={styles.repoCardWorkflowItem}
              as={A}
              pill
              title={_(msg`Edit ${workflow.path}`)}
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
