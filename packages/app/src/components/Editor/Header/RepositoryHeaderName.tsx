import {Icon} from '#ui/components/Icon';
import {Link} from '@codeui/kit';
import {A, useParams} from '@solidjs/router';
import {Show} from 'solid-js';
import {headerRepoNavLi, headerRepoNavOl} from './EditorHeader.css';

const buildGitHubLink = (
  owner: string,
  repoName: string,
  branch: string,
  file: string,
) =>
  `https://github.com/${owner}/${repoName}/blob/${branch}/.github/workflows/${file}`;

export function EditorRepositoryHeaderName() {
  const params = useParams();

  const resolvedPath = () => {
    const [owner, repoName, branchName, ...filePath] = params.path.split('/');
    return {
      owner,
      repoName,
      branchName,
      filePath,
    };
  };

  const gitHubExternalLink = () => {
    const path = resolvedPath();
    return buildGitHubLink(
      path.owner,
      path.repoName,
      path.branchName,
      path.filePath[path.filePath.length - 1],
    );
  };

  return (
    <Show when={resolvedPath()} keyed>
      {path => (
        <nav>
          <ol class={headerRepoNavOl}>
            <li class={headerRepoNavLi}>
              <Link
                variant={'underline'}
                as={A}
                href={`/?repo=${path.owner}/${path.repoName}`}
              >
                {path.owner}/{path.repoName}
              </Link>
            </li>
            <li class={headerRepoNavLi} role={'separator'}>
              <Icon name={'arrow_right_alt'} />
            </li>
            <li class={headerRepoNavLi}>
              <Icon name={'account_tree'} />
              {path.branchName}
            </li>
            <li class={headerRepoNavLi} role={'separator'}>
              <Icon name={'arrow_right_alt'} />
            </li>
            <li class={headerRepoNavLi}>
              <Link
                variant={'underline'}
                href={gitHubExternalLink()}
                target="_blank"
                aria-current={'page'}
              >
                {path.filePath.join('/')}

                <Icon name={'open_in_new'} />
              </Link>
            </li>
          </ol>
        </nav>
      )}
    </Show>
  );
}
