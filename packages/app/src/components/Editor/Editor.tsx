import {EditorSidebar} from './LeftSidebar/EditorSidebar';
import * as styles from './Editor.css';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import type {WorkflowTemplate} from '@pipelineui/workflow-parser';
import {Canvas} from './Canvas/Canvas';
import {EditorHeader} from './Header/Header';
import {provideState} from 'statebuilder';
import {EditorUiStore} from './store/ui.store';
import {
  createEffect,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import {YamlEditor} from './YamlEditor/YamlEditor';
import {EditorStatusBar} from './StatusBar/StatusBar';
import Resizable from '@corvu/resizable';
import {EditorResizableHandler} from './Layout/Resizable';
import {EditorStore} from './store/editor.store';
import {useEditorContext} from './editor.context';
import {PropertiesPanelEditor} from './Properties/PropertiesPanelEditor';

interface EditorProps {
  content: string;
  template: WorkflowTemplate;
}

export function Editor(props: EditorProps) {
  const editorUi = provideState(EditorUiStore);
  const editor = provideState(EditorStore);
  const {source} = useEditorContext();

  onMount(() => {
    editor.initEditSession(source);
  });

  // createEffect(() => {
  //   const leftPanel = editorUi.get.leftPanel;
  //   const resizable = resizableContext();
  //   if (!resizable) {
  //     return;
  //   }
  //   if (leftPanel === 'none' && resizable.sizes()[0] > 0) {
  //     resizable.collapse(0);
  //   } else if (leftPanel !== 'none') {
  //     resizable.expand(0);
  //   }
  // });

  const isLeftCollapsed = () => {
    const context = resizableContext();
    if (!context) {
      return false;
    }
    return context.sizes()[0] === 0;
  };

  // createEffect(() => {
  //   if (isLeftCollapsed() && editorUi.get.leftPanel !== 'none') {
  //     editorUi.set('leftPanel', 'none');
  //   } else if (!isLeftCollapsed() && editorUi.get.leftPanel === 'none') {
  //     editorUi.set('leftPanel', 'code');
  //   }
  // });

  return (
    <div class={styles.wrapper}>
      <EditorHeader />
      <div class={styles.editor}>
        <Resizable orientation={'horizontal'} class={styles.editorResizable}>
          {() => {
            const context = Resizable.useContext();
            editorUi.setResizableContext(context);

            return (
              <>
                <Resizable.Panel
                  initialSize={0.25}
                  minSize={0.1}
                  collapsible
                  class={styles.resizablePanel}
                >
                  <Show
                    when={
                      editorUi.get.leftPanel !== 'none' &&
                      editorUi.get.leftPanel
                    }
                  >
                    {leftPanel => (
                      <>
                        <EditorSidebar position={'left'}>
                          <Switch>
                            <Match when={leftPanel() === 'code'}>
                              <YamlEditor
                                code={editor.yamlCode()}
                                setCode={() => {}}
                              />
                            </Match>
                          </Switch>
                        </EditorSidebar>
                      </>
                    )}
                  </Show>
                </Resizable.Panel>

                <EditorResizableHandler
                  hidden={editorUi.get.leftPanel === 'none'}
                  position={'left'}
                />

                <Resizable.Panel initialSize={0.58}>
                  <Show when={editor.get.template}>
                    <Canvas template={editor.get.template!} />
                  </Show>
                </Resizable.Panel>

                <EditorResizableHandler
                  hidden={editorUi.get.rightPanel === 'none'}
                  position={'right'}
                />

                <Resizable.Panel
                  initialSize={0.17}
                  minSize={0.1}
                  collapsible
                  class={styles.resizablePanel}
                >
                  <Show
                    when={
                      editorUi.get.rightPanel !== 'none' &&
                      editorUi.get.rightPanel
                    }
                  >
                    {rightPanel => (
                      <>
                        <EditorSidebar position={'right'}>
                          <Switch>
                            <Match when={rightPanel() === 'properties'}>
                              <Show
                                fallback={<PropertiesPanelEditor />}
                                when={editor.get.selectedJobId}
                              >
                                <JobPanelEditor />
                              </Show>
                            </Match>
                          </Switch>
                        </EditorSidebar>
                      </>
                    )}
                  </Show>
                </Resizable.Panel>
              </>
            );
          }}
        </Resizable>
      </div>
      <EditorStatusBar />
    </div>
  );
}
