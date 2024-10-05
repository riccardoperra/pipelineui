import {PanelHeader} from '../../Jobs/JobPanelEditor/Form/PanelHeader';
import {IconButton} from '@codeui/kit';
import {createStore} from 'solid-js/store';
import {createEffect, For} from 'solid-js';
import {Accordion} from '@kobalte/core/accordion';
import {workflowDispatchList} from './WorkflowDispatchForm.css';
import {WorkflowDispatchItemForm} from './WorkflowDispatchItemForm';
import {provideState} from 'statebuilder';
import {EditorStore} from '../../store/editor.store';
import {useEditorContext} from '../../editor.context';

export interface WorkflowDispatchInput {
  name?: string;
  type?: 'string' | 'choice' | 'boolean' | 'number' | 'environment';
  deprecationMessage?: string;
  required?: boolean;
  default?: string;
  description?: string;
  options?: string[];
}

export function WorkflowDispatchForm() {
  const [inputs, setInputs] = createStore<WorkflowDispatchInput[]>([]);
  const editor = provideState(EditorStore);
  const {template, context} = useEditorContext();

  createEffect(() => {
    const workflowDispatch = template.events?.workflow_dispatch?.inputs;
    if (workflowDispatch) {
      const initialInputs = [...Object.entries(workflowDispatch)].reduce(
        (acc, [key, value]) => {
          acc.push({
            name: key,
            type: value.type,
            default: String(value.default),
            required: value.required,
            options: value.options,
            description: value.description,
          });
          return acc;
        },
        [] as WorkflowDispatchInput[],
      );
      setInputs(() => initialInputs);
    }
  });

  const addNew = () => {
    const draftInput: WorkflowDispatchInput = {
      name: '',
      type: 'string',
      deprecationMessage: undefined,
      required: false,
      default: undefined,
      description: undefined,
      options: undefined,
    };
    setInputs(inputs => [...inputs, draftInput]);
  };

  const syncWorkflowDispatchItem = (index: number) => {
    editor.sessionUpdate.setWorkflowDispatch(index, inputs[index]);
  };

  return (
    <>
      <PanelHeader
        label={'Workflow Dispatch'}
        rightContent={
          <IconButton
            size={'xs'}
            theme={'secondary'}
            aria-label={'Add input'}
            onClick={addNew}
          >
            +
          </IconButton>
        }
      />

      <Accordion class={workflowDispatchList}>
        <For each={inputs}>
          {(input, index) => {
            return (
              <WorkflowDispatchItemForm
                value={input}
                index={index()}
                onChange={value => {
                  setInputs(index(), value);
                  syncWorkflowDispatchItem(index());
                }}
              />
            );
          }}
        </For>
      </Accordion>
    </>
  );
}
