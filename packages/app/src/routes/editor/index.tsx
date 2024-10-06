import {Editor} from '../../components/Editor/Editor';
import {cache, createAsync, type RouteDefinition} from '@solidjs/router';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createEffect, createSignal, Show} from 'solid-js';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import {EditorContext} from '../../components/Editor/editor.context';

const getWorkflow = cache(async () => {
  'use server';

  return readFile(
    join(import.meta.dirname, '../../../public/node.js.yml'),
    'utf-8',
  );
}, 'nodejs');

export const route = {
  preload: () => getWorkflow(),
} satisfies RouteDefinition;

export default function EditorPage() {
  const workflowContent = createAsync(() => {
    return getWorkflow();
  });

  const [template, setTemplate] = createSignal<{
    template: WorkflowTemplate;
    context: any;
    source: string;
  } | null>(null);

  createEffect(() => {
    const workflow = getWorkflowJson('content.yaml', workflowContent()!);
    workflow.template.then(response => {
      setTemplate({
        template: response,
        source: workflowContent()!,
        context: workflow.result.context,
      });
    });
  });

  return (
    <Show when={template()}>
      {template => (
        <EditorContext.Provider value={template()}>
          <Editor
            content={workflowContent() ?? ''}
            template={template().template}
          />
        </EditorContext.Provider>
      )}
    </Show>
  );
}
