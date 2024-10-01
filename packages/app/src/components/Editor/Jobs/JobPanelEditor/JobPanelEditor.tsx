import {Select, TextField} from '@codeui/kit';
import * as styles from './JobPanelEditor.css';

export function JobPanelEditor() {
  return (
    <div class={styles.jobPanelEditor}>
      <TextField size={'sm'} theme={'filled'} label={'Name'} />

      <Select
        options={['1', '2']}
        size={'sm'}
        theme={'filled'}
        value={['1', '2']}
        multiple
      />

      <TextField size={'sm'} theme={'filled'} label={'Needs'} />

      <TextField size={'sm'} theme={'filled'} label={'Environment'} />

      <TextField size={'sm'} theme={'filled'} label={'Concurrency'} />

      <TextField size={'sm'} theme={'filled'} label={'If'} />
    </div>
  );
}
