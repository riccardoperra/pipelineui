import {FullWidthPanelRow} from '../../Form/PanelRow';
import {TextField} from '@codeui/kit';
import * as styles from '../../JobPanelEditor.css';
import {PanelHeader} from '../../Form/PanelHeader';

export function JobStepForm() {
  return (
    <div class={styles.jobPanelEditor}>
      <PanelHeader label={'Job information'} />

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: styles.inlineInputRoot,
            label: styles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Id'}
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
          label={'If'}
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
          label={'Uses'}
        />
      </FullWidthPanelRow>
    </div>
  );
}
