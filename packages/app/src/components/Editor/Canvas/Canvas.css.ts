import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';

export const canvasContainer = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
  minWidth: 0,
  backgroundImage: `radial-gradient(circle at 1px 1px, ${themeVars.accent4} 1px, ${themeVars.accent1} 0)`,
  backgroundSize: '15px 15px',
  padding: '2rem',
});
