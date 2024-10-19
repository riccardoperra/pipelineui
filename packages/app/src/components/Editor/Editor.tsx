import {EditorSidebar} from './LeftSidebar/EditorSidebar';
import * as styles from './Editor.css';
import {EditorHeader} from './Header/Header';
import {provideState} from 'statebuilder';
import {EditorUiStore} from './store/ui.store';
import {lazy, Match, Show, Suspense, Switch} from 'solid-js';
import {YamlEditor} from './YamlEditor/YamlEditor';
import {EditorStatusBar} from './StatusBar/StatusBar';
import Resizable from '@corvu/resizable';
import {EditorResizableHandler} from './Layout/Resizable/Resizable';
import {EditorStore} from './store/editor.store';
import {PropertiesPanelEditor} from './Properties/PropertiesPanelEditor';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import {YamlMergeView} from './YamlEditor/MergeView';
import {DiagnosticPanel} from './DiagnosticPanel/DiagnosticPanel';
import {headerRepoNavLi, headerRepoNavOl} from './Header/EditorHeader.css';
import {Link} from '@codeui/kit';
import {A, useParams} from '@solidjs/router';
import {Icon} from '#ui/components/Icon';
import {EditorRepositoryHeaderName} from './Header/RepositoryHeaderName';

const Canvas = lazy(() =>
  Promise.all([import('elkjs'), import('./Canvas/Canvas')]).then(([, m]) => ({
    default: m.Canvas,
  })),
);

export interface EditorProps {
  type?: 'scratch' | 'repository';
}

export function Editor(props: EditorProps) {
  const editorUi = provideState(EditorUiStore);
  const editor = provideState(EditorStore);

  return (
    <div class={styles.wrapper}>
      <EditorHeader
        showBack
        name={
          <Show
            fallback={<div>Scratch file</div>}
            when={props.type === 'repository'}
          >
            <EditorRepositoryHeaderName />
          </Show>
        }
      />
      <div class={styles.editor}>
        <Resizable
          sizes={editorUi.verticalSizes()}
          onSizesChange={editorUi.setVerticalSizes}
          orientation={'vertical'}
          class={styles.editorResizable}
        >
          {() => {
            const context = Resizable.useContext();
            editorUi.setVerticalResizableContext(context);

            return (
              <>
                <Resizable.Panel class={styles.resizablePanel}>
                  <Resizable
                    orientation={'horizontal'}
                    class={styles.editorResizable}
                    sizes={editorUi.horizontalSizes()}
                    onSizesChange={editorUi.setHorizontalSizes}
                  >
                    {() => {
                      const context = Resizable.useContext();
                      editorUi.setHorizontalResizableContext(context);
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
                                          code={editor.yamlSession.source()}
                                          setCode={() => {}}
                                          onMount={editor.setEditorView}
                                          onDiagnosticsChange={
                                            editor.actions.setDiagnostics
                                          }
                                        />
                                      </Match>
                                      <Match when={leftPanel() === 'merge'}>
                                        <YamlMergeView
                                          leftSource={editor.yamlSession.initialSource()}
                                          rightSource={editor.yamlSession.source()}
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
                            <Suspense>
                              <Canvas />
                            </Suspense>
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
                                      <Match
                                        when={rightPanel() === 'properties'}
                                      >
                                        <Show
                                          fallback={<PropertiesPanelEditor />}
                                          when={editor.selectedJob()}
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
                </Resizable.Panel>

                <EditorResizableHandler
                  hidden={editorUi.get.bottomPanel === 'none'}
                  position={'bottom'}
                />

                <Resizable.Panel
                  minSize={0.1}
                  collapsible
                  class={styles.resizablePanel}
                >
                  <DiagnosticPanel />
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
