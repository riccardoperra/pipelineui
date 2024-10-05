import {Select, TextField} from '@codeui/kit';
import * as styles from './JobPanelEditor.css';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import {PanelHeader} from './Form/PanelHeader';
import {FullWidthPanelRow, PanelRow, TwoColumnPanelRow} from './Form/PanelRow';
import {inlineInputLabel, inlineInputRoot} from './JobPanelEditor.css';
import {PanelDivider} from './Form/PanelDivider';

export function JobPanelEditor() {
  const editorStore = provideState(EditorStore);

  return (
    <div class={styles.jobPanelEditor}>
      <PanelHeader label={'General'} />

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: styles.inlineInputRoot,
            label: styles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Name'}
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
          label={'Runs on'}
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
          label={'Needs'}
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
          label={'Environment'}
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
          label={'Concurrency'}
        />
      </FullWidthPanelRow>

      <PanelDivider />

      <PanelHeader label={'Steps'} />

      <Select
        options={['1', '2']}
        size={'sm'}
        theme={'filled'}
        value={['1', '2']}
        multiple
      />
    </div>
  );
}
