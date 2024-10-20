import {makePlugin, type Store} from 'statebuilder';
import type {
  WorkflowStructureJobActionStep,
  WorkflowStructureJobRunStep,
} from '../editor.types';
import {createSignal, untrack} from 'solid-js';
import {reconcile, type SetStoreFunction} from 'solid-js/store';
import type {EditorState} from '../editor.store';
import {Document, type ParsedNode, parseDocument} from 'yaml';
import type {EditorView} from '@codemirror/view';
import {getWorkflowJson} from '@pipelineui/workflow-parser';
import {getStructureFromWorkflow} from '../utils/getStructureFromWorkflow';
import type {YamlDocumentSessionPlugin} from './yamlSession';

export const withEditorSessionState = () =>
  makePlugin.typed<Store<EditorState> & YamlDocumentSessionPlugin>()(
    _ => {
      const [session, setSession] =
        createSignal<Document.Parsed<ParsedNode, true>>();
      const [editorView, setEditorView] = createSignal<EditorView | null>(null);

      const createStepJobUpdater = <
        T extends WorkflowStructureJobRunStep | WorkflowStructureJobActionStep,
      >(
        jobId: string,
        stepId: string,
      ) => {
        const jobIndex = untrack(() =>
          _.get.structure.jobs.findIndex(job => job.$nodeId === jobId),
        );
        if (jobIndex === -1) {
          return;
        }
        const stepIndex = _.get.structure.jobs[jobIndex].steps.findIndex(
          step => step.$nodeId === stepId,
        );
        if (stepIndex === -1) {
          return;
        }

        const setter = (...args: any[]) => {
          // @ts-expect-error
          _.set('structure', 'jobs', jobIndex, 'steps', stepIndex, ...args);
        };

        return {
          update: setter as SetStoreFunction<T>,
          jobIndex,
          stepIndex,
        } as const;
      };

      return {
        session,
        setSession,
        editorView,
        setEditorView,
        utils: {
          createStepJobUpdater,
        },
        async initEditSession(source: string) {
          const yaml = parseDocument(source, {
            merge: false,
            toStringDefaults: {
              simpleKeys: true,
              collectionStyle: 'block',
              flowCollectionPadding: false,
            },
          });
          _.yamlSession.init(yaml);

          if (source.length === 0) {
            source = `
            name: Blank
            on: {}
            jobs: {}
          `;
          }

          const {result, template} = getWorkflowJson('./yaml.json', source);

          const resolvedTemplate = await template;

          console.log(resolvedTemplate);

          const parsedStructure = getStructureFromWorkflow(
            result,
            resolvedTemplate,
          );
          _.set('template', reconcile(resolvedTemplate));
          _.set('structure', reconcile(parsedStructure));
        },
      };
    },
    {name: 'editor-store-updaters'},
  );
