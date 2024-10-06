import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';

export const header = style({
  height: '48px',
  width: '100%',
  display: 'flex',
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['4'],
  alignItems: 'center',
  backgroundColor: themeVars.accent1,
});

export const subHeader = style({
  height: '32px',
  width: '100%',
  display: 'flex',
  paddingLeft: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],
  alignItems: 'center',
  backgroundColor: themeVars.accent2,
  borderBottom: `1px solid ${themeVars.accent6}`,
});

export const subHeaderRightContent = style({
  marginLeft: 'auto',
});

export const headerRightSide = style({
  marginLeft: 'auto',
  display: 'flex',
  gap: appTheme.spacing['2'],
});
