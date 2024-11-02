import {PanelAccordion} from '#editor-layout/Panel/Form/PanelAccordion/PanelAccordion';
import {PanelContent} from '#editor-layout/Panel/Form/PanelContent';
import {PanelHeader} from '#editor-layout/Panel/Form/PanelHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
} from '@codeui/kit';
import {createMemo, createSelector, For, Show} from 'solid-js';
import {provideState} from 'statebuilder';
import {Icon} from '~/ui/components/Icon';
import {EditorStore} from '../../../../store/editor/editor.store';
import {
  AVAILABLE_WORKFLOW_TRIGGER_TYPES,
  WorkflowTypesTriggerEvent,
} from '../../../../store/editor/editor.types';
import {TriggerItemForm} from './TriggerItemForm';

import * as styles from './TriggerForm.css';

export function TriggerForm() {
  const editor = provideState(EditorStore);
  const triggerEvents = () => editor.get.structure.events.triggerEvents ?? [];

  const addedTriggerEvents = createMemo(() =>
    (editor.get.structure.events.triggerEvents ?? []).map(
      event => event.type as string,
    ),
  );

  const alreadyAdded = createSelector<string[], string>(
    addedTriggerEvents,
    (a, b) => b.includes(a),
  );

  const addNew = (type: string) => {
    const draftInput: WorkflowTypesTriggerEvent = {
      $nodeId: crypto.randomUUID().toString(),
      type: type,
      types: [],
    };
    editor.actions.addNewTriggerEventTypes({value: draftInput});
  };

  return (
    <>
      <PanelHeader
        label={'Workflow triggers'}
        rightContent={() => (
          <DropdownMenu>
            <DropdownMenuTrigger<'button'>
              as={triggerProps => (
                <IconButton
                  size={'xs'}
                  variant={'ghost'}
                  theme={'secondary'}
                  aria-label={'Add trigger'}
                  {...triggerProps}
                />
              )}
            >
              <Icon name={'add'} size={'sm'} />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent class={styles.dropdown}>
                <For each={AVAILABLE_WORKFLOW_TRIGGER_TYPES}>
                  {type => (
                    <DropdownMenuItem
                      disabled={alreadyAdded(type)}
                      onClick={() => addNew(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  )}
                </For>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        )}
      />

      <Show when={triggerEvents().length}>
        <PanelContent>
          <PanelAccordion>
            <For each={triggerEvents()}>
              {(input, index) => {
                return (
                  <TriggerItemForm
                    value={input}
                    index={index()}
                    onDelete={() =>
                      editor.actions.deleteTriggerEventTypes({
                        $nodeId: input.$nodeId,
                      })
                    }
                    onChange={value => {
                      editor.actions.updateTriggerEventTypes({
                        value,
                        index: index(),
                      });
                    }}
                  />
                );
              }}
            </For>
          </PanelAccordion>
        </PanelContent>
      </Show>
    </>
  );
}
