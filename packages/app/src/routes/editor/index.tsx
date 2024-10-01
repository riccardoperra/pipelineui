import {Editor} from '../../components/Editor/Editor';
import {cache, createAsync} from '@solidjs/router';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createEffect, createResource, createSignal, Show} from 'solid-js';
import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';

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

  const [template, setTemplate] = createSignal<WorkflowTemplate | null>(null);

  createEffect(() => {
    getWorkflowJson('content.yaml', workflowContent()!).then(setTemplate);
  });

  return (
    <Show when={template()}>
      {template => <Editor template={template()} />}
    </Show>
  );
}
