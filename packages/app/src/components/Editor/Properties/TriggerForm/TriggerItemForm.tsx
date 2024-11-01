import {PanelAccordionItem} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {
  WORKFLOW_TRIGGER_TYPES_CONFIG,
  WorkflowTypesTriggerPullRequest,
  type WorkflowTypesTriggerEvent,
} from '~/store/editor/editor.types';
import {Button, IconButton, Select, TextField} from '@codeui/kit';
import {createControllableSignal} from '@kobalte/core';
import {createMemo, createSignal, For, Show} from 'solid-js';
import {PanelDivider} from '../../Layout/Panel/Form/PanelDivider';

import * as styles from './TriggerForm.css';
import {Icon} from '~/ui/components/Icon';
import {formStyles} from '#editor-layout/Panel/Form/Form.css';
import {L} from 'node_modules/@kobalte/core/dist/listbox-section-630514ef';

export interface TriggerEventItemFormProps {
  value: WorkflowTypesTriggerEvent;
  index: number;
  onChange: (value: WorkflowTypesTriggerEvent) => void;
  onDelete: () => void;
}

export function TriggerItemForm(props: TriggerEventItemFormProps) {
  const [form, setForm] = createControllableSignal({
    onChange(value) {
      props.onChange(value);
    },
    defaultValue: () => props.value,
  });

  const configuration = createMemo(() => {
    return WORKFLOW_TRIGGER_TYPES_CONFIG[
      props.value.type as keyof typeof WORKFLOW_TRIGGER_TYPES_CONFIG
    ];
  });

  const items = () => configuration().availableTypes;

  const update = (
    partialValue: Partial<
      WorkflowTypesTriggerEvent | WorkflowTypesTriggerPullRequest
    >,
  ) =>
    setForm(prev => ({
      ...prev,
      ...partialValue,
    }));

  const [branchesTextValue, setBranchesTextValue] = createSignal('');
  const [branchesIgnoreTextValue, setBranchesIgnoreTextValue] =
    createSignal('');

  return (
    <PanelAccordionItem
      onDelete={props.onDelete}
      name={String(props.value.type)}
      value={`${props.index}`}
    >
      <Show when={items().length > 0}>
        <FullWidthPanelRow>
          <Select<string>
            label={'Types'}
            options={items()}
            valueComponentMultiple={options => options().join(', ')}
            aria-label={'Type'}
            multiple={true}
            slotClasses={{
              root: formStyles.inlineInputRoot,
              label: formStyles.inlineInputLabel,
              itemValue: formStyles.selectTextValueMultiple,
            }}
            value={form()?.types}
            onChange={value => {
              update({types: value});
            }}
          />
        </FullWidthPanelRow>
      </Show>

      <Show when={configuration().supportsBranchProperty}>
        <PanelDivider />

        <FullWidthPanelRow>
          <div class={styles.textFieldWithAdd}>
            <TextField
              slotClasses={{
                root: formStyles.inlineInputRoot,
                label: formStyles.inlineInputLabel,
              }}
              label={'Branches'}
              value={branchesTextValue()}
              onChange={setBranchesTextValue}
            />
            <div class={styles.addButton}>
              <IconButton
                theme={'tertiary'}
                aria-label={'Add'}
                disabled={branchesTextValue().length < 2}
                onClick={() => {
                  const current = form() as WorkflowTypesTriggerPullRequest;
                  if (branchesTextValue().length <= 1) {
                    return;
                  }

                  update({
                    branches: (current.branches ?? []).concat(
                      branchesTextValue(),
                    ),
                  } satisfies Partial<WorkflowTypesTriggerPullRequest>);
                  setBranchesTextValue('');
                }}
              >
                <Icon name={'add'} />
              </IconButton>
            </div>
          </div>
        </FullWidthPanelRow>

        <Show when={form() as WorkflowTypesTriggerPullRequest}>
          {form => (
            <ul class={styles.listContainer}>
              <For each={form().branches}>
                {branch => (
                  <li class={styles.listItem}>
                    <span class={styles.listItem}>{branch}</span>
                    <div class={styles.listItemActions}>
                      <IconButton
                        size={'xs'}
                        theme={'secondary'}
                        variant={'ghost'}
                        aria-label={'Remove'}
                        onClick={() => {
                          const current =
                            form() as WorkflowTypesTriggerPullRequest;
                          update({
                            branches: (current.branches ?? []).filter(
                              item => item !== branch,
                            ),
                          } satisfies Partial<WorkflowTypesTriggerPullRequest>);
                        }}
                      >
                        <Icon name={'delete'} />
                      </IconButton>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          )}
        </Show>

        <PanelDivider />

        <FullWidthPanelRow>
          <div class={styles.textFieldWithAdd}>
            <TextField
              slotClasses={{
                root: formStyles.inlineInputRoot,
                label: formStyles.inlineInputLabel,
              }}
              label={'Ignore branches'}
              value={branchesIgnoreTextValue()}
              onChange={setBranchesIgnoreTextValue}
            />
            <div class={styles.addButton}>
              <IconButton
                theme={'tertiary'}
                aria-label={'Add'}
                disabled={branchesIgnoreTextValue().length < 2}
                onClick={() => {
                  const current = form() as WorkflowTypesTriggerPullRequest;
                  if (branchesIgnoreTextValue().length <= 1) {
                    return;
                  }

                  update({
                    branchesIgnore: (current.branchesIgnore ?? []).concat(
                      branchesIgnoreTextValue(),
                    ),
                  } satisfies Partial<WorkflowTypesTriggerPullRequest>);
                  setBranchesIgnoreTextValue('');
                }}
              >
                <Icon name={'add'} />
              </IconButton>
            </div>
          </div>
        </FullWidthPanelRow>

        <Show when={form() as WorkflowTypesTriggerPullRequest}>
          {form => (
            <ul class={styles.listContainer}>
              <For each={form().branchesIgnore}>
                {branch => (
                  <li class={styles.listItem}>
                    <span class={styles.listItem}>{branch}</span>
                    <div class={styles.listItemActions}>
                      <IconButton
                        size={'xs'}
                        theme={'secondary'}
                        variant={'ghost'}
                        aria-label={'Remove'}
                        onClick={() => {
                          const current =
                            form() as WorkflowTypesTriggerPullRequest;
                          update({
                            branchesIgnore: (
                              current.branchesIgnore ?? []
                            ).filter(item => item !== branch),
                          } satisfies Partial<WorkflowTypesTriggerPullRequest>);
                        }}
                      >
                        <Icon name={'delete'} />
                      </IconButton>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          )}
        </Show>
      </Show>
    </PanelAccordionItem>
  );
}
