import * as styles from './EditorHeader.css';
import {headerRepoNavLi, headerRepoNavOl} from './EditorHeader.css';
import {Button, IconButton, Link} from '@codeui/kit';
import {provideState} from 'statebuilder';
import {EditorUiStore} from '../store/ui.store';
import {type ParentProps, Show} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {A, useParams} from '@solidjs/router';

export interface EditorHeaderProps {
  showBack: boolean;
}

function EditorHeaderActionButton(
  props: ParentProps<{
    active: boolean;
    onClick: () => void;
  }>,
) {
  return (
    <Button
      class={styles.subHeaderAction()}
      theme={'secondary'}
      variant={!props.active ? 'ghost' : undefined}
      size={'xs'}
      onClick={() => props.onClick()}
    >
      {props.children}
    </Button>
  );
}

export function EditorHeader(props: EditorHeaderProps) {
  const editorUi = provideState(EditorUiStore);
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
    <>
      <header class={styles.header}>
        <Show when={props.showBack}>
          <IconButton
            aria-label={'Go back'}
            size={'xs'}
            theme={'secondary'}
            pill
            as={A}
            href={'/'}
            style={{'text-decoration': 'none'}}
          >
            <Icon name={'arrow_left_alt'} />
          </IconButton>
        </Show>

        <Show when={resolvedPath()} keyed>
          {path => (
            <nav class={styles.headerRepoNavContent}>
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

        <div class={styles.headerRightSide}>
          <Button theme={'primary'} size={'sm'}>
            Save
          </Button>
        </div>
      </header>
      <div class={styles.subHeader}>
        <EditorHeaderActionButton
          active={editorUi.get.leftPanel === 'code'}
          onClick={() => editorUi.actions.toggleLeftPanel('code')}
        >
          Code
        </EditorHeaderActionButton>
        <EditorHeaderActionButton
          active={editorUi.get.leftPanel === 'merge'}
          onClick={() => editorUi.actions.toggleLeftPanel('merge')}
        >
          Merge view
        </EditorHeaderActionButton>

        <div class={styles.subHeaderRightContent}>
          <EditorHeaderActionButton
            active={editorUi.get.rightPanel === 'properties'}
            onClick={() => editorUi.actions.toggleRightPanel('properties')}
          >
            Properties
          </EditorHeaderActionButton>
        </div>
      </div>
    </>
  );
}
