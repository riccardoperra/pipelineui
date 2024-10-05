import {PanelHeader} from '../../Jobs/JobPanelEditor/Form/PanelHeader';
import {IconButton, TextField} from '@codeui/kit';
import {createStore} from 'solid-js/store';
import {createEffect} from 'solid-js';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import {useEditorContext} from '../../editor.context';
import {FullWidthPanelRow} from '../../Jobs/JobPanelEditor/Form/PanelRow';
import * as styles from '../../Jobs/JobPanelEditor/JobPanelEditor.css';

export interface WorkflowConcurrency {
  group?: string;
  cancelInProgress?: string;
}

export function WorkflowConcurrencyForm() {
  const [form, setFOrm] = createStore<WorkflowConcurrency>({});
  const editor = provideState(EditorStore);
  const {template, context} = useEditorContext();

  createEffect(() => {
    const concurrency = template.concurrency;
  });

  const setConcurrency = (concurrency: WorkflowConcurrency | null) => {
    editor.sessionUpdate.setConcurrency(concurrency);
  };

  return (
    <>
      <PanelHeader
        label={'Concurrency'}
        rightContent={
          <IconButton
            size={'xs'}
            theme={'secondary'}
            aria-label={'Add concurrency groups'}
            onClick={() =>
              setConcurrency({
                group: 'test',
                cancelInProgress: `\${{github.test}}}`,
              })
            }
          >
            +
          </IconButton>
        }
      />

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: styles.inlineInputRoot,
            label: styles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Group'}
        />
      </FullWidthPanelRow>

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: styles.inlineInputRoot,
            label: styles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Cancel in progress'}
        />
      </FullWidthPanelRow>
    </>
  );
}
