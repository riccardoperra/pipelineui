import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {TextField} from '@codeui/kit';
import * as formStyles from '#editor-layout/Panel/Form/Form.css';
import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {PanelGroup} from '#editor-layout/Panel/Form/PanelGroup';

export function JobStepForm() {
  return (
    <PanelGroup>
      <PanelHeader label={'Job information'} />

      <FullWidthPanelRow>
        <TextField
          slotClasses={{
            root: formStyles.inlineInputRoot,
            label: formStyles.inlineInputLabel,
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
            root: formStyles.inlineInputRoot,
            label: formStyles.inlineInputLabel,
          }}
          size={'sm'}
          theme={'filled'}
          label={'Name'}
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
          label={'Uses'}
        />
      </FullWidthPanelRow>
    </PanelGroup>
  );
}
