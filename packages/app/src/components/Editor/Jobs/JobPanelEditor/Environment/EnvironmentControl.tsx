import {
  createBaseFieldProps,
  fieldLabelStyles,
  mergeClasses,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  TextField,
  textFieldStyles,
} from '@codeui/kit';
import * as styles from '../JobPanelEditor.css';
import {createEffect, createSignal, Match, Switch} from 'solid-js';

export type JobEnvironment = {
  type: 'value' | 'reference';
  name?: string;
  url?: string;
};

interface EnvironmentControlProps {
  value: JobEnvironment;
  onValueChange: (value: JobEnvironment) => void;
}

export function EnvironmentControl(props: EnvironmentControlProps) {
  const [name, setName] = createSignal<string>();
  const [url, setUrl] = createSignal<string>();
  createEffect(() => {
    setName(props.value?.name);
    setUrl(props.value?.url);
  });

  const fieldProps = createBaseFieldProps({
    size: 'sm',
    theme: 'filled',
  });

  const inputClasses = () =>
    mergeClasses(fieldProps.baseStyle(), textFieldStyles.textField);

  const [modality, setModality] = createSignal<string>();

  createEffect(() => {
    const name = props.value?.name;
    setName(name ?? '');
  });

  createEffect(() => {
    const type = props.value?.type;
    setModality(type ?? 'value');
  });

  return (
    <>
      <Popover>
        <PopoverTrigger
          as={props => (
            <div
              class={mergeClasses(
                textFieldStyles.baseFieldContainer,
                styles.inlineInputRoot,
              )}
              data-field-size={'sm'}
              {...props}
            >
              <label
                class={mergeClasses(
                  fieldLabelStyles.label,
                  styles.inlineInputLabel,
                )}
              >
                Environment
              </label>
              <div class={inputClasses()}>{name()}</div>
            </div>
          )}
        />
        <PopoverContent>
          <div style={{display: 'flex', width: '240px'}}>
            <SegmentedControl
              autoWidth={true}
              style={{width: '100%'}}
              value={modality()}
              onChange={value => setModality(value)}
            >
              <SegmentedControlItem value={'value'}>Value</SegmentedControlItem>
              <SegmentedControlItem value={'reference'}>
                Reference
              </SegmentedControlItem>
            </SegmentedControl>
          </div>

          <Switch>
            <Match when={modality() === 'value'}>
              <TextField
                size={'sm'}
                theme={'filled'}
                label={'Name'}
                value={name()}
              />
            </Match>

            <Match when={modality() === 'reference'}>
              <TextField
                size={'sm'}
                theme={'filled'}
                label={'Name'}
                value={name()}
              />

              <TextField
                size={'sm'}
                theme={'filled'}
                label={'Url'}
                value={url()}
              />
            </Match>
          </Switch>
        </PopoverContent>
      </Popover>
    </>
  );
}
