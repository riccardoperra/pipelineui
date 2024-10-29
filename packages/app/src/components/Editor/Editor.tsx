import {EditorSidebar} from './LeftSidebar/EditorSidebar';
import * as styles from './Editor.css';
import * as fallbackStyles from '~/ui/components/Fallback.css';
import {EditorHeader} from './Header/Header';
import {provideState} from 'statebuilder';
import {EditorUiStore} from './store/ui.store';
import {
  createEffect,
  For,
  lazy,
  Match,
  Show,
  Suspense,
  Switch,
  useContext,
} from 'solid-js';
import {YamlEditor} from './YamlEditor/YamlEditor';
import {EditorStatusBar} from './StatusBar/StatusBar';
import Resizable from '@corvu/resizable';
import {EditorResizableHandler} from './Layout/Resizable/Resizable';
import {EditorStore} from './store/editor.store';
import {PropertiesPanelEditor} from './Properties/PropertiesPanelEditor';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import {YamlMergeView} from './YamlEditor/MergeView';
import {DiagnosticPanel} from './DiagnosticPanel/DiagnosticPanel';
import {EditorRepositoryHeaderName} from './Header/RepositoryHeaderName';
import {EditorContext} from './editor.context';

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
                <Resizable.Panel class={styles.resizablePanel} initialSize={1}>
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
                                        <Show
                                          fallback={<YamlEditorFallback />}
                                          when={editor.initialized()}
                                        >
                                          <YamlEditor
                                            code={editor.yamlSession.source()}
                                            setCode={() => {}}
                                            onMount={editor.setEditorView}
                                            onDiagnosticsChange={
                                              editor.actions.setDiagnostics
                                            }
                                          />
                                        </Show>
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
                  initialSize={0}
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

function YamlEditorFallback() {
  const editor = useContext(EditorContext);

  createEffect(() => console.log(editor?.source.split('\n')));
  return (
    <div
      style={{
        'margin-top': '12px',
        display: 'flex',
        'flex-direction': 'column',
        gap: '4px',
      }}
    >
      <For each={editor?.source.split('\n')}>
        {(row, index) => {
          const match = row.match(/^(\s*)(\S.*)/)!;
          const leadingWhitespace = match ? match[1] : row;
          const text = match ? match[2] : null;

          return (
            <div
              style={{display: 'flex', 'flex-wrap': 'nowrap', height: '16px'}}
            >
              <span
                class={fallbackStyles.fallback}
                style={{
                  'margin-left': '24px',
                  'margin-right': '16px',
                  'font-size': '13.5px',
                  'line-height': '14px',
                }}
              >
                {String(index() + 1).padStart(3, '0')}
              </span>
              <span
                style={{
                  'font-size': '13.5px',
                  'line-height': '17px',
                  'white-space': 'pre-wrap',
                }}
              >
                {leadingWhitespace}
              </span>
              <span
                style={{
                  'font-size': '13.5px',
                  'line-height': '17px',
                  'white-space': 'nowrap',
                }}
                class={fallbackStyles.fallback}
              >
                {text || leadingWhitespace}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
}
