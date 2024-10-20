import {A, useParams} from '@solidjs/router';
import {Show} from 'solid-js';
import {headerRepoNavLi, headerRepoNavOl} from './EditorHeader.css';
import {Link} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';

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
              <Link variant={'underline'} href={''} aria-current={'page'}>
                {path.filePath.join('/')}
              </Link>
            </li>
          </ol>
        </nav>
      )}
    </Show>
  );
}
