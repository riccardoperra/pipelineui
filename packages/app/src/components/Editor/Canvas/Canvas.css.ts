import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';

export const canvasContainer = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
  minWidth: 0,
  backgroundImage: `radial-gradient(circle at 1px 1px, ${themeVars.accent3} 1px, ${themeVars.background} 0)`,
  backgroundSize: '20px 20px',
  padding: '2rem',
});
