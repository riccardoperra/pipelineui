import {rightSide, statusBar} from './EditorStatusBar.css';
import {provideState} from 'statebuilder';
import {CanvasStore} from '../store/canvas.store';
import {IconButton, Tooltip} from '@codeui/kit';
import {Icon} from '#ui/components/Icon';

export function EditorStatusBar() {
  const canvasState = provideState(CanvasStore);

  const size = () => Math.floor(canvasState.get.scale * 100);

  return (
    <div class={statusBar}>
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
