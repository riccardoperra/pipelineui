import Resizable from '@corvu/resizable';
import {For, lazy, Match, Show, Suspense, Switch, useContext} from 'solid-js';
import {provideState} from 'statebuilder';
import * as fallbackStyles from '~/ui/components/Fallback.css';
import {OverlayLoader} from '~/ui/components/Loader/Loader';
import {EditorStore} from '../../store/editor/editor.store';
import {EditorUiStore} from '../../store/editor/ui.store';
import {DiagnosticPanel} from './DiagnosticPanel/DiagnosticPanel';
import * as styles from './Editor.css';
import {EditorHeader} from './Header/Header';
import {EditorRepositoryHeaderName} from './Header/RepositoryHeaderName';
import {EditorRepositoryHeaderScratch} from './Header/RepositoryHeaderScratch';
import {JobPanelEditor} from './Jobs/JobPanelEditor/JobPanelEditor';
import {EditorResizableHandler} from './Layout/Resizable/Resizable';
import {EditorSidebar} from './LeftSidebar/EditorSidebar';
import {PropertiesPanelEditor} from './Properties/PropertiesPanelEditor';
import {EditorStatusBar} from './StatusBar/StatusBar';
import {YamlMergeView} from './YamlEditor/MergeView';
import {EditorContext} from './editor.context';

const YamlEditor = lazy(() =>
  import('./YamlEditor/YamlEditor').then(m => ({default: m.YamlEditor})),
);

const Canvas = lazy(() =>
  Promise.all([import('elkjs'), import('./Canvas/Canvas')]).then(([, m]) => m),
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
            fallback={<EditorRepositoryHeaderScratch />}
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
                                        <Suspense
                                          fallback={<YamlEditorFallback />}
                                        >
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
                                        </Suspense>
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

                          <Resizable.Panel
                            initialSize={0.58}
                            style={{position: 'relative'}}
                          >
                            <Suspense fallback={<OverlayLoader />}>
                              <Canvas />
                            </Suspense>
                          </Resizable.Panel>

                          <EditorResizableHandler
                            hidden={editorUi.get.rightPanel === 'none'}
                            position={'right'}
                          />

                          <Resizable.Panel
                            initialSize={0.17}
                            minSize={0.15}
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
                                    <Suspense>
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
                                    </Suspense>
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
                  <Suspense>
                    <DiagnosticPanel />
                  </Suspense>
                </Resizable.Panel>
              </>
            );
          }}
        </Resizable>
      </div>
      <Suspense>
        <EditorStatusBar />
      </Suspense>
    </div>
  );
}

function YamlEditorFallback() {
  const editor = useContext(EditorContext);
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
