import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '../../../ui/theme.css';

export const statusBar = style({
  height: '32px',
  backgroundColor: themeVars.accent3,
  borderTop: `1px solid ${themeVars.accent6}`,
  display: 'flex',
});

export const rightSide = style({
  marginLeft: 'auto',
  marginRight: appTheme.spacing['4'],
});
