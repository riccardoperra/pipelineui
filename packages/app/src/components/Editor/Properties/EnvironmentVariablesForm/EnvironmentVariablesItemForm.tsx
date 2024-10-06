import {Accordion} from '@kobalte/core/accordion';
import {
  workflowDispatchContent,
  workflowDispatchHeader,
  workflowDispatchItem,
  workflowDispatchTrigger,
} from './EnvironmentVariableForm.css';
import {
  Checkbox,
  IconButton,
  NumberField,
  Select,
  TextField,
} from '@codeui/kit';
import {createControllableSignal} from '@kobalte/core';
import type {
  StringExpression,
  WorkflowStructureEnvItem,
} from '#editor-store/editor.types';
import {Icon} from '#ui/components/Icon';
import {workflowDispatchItemForm} from '../WorkflowDispatchForm/WorkflowDispatchForm.css';
import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {createEffect, Match, Switch} from 'solid-js';
import {unwrap} from 'solid-js/store';

export interface EnvironmentVariablesItemFormProps {
  value: WorkflowStructureEnvItem;
  index: number;
  onChange: (value: WorkflowStructureEnvItem) => void;
  onDelete: () => void;
}

export function EnvironmentVariablesItemForm(
  props: EnvironmentVariablesItemFormProps,
) {
  const [form, setForm] = createControllableSignal({
    onChange(value) {
      props.onChange(value);
    },
    defaultValue: () => unwrap(props.value),
  });

  const update = (partialValue: Partial<WorkflowStructureEnvItem>) =>
    setForm(prev => ({
      ...prev,
      ...partialValue,
    }));

  return (
    <Accordion.Item value={`${props.index}`} class={workflowDispatchItem}>
      <Accordion.Header class={workflowDispatchHeader}>
        <Accordion.Trigger class={workflowDispatchTrigger}>
          {props.value.name || `Env variable #${props.index}`}
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
              placeholder={'e.g. my variable name'}
              size={'sm'}
              theme={'filled'}
              label={'Name'}
              value={form()?.name}
              onChange={value => update({name: value})}
            />
          </FullWidthPanelRow>

          <FullWidthPanelRow>
            <Select
              size={'sm'}
              aria-label={'Type'}
              options={['string', 'boolean', 'expression', 'number']}
              theme={'filled'}
              label={'Type'}
              value={form()?.type}
              onChange={value => update({type: value ?? 'string'})}
            />
          </FullWidthPanelRow>

          <Switch>
            <Match when={form()?.type === 'string'}>
              <FullWidthPanelRow>
                <TextField
                  size={'sm'}
                  theme={'filled'}
                  label={'Value'}
                  value={form()?.value}
                  onChange={value => update({value: value})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'number'}>
              <FullWidthPanelRow>
                <NumberField
                  size={'sm'}
                  theme={'filled'}
                  label={'Value'}
                  value={form()?.value}
                  onChange={value => update({value: value})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'boolean'}>
              <FullWidthPanelRow>
                <Checkbox
                  size={'sm'}
                  theme={'filled'}
                  label={'Value'}
                  value={form()?.value}
                  onChange={value => update({value: value})}
                />
              </FullWidthPanelRow>
            </Match>
            <Match when={form()?.type === 'expression'}>
              {(() => {
                const value = form()?.value as StringExpression;
                return (
                  <FullWidthPanelRow>
                    <TextField
                      size={'sm'}
                      theme={'filled'}
                      label={'Value'}
                      value={value.value}
                      onChange={value =>
                        update({
                          value: {
                            ...value,
                            value,
                          },
                        })
                      }
                    />
                  </FullWidthPanelRow>
                );
              })()}
            </Match>
          </Switch>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
