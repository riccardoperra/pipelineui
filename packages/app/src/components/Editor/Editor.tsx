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
import {cookieStorage, makePersisted} from '@solid-primitives/storage';
import {EditorResizableHandler} from './Layout/Resizable';
import {EditorStore} from './store/editor.store';

interface EditorProps {
  content: string;
  template: WorkflowTemplate;
}

export function Editor(props: EditorProps) {
  const editorUi = provideState(EditorUiStore);
  const editor = provideState(EditorStore);

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
                                code={props.content}
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
                  <Canvas template={props.template} />
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
                              {editor.get.selectedJobId && <JobPanelEditor />}
                            </Match>
                          </Switch>
                        </EditorSidebar>
                      </>
                    )}
                  </Show>
                </Resizable.Panel>

                {/*<Show*/}
                {/*  when={*/}
                {/*    editorUi.get.rightPanel !== 'none' &&*/}
                {/*    editorUi.get.rightPanel*/}
                {/*  }*/}
                {/*>*/}
                {/*  {rightPanel => (*/}
                {/*    <Resizable.Panel>*/}
                {/*      <Resizable.Handle*/}
                {/*        class={styles.resizableHandlerContainer}*/}
                {/*        aria-label="Resize Handle"*/}
                {/*      >*/}
                {/*        <div class={styles.resizableHandlers} />*/}
                {/*      </Resizable.Handle>*/}

                {/*      <LeftSidebar>*/}
                {/*        <Switch>*/}
                {/*          <Match when={rightPanel() === 'properties'}>*/}
                {/*            <JobPanelEditor />*/}
                {/*          </Match>*/}
                {/*        </Switch>*/}
                {/*      </LeftSidebar>*/}
                {/*    </Resizable.Panel>*/}
                {/*  )}*/}
                {/*</Show>*/}
              </>
            );
          }}
        </Resizable>
      </div>
      <EditorStatusBar />
    </div>
  );
}
