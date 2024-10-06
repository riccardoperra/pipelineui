import {defineStore} from 'statebuilder';
import {Document, type ParsedNode, parseDocument, YAMLMap} from 'yaml';
import {createMemo, createSignal, untrack} from 'solid-js';
import {reconcile} from 'solid-js/store';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import type {WorkflowConcurrency} from '../Properties/WorkflowConcurrencyForm/WorkflowConcurrencyForm';
import {withGithubYamlManager} from './plugins/githubYamlManager';
import {withYamlDocumentSession} from './plugins/yamlSession';
import {getStructureFromWorkflow} from './utils/getStructureFromWorkflow';
import type {
  EditorWorkflowStructure,
  WorkflowDispatchInput,
  WorkflowStructureEnvItem,
} from './editor.types';

export interface EditorState {
  selectedJobId: string | null;
  template: WorkflowTemplate | null;
  structure: EditorWorkflowStructure;
}

export function getInitialWorkflowStructureState(): EditorWorkflowStructure {
  return {
    name: '',
    events: {
      workflowDispatch: [],
    },
    jobs: [],
    env: {
      map: {},
      get array() {
        return Object.values(this.map);
      },
    },
  };
}

export const EditorStore = defineStore<EditorState>(() => ({
  selectedJobId: null,
  template: null,
  structure: getInitialWorkflowStructureState(),
}))
  .extend(withYamlDocumentSession())
  .extend(withGithubYamlManager())
  .extend(_ => {
    const [session, setSession] =
      createSignal<Document.Parsed<ParsedNode, true>>();

    const [notifier, setNotifier] = createSignal([], {equals: false});

    const yamlCode = createMemo(() => {
      notifier();
      return session()?.toString() ?? '';
    });

    const yamlUpdater = (cb: () => void) => {
      cb();
      setNotifier([]);
      queueMicrotask(() => {
        getWorkflowJson('./yaml.json', session()!.toString()!).template.then(
          response => {
            _.set('template', reconcile(response));
          },
        );
      });
    };

    return {
      session,

      actions: {
        environmentVariables: {
          addNew: (value: WorkflowStructureEnvItem) => {
            _.set('structure', 'env', 'map', prevValue => {
              return {
                ...prevValue,
                [value.name]: value,
              };
            });
            _.yamlSession.setEnvironmentVariable(value.name, value);
          },
          updateByIndex: (index: number, value: WorkflowStructureEnvItem) => {
            // TODO: convert to array
            _.set('structure', 'env', 'map', prevValue => {
              const keys = Object.keys(prevValue);
              const key = keys[index];
              return {
                ...prevValue,
                [key]: value,
              };
            });
            _.yamlSession.setEnvironmentVariable(value.name, value);
          },
        },

        workflowDispatch: {
          addNew: (value: WorkflowDispatchInput) => {
            const length = untrack(
              () => _().structure.events.workflowDispatch.length,
            );
            _.set('structure', 'events', 'workflowDispatch', items => [
              ...items,
              value,
            ]);
            _.yamlSession.setWorkflowDispatch(length, value);
          },
          updateAll: (value: WorkflowDispatchInput[]) => {
            _.set('structure', 'events', 'workflowDispatch', () => value);
          },
          updateByIndex: (index: number, value: WorkflowDispatchInput) => {
            _.set('structure', 'events', 'workflowDispatch', index, value);
            _.yamlSession.setWorkflowDispatch(index, value);
          },
          deleteByIndex: (index: number) => {
            _.set('structure', 'events', 'workflowDispatch', items =>
              items.filter((item, i) => i !== index),
            );
            _.yamlSession.deleteWorkflowDispatchItem(index);
          },
        },
      },

      sessionUpdate: {
        setConcurrency: (data: WorkflowConcurrency | null) => {
          const workflow = session()!;
          yamlUpdater(() => {
            if (data === null) {
              workflow.delete('concurrency');
            } else {
              const concurrency = new YAMLMap();
              concurrency.set('group', data.group);
              concurrency.set('cancel-in-progress', data.cancelInProgress);
              workflow.set('concurrency', concurrency);
            }
          });
        },
      },

      yamlCode,
      initEditSession(source: string): void {
        _.yamlSession.init(
          parseDocument(source, {
            merge: false,
            toStringDefaults: {
              simpleKeys: true,
              collectionStyle: 'any',
              flowCollectionPadding: true,
            },
          }),
        );
        const {result, template} = getWorkflowJson(
          './yaml.json',
          _.yamlSession.document()!.toString()!,
        );
        template.then(resolvedTemplate => {
          _.set('template', reconcile(resolvedTemplate));
          _.set(
            'structure',
            reconcile(getStructureFromWorkflow(result, resolvedTemplate)),
          );
        });
      },
    };
  });
