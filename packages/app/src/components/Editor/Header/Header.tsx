import * as styles from './EditorHeader.css';
import {Button} from '@codeui/kit';
import {provideState} from 'statebuilder';
import {EditorUiStore} from '../store/ui.store';

export function EditorHeader() {
  const editorUi = provideState(EditorUiStore);

  return (
    <>
      <header class={styles.header}>
        <div>File name</div>

        <div class={styles.headerRightSide}>
          <Button theme={'primary'} size={'sm'}>
            Save
          </Button>
        </div>
      </header>
      <div class={styles.subHeader}>
        <Button
          theme={'secondary'}
          variant={'ghost'}
          size={'xs'}
          onClick={() => editorUi.actions.toggleLeftPanel('code')}
        >
          Code
        </Button>
        <Button
          theme={'secondary'}
          variant={'ghost'}
          size={'xs'}
          onClick={() => editorUi.actions.toggleLeftPanel('structure')}
        >
          Structure
        </Button>

        <div class={styles.subHeaderRightContent}>
          <Button
            theme={'secondary'}
            variant={'ghost'}
            size={'xs'}
            onClick={() => editorUi.actions.toggleRightPanel('properties')}
          >
            Properties
          </Button>
        </div>
      </div>
    </>
  );
}
