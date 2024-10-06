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
import {createSignal, Match, Switch} from 'solid-js';
import {formStyles} from '#editor-layout/Panel/Form/Form.css';
import {
  environmentControlForm,
  environmentControlInput,
  environmentControlInputValue,
} from './EnvironmentControl.css';

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
      <div class={environmentControlForm}>
        <SegmentedControl
          autoWidth={true}
          size={'sm'}
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

        <div>
          <Button theme={'primary'} onClick={submit} size={'sm'}>
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
}

export function EnvironmentControl(props: EnvironmentControlProps) {
  const fieldProps = createBaseFieldProps({
    size: 'sm',
    theme: 'filled',
  });

  const inputClasses = () =>
    mergeClasses(
      fieldProps.baseStyle(),
      textFieldStyles.textField,
      environmentControlInput,
    );

  return (
    <>
      <Popover>
        <PopoverTrigger
          as={triggerProps => (
            <div
              class={mergeClasses(
                textFieldStyles.baseFieldContainer,
                formStyles.inlineInputRoot,
              )}
              data-field-size={'sm'}
              {...triggerProps}
            >
              <label
                class={mergeClasses(
                  fieldLabelStyles.label,
                  formStyles.inlineInputLabel,
                )}
              >
                Environment
              </label>
              <div class={inputClasses()}>
                <span class={environmentControlInputValue}>
                  {props.value.name}
                </span>
              </div>
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
