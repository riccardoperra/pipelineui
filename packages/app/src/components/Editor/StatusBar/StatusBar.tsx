import {
  diagnosticCounter,
  diagnosticCounterBar,
  leftSide,
  rightSide,
  statusBar,
  statusBarAction,
} from './EditorStatusBar.css';
import {provideState} from 'statebuilder';
import {CanvasStore} from '../../../store/editor/canvas.store';
import {Button, IconButton, Tooltip} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';
import {EditorStore} from '~/store/editor/editor.store';
import {EditorUiStore} from '~/store/editor/ui.store';
import {createEffect} from 'solid-js';

export function EditorStatusBar() {
  const canvasState = provideState(CanvasStore);
  const editorUiStore = provideState(EditorUiStore);
  const editorStore = provideState(EditorStore);

  const size = () => Math.floor(canvasState.get.scale * 100);

  const errors = () =>
    editorStore.get.diagnostics.filter(
      diagnostic =>
        diagnostic.severity === 1 || diagnostic.severity === undefined,
    ).length;

  const warnings = () =>
    editorStore.get.diagnostics.filter(diagnostic => diagnostic.severity === 2)
      .length;

  return (
    <div class={statusBar}>
      <div class={leftSide}>
        <div class={diagnosticCounterBar}>
          <Tooltip
            theme={'secondary'}
            content={`Errors: ${errors()}, Warnings: ${warnings()}`}
          >
            <Button
              class={statusBarAction()}
              size={'xs'}
              theme={'secondary'}
              variant={
                editorUiStore.get.bottomPanel === 'diagnostic'
                  ? undefined
                  : 'ghost'
              }
              onClick={() =>
                editorUiStore.actions.toggleBottomPanel('diagnostic')
              }
            >
              <span class={diagnosticCounter}>
                <Icon name={'error'} />
                {errors()}
              </span>
              <span class={diagnosticCounter}>
                <Icon name={'warning'} />
                {warnings()}
              </span>
            </Button>
          </Tooltip>
        </div>
      </div>

      <div class={rightSide}>
        <Tooltip theme={'secondary'} content={'Fit to screen'}>
          <IconButton
            size={'xs'}
            theme={'secondary'}
            variant={'ghost'}
            aria-label={'Fit'}
            onClick={() => canvasState.fitToCenter()}
          >
            <Icon name={'fit_screen'} />
          </IconButton>
        </Tooltip>
        {size()}%
      </div>
    </div>
  );
}
