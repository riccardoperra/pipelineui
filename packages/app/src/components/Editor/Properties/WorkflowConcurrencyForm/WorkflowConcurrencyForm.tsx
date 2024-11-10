import {PanelHeader} from '../../layout1/Panel/Form/PanelHeader';
import {TextField} from '@codeui/kit';
import {provideState} from 'statebuilder';
import {EditorStore} from '~/store/editor/editor.store';
import {FullWidthPanelRow} from '../../layout1/Panel/Form/PanelRow';
import {formStyles} from '~/components/Editor/layout/Panel/Form/Form.css';
import {PanelPlusButton} from '~/components/Editor/layout1/Panel/Form/PanelPlusButton';

export interface WorkflowConcurrency {
  group?: string;
  cancelInProgress?: string;
}

export function WorkflowConcurrencyForm() {
  const editor = provideState(EditorStore);

  const setConcurrency = (concurrency: WorkflowConcurrency | null) => {
    editor.sessionUpdate.setConcurrency(concurrency);
  };

  return (
    <>
      <PanelHeader
        label={'Concurrency'}
        rightContent={() => (
          <PanelPlusButton
            aria-label={'Add concurrency group'}
            onClick={() =>
              setConcurrency({
                group: 'test',
                cancelInProgress: `\${{github.test}}}`,
              })
            }
          />
        )}
      />

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: formStyles.inlineInputRoot,
            label: formStyles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Group'}
        />
      </FullWidthPanelRow>

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: formStyles.inlineInputRoot,
            label: formStyles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Cancel in progress'}
        />
      </FullWidthPanelRow>
    </>
  );
}
