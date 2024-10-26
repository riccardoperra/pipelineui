import {PanelAccordionItem} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {FullWidthPanelRow} from '#editor-layout/Panel/Form/PanelRow';
import {
  WORKFLOW_TRIGGER_TYPES_CONFIG,
  type WorkflowTypesTriggerEvent,
} from '#editor-store/editor.types';
import {Select} from '@codeui/kit';
import {createControllableSignal} from '@kobalte/core';
import {createMemo} from 'solid-js';

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

  const update = (partialValue: Partial<WorkflowTypesTriggerEvent>) =>
    setForm(prev => ({
      ...prev,
      ...partialValue,
    }));

  return (
    <PanelAccordionItem
      onDelete={props.onDelete}
      name={String(props.value.type)}
      value={`${props.index}`}
    >
      <FullWidthPanelRow>
        <Select<string>
          label={'Types'}
          options={items()}
          aria-label={'Type'}
          multiple={true}
          value={form()?.types}
          onChange={value => {
            update({types: value});
          }}
        />
      </FullWidthPanelRow>
    </PanelAccordionItem>
  );
}
