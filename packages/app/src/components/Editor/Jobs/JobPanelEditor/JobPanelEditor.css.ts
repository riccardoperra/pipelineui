import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

export const nav = style({
  display: 'flex',
  gap: appTheme.spacing['2'],
  alignItems: 'center',
  color: 'white',
  height: '40px',
  backgroundColor: themeVars.accent2,
  paddingLeft: appTheme.spacing['3'],
  paddingRight: appTheme.spacing['3'],
  borderBottom: themeVars.separator,
});
