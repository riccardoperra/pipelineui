import * as styles from './EditorHeader.css';
import {Button, IconButton, Link} from '@codeui/kit';
import {provideState} from 'statebuilder';
import {EditorUiStore} from '../store/ui.store';
import {JSX, type ParentProps, Show} from 'solid-js';
import {Icon} from '#ui/components/Icon';
import {A, useParams} from '@solidjs/router';

export interface EditorHeaderProps {
  showBack: boolean;
  name: JSX.Element;
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

        {props.name}

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
