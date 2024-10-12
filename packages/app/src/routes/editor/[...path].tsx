import {
  cache,
  createAsync,
  redirect,
  type RouteDefinition,
  type RouteSectionProps,
} from '@solidjs/router';
import {createEffect, createSignal, Show} from 'solid-js';

import {
  getWorkflowJson,
  type WorkflowTemplate,
} from '@pipelineui/workflow-parser';
import {EditorContext} from '~/components/Editor/editor.context';
import {Editor} from '~/components/Editor/Editor';
import {getGithubRepoFileContent} from '~/lib/api';

const getWorkflowFromUrl = cache(async (path: string) => {
  'use server';
  const resolvedPath = () => {
    const [owner, repoName, branchName, ...filePath] = path.split('/');
    return {
      owner,
      repoName,
      branchName,
      filePath,
    };
  };

  const {owner, repoName, branchName, filePath} = resolvedPath();

  return getGithubRepoFileContent(
    `${owner}/${repoName}`,
    branchName,
    filePath.join('/'),
  )
    .then(response => {
      if (response.failed) {
        throw redirect('/not-found');
      }
      return response.data;
    })
    .catch(() => {
      throw redirect('/not-found');
    });
}, 'github-workflow');

export const route = {
  preload: ({params}) => {
    return getWorkflowFromUrl(params.path);
  },
} satisfies RouteDefinition;

export default function EditorPage(props: RouteSectionProps) {
  const workflowContent = createAsync(() =>
    getWorkflowFromUrl(props.params.path),
  );

  const [template, setTemplate] = createSignal<{
    template: WorkflowTemplate;
    context: any;
    source: string;
  } | null>(null);

  createEffect(() => {
    const fetchedWorkflow = workflowContent();
    if (!fetchedWorkflow) {
      return;
    }
    const source = fetchedWorkflow.file.contents;
    const workflow = getWorkflowJson('content.yaml', source);
    workflow.template.then(response => {
      setTemplate({
        template: response,
        source,
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
