import {rightSide, statusBar} from './EditorStatusBar.css';
import {provideState} from 'statebuilder';
import {CanvasStore} from '../store/canvas.store';
import {IconButton} from '@codeui/kit';

export function EditorStatusBar() {
  const canvasState = provideState(CanvasStore);

  const size = () => Math.floor(canvasState.get.scale * 100);

  return (
    <div class={statusBar}>
      <div class={rightSide}>
        <IconButton
          size={'xs'}
          theme={'secondary'}
          variant={'ghost'}
          aria-label={'Fit'}
          onClick={() => canvasState.fitToCenter()}
        >
          F
        </IconButton>
        {size()}%
      </div>
    </div>
  );
}
