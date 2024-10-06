import {Accordion} from '@kobalte/core/accordion';
import {
  workflowDispatchContent,
  workflowDispatchHeader,
  workflowDispatchItem,
  workflowDispatchItemForm,
  workflowDispatchTrigger,
} from './WorkflowDispatchForm.css';
import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {
  Checkbox,
  IconButton,
  NumberField,
  Select,
  TextArea,
  TextField,
} from '@codeui/kit';
import * as styles from '#editor-layout/Panel/Form/Form.css';
import {Match, Switch} from 'solid-js';
import {createControllableSignal} from '@kobalte/core';
import type {WorkflowDispatchInput} from '#editor-store/editor.types';
import {Icon} from '#ui/components/Icon';

export interface WorkflowDispatchItemFormProps {
  value: WorkflowDispatchInput;
  index: number;
  onChange: (value: WorkflowDispatchInput) => void;
  onDelete: () => void;
}

export function WorkflowDispatchItemForm(props: WorkflowDispatchItemFormProps) {
  const [form, setForm] = createControllableSignal({
    onChange(value) {
      props.onChange(value);
    },
    defaultValue: () => props.value,
  });

  const update = (partialValue: Partial<WorkflowDispatchInput>) =>
    setForm(prev => ({
      ...prev,
      ...partialValue,
    }));

  return (
    <Accordion.Item value={`${props.index}`} class={workflowDispatchItem}>
      <Accordion.Header class={workflowDispatchHeader}>
        <Accordion.Trigger class={workflowDispatchTrigger}>
          {props.value.name || `Input #${props.index}`}
        </Accordion.Trigger>
        <IconButton
          size={'xs'}
          variant={'ghost'}
          theme={'secondary'}
          aria-label={'Delete'}
          onClick={e => {
            props.onDelete();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Icon size={'sm'} name={'close_small'} />
        </IconButton>
      </Accordion.Header>
      <Accordion.Content class={workflowDispatchContent}>
        <div class={workflowDispatchItemForm}>
          <FullWidthPanelRow>
            <TextField
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              placeholder={'e.g. my input name'}
              size={'sm'}
              theme={'filled'}
              label={'Name'}
              value={form()?.name}
              onChange={value => update({name: value})}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <TextArea
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              options={{
                autoResize: true,
              }}
              size={'sm'}
              theme={'filled'}
              label={'Description'}
              value={form()?.description}
              onChange={value => update({description: value})}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <TextArea
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              options={{
                autoResize: true,
              }}
              size={'sm'}
              theme={'filled'}
              label={'Deprecation message'}
              value={form()?.deprecationMessage}
              onChange={value => update({deprecationMessage: value})}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <Select
              aria-label={'Type'}
              options={['string', 'boolean', 'number', 'choice', 'environment']}
              label={'Type'}
              multiple={false}
              slotClasses={{
                root: styles.inlineInputRoot,
                label: styles.inlineInputLabel,
              }}
              size={'sm'}
              value={form()?.type}
              onChange={input => update({type: input ?? 'string'})}
              theme={'filled'}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <Checkbox
              size={'sm'}
              theme={'filled'}
              label={'Required'}
              value={String(form()?.required ?? false)}
              onChange={required => update({required})}
            />
          </FullWidthPanelRow>

          <Switch>
            <Match when={form()?.type === 'string'}>
              <FullWidthPanelRow>
                <TextField
                  slotClasses={{
                    root: styles.inlineInputRoot,
                    label: styles.inlineInputLabel,
                  }}
                  size={'sm'}
                  theme={'filled'}
                  label={'Default value'}
                  value={form()?.default}
                  onChange={value => update({default: value})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'boolean'}>
              <FullWidthPanelRow>
                <Checkbox
                  size={'sm'}
                  theme={'filled'}
                  label={'Default value'}
                  value={form()?.default}
                  onChange={value => update({default: String(value)})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'number'}>
              <FullWidthPanelRow>
                <NumberField
                  size={'sm'}
                  theme={'filled'}
                  label={'Default value'}
                  value={
                    form()?.default ? parseInt(form()?.default!, 10) : undefined
                  }
                  onChange={value => update({default: String(value)})}
                />
              </FullWidthPanelRow>
            </Match>
            {/* TODO: add choice tag input */}
            <Match when={form()?.type === 'choice'}>
              <FullWidthPanelRow>
                <TextField
                  slotClasses={{
                    root: styles.inlineInputRoot,
                    label: styles.inlineInputLabel,
                  }}
                  size={'sm'}
                  theme={'filled'}
                  label={'Default value'}
                  value={form()?.default}
                  onChange={value => update({default: String(value)})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'environment'}>
              <FullWidthPanelRow>
                <TextField
                  slotClasses={{
                    root: styles.inlineInputRoot,
                    label: styles.inlineInputLabel,
                  }}
                  size={'sm'}
                  theme={'filled'}
                  label={'Default value'}
                  value={form()?.default}
                  onChange={value => update({default: String(value)})}
                />
              </FullWidthPanelRow>
            </Match>
          </Switch>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
