import {defineStore} from 'statebuilder';
import YAML, {
  Document,
  type ParsedNode,
  parseDocument,
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';
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

export interface WorkflowDispatchInput {
  name?: string;
  type?: 'string' | 'choice' | 'boolean' | 'number' | 'environment';
  deprecationMessage?: string;
  required?: boolean;
  // TODO: better type. also support expression!
  default?: any;
  description?: string;
  options?: string[];
}

export interface WorkflowStructureEvents {
  workflowDispatch: WorkflowDispatchInput[];
}

export type JobEnvironment = {
  type: 'value' | 'reference';
  name?: string;
  url?: string;
};

export interface WorkflowStructureJob {
  name: string;
  runsOn: string;
  needs: string[];
  environment: JobEnvironment | null | undefined;
}

export interface WorkflowStructure {
  name: string;
  events: WorkflowStructureEvents;
  jobs: WorkflowStructureJob[];
}

export interface EditorState {
  selectedJobId: string | null;
  template: WorkflowTemplate | null;
  structure: WorkflowStructure;
}

export function getInitialWorkflowStructureState(): WorkflowStructure {
  return {
    name: '',
    events: {
      workflowDispatch: [],
    },
    jobs: [],
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