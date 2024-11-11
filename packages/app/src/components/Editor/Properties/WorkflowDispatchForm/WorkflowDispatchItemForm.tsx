import {FullWidthPanelRow} from '~/components/Editor/layout/Panel/Form/PanelRow';
import {Checkbox, NumberField, Select, TextArea, TextField} from '@codeui/kit';
import * as styles from '~/components/Editor/layout/Panel/Form/Form.css';
import {Match, Switch} from 'solid-js';
import {createControllableSignal} from '@kobalte/core';
import type {WorkflowDispatchInput} from '~/store/editor/editor.types';
import {PanelAccordionItem} from '~/components/Editor/layout/Panel/Form/PanelAccordion/PanelAccordion';

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
    <PanelAccordionItem
      onDelete={props.onDelete}
      name={props.value.name || `Input #${props.index}`}
      value={`${props.index}`}
    >
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
    </PanelAccordionItem>
  );
}
