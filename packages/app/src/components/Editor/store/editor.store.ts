import {defineStore} from 'statebuilder';
import YAML, {
  Document,
  type ParsedNode,
  parseDocument,
  Schema,
  YAMLMap,
  YAMLSeq,
  Scalar,
  YAMLSet,
} from 'yaml';
import {createMemo, createSignal} from 'solid-js';
import {createStore, reconcile} from 'solid-js/store';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import type {JobEnvironment} from '../Jobs/JobPanelEditor/Environment/EnvironmentControl';

export interface EditorState {
  selectedJobId: string | null;
  template: WorkflowTemplate | null;
}

export const EditorStore = defineStore<EditorState>(() => ({
  selectedJobId: null,
  template: null,
})).extend(_ => {
  const [session, setSession] =
    createSignal<Document.Parsed<ParsedNode, true>>();

  const [notifier, setNotifier] = createSignal([], {equals: false});

  const [jsonCode, setJsonCode] = createStore({});

  const yamlCode = createMemo(() => {
    notifier();
    return session()?.toString() ?? '';
  });

  const yamlUpdater = (cb: () => void) => {
    cb();
    setNotifier([]);
    setJsonCode(reconcile(session()!.toJSON()));
    queueMicrotask(() => {
      getWorkflowJson('./yaml.json', session()!.toString()!).template.then(
        response => {
          _.set('template', reconcile(response));
        },
      );
    });
  };

  const findJob = (jobId: string) => {
    const yaml = session()!;
    const jobs = yaml.get('jobs') as YAMLMap<String, YAMLMap>;

    return jobs.get(jobId);
  };

  return {
    session,

    sessionUpdate: {
      setJobName: (jobId: string, name: string) => {
        const job = findJob(jobId)!;
        yamlUpdater(() => {
          job.set('name', name);
        });
      },
      setNeeds: (jobId: string, needs: string[]) => {
        const job = findJob(jobId)!;
        yamlUpdater(() => {
          if (!job.has('needs')) {
            job.set('needs', needs);
          } else {
            const needsSeq = job.get('needs') as YAMLSeq;
            const jsonSeq = needsSeq.toJSON();
            for (let i = 0; i < jsonSeq.length; i++) {
              needsSeq.delete(0);
            }
            needs.forEach(need => needsSeq.add(need));
          }
        });
      },
      setEnvironment: (jobId: string, environment: JobEnvironment) => {
        const job = findJob(jobId)!;
        yamlUpdater(() => {
          let node: YAMLMap | Scalar;
          if (environment.type === 'value') {
            node = new Scalar(environment.name);
          } else {
            node = new YAMLMap();
            node.set('name', environment.name);
            node.set('url', environment.url);
          }
          job.set('environment', node);
        });
      },
    },

    yamlCode,
    initEditSession(source: string): void {
      setSession(
        parseDocument(source, {
          merge: false,
          toStringDefaults: {
            simpleKeys: true,
            collectionStyle: 'any',
            flowCollectionPadding: true,
          },
        }),
      );
      getWorkflowJson('./yaml.json', session()!.toString()!).template.then(
        response => {
          _.set('template', reconcile(response));
        },
      );
    },
  };
});
