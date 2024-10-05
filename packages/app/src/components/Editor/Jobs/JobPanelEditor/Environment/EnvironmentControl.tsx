import {
  Button,
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

interface EnvironmentControlFormProps {
  initialName: string;
  initialUrl: string;
  initialModality: 'value' | 'reference';
  onSubmit: (environment: JobEnvironment) => void;
}

function EnvironmentControlForm(props: EnvironmentControlFormProps) {
  const [modality, setModality] = createSignal(props.initialModality);
  const [name, setName] = createSignal<string>(props.initialName);
  const [url, setUrl] = createSignal<string>(props.initialUrl);

  const submit = () => {
    props.onSubmit({
      type: modality() as 'value' | 'reference',
      name: name() ?? '',
      url: url() ?? '',
    });
  };

  return (
    <>
      <div style={{display: 'flex', width: '240px'}}>
        <SegmentedControl
          autoWidth={true}
          style={{width: '100%'}}
          value={modality()}
          onChange={value =>
            setModality(value as EnvironmentControlFormProps['initialModality'])
          }
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
            onChange={setName}
          />
        </Match>

        <Match when={modality() === 'reference'}>
          <TextField
            size={'sm'}
            theme={'filled'}
            label={'Name'}
            value={name()}
            onChange={setName}
          />

          <TextField
            size={'sm'}
            theme={'filled'}
            label={'Url'}
            value={url()}
            onChange={setUrl}
          />
        </Match>
      </Switch>

      <Button theme={'primary'} onClick={submit} size={'sm'}>
        Confirm
      </Button>
    </>
  );
}

export function EnvironmentControl(props: EnvironmentControlProps) {
  const fieldProps = createBaseFieldProps({
    size: 'sm',
    theme: 'filled',
  });

  const inputClasses = () =>
    mergeClasses(fieldProps.baseStyle(), textFieldStyles.textField);

  return (
    <>
      <Popover>
        <PopoverTrigger
          as={triggerProps => (
            <div
              class={mergeClasses(
                textFieldStyles.baseFieldContainer,
                styles.inlineInputRoot,
              )}
              data-field-size={'sm'}
              {...triggerProps}
            >
              <label
                class={mergeClasses(
                  fieldLabelStyles.label,
                  styles.inlineInputLabel,
                )}
              >
                Environment
              </label>
              <div class={inputClasses()}>{props.value.name}</div>
            </div>
          )}
        />
        <PopoverContent>
          <EnvironmentControlForm
            initialModality={props.value.type ?? 'value'}
            initialName={props.value.name ?? ''}
            initialUrl={props.value.url ?? ''}
            onSubmit={props.onValueChange}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
