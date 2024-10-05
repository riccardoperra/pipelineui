import {defineStore} from 'statebuilder';
import {Document, type ParsedNode, parseDocument, YAMLMap} from 'yaml';
import {createMemo, createSignal} from 'solid-js';
import {createStore, reconcile} from 'solid-js/store';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';

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
    },

    yamlCode,
    initEditSession(source: string): void {
      setSession(parseDocument(source));
      getWorkflowJson('./yaml.json', session()!.toString()!).template.then(
        response => {
          _.set('template', reconcile(response));
        },
      );
    },
  };
});
