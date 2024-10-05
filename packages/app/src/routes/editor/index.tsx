import {Editor} from '../../components/Editor/Editor';
import {cache, createAsync} from '@solidjs/router';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createEffect, createResource, createSignal, Show} from 'solid-js';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import {EditorContext} from '../../components/Editor/editor.context';

const getWorkflow = cache(async () => {
  'use server';

  return readFile(
    join(import.meta.dirname, '../../../public/codeimage-prod-deploy.yml'),
    'utf-8',
  );
}, 'nodejs');

export const route = {
  preload: () => getWorkflow(),
};

export default function EditorPage() {
  const workflowContent = createAsync(() => getWorkflow());

  const [template, setTemplate] = createSignal<{
    template: WorkflowTemplate;
    context: any;
  } | null>(null);

  createEffect(() => {
    const workflow = getWorkflowJson('content.yaml', workflowContent()!);
    workflow.template.then(response => {
      setTemplate({
        template: response,
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
