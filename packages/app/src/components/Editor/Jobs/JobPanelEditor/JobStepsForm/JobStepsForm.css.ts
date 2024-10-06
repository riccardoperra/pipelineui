import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  width: '100%',
  border: `1px solid ${themeVars.accent3}`,
  backgroundColor: themeVars.accent3,
  color: themeVars.accent10,
});
