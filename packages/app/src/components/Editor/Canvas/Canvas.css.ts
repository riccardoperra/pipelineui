import {createVar, style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';

const canvasPatternColor = createVar();

export const canvasContainer = style({
  vars: {
    [canvasPatternColor]: themeVars.accent1,
  },
  display: 'flex',
  flex: 1,
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
  minWidth: 0,
  padding: '2rem',
  position: 'relative',
  overflow: 'auto',
  background: `repeating-linear-gradient(90deg, ${canvasPatternColor} 0, ${canvasPatternColor} 5%, transparent 0, transparent 50%), repeating-linear-gradient(180deg, ${canvasPatternColor} 0, ${canvasPatternColor} 5%, transparent 0, transparent 50%)`,
  backgroundColor: '#000',
  backgroundSize: '36px 36px',
});

export const canvasSvg = style({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
});
