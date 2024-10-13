import {style} from '@vanilla-extract/css';
import {buttonStyles, themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';
import {recipe} from '@vanilla-extract/recipes';

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

export const leftSide = style({
  paddingLeft: appTheme.spacing['4'],
  display: 'flex',
  alignItems: 'center',
});

export const diagnosticCounterBar = style({
  display: 'flex',
  gap: appTheme.spacing['2'],
  alignItems: 'center',
});

export const diagnosticCounter = style({
  fontSize: '13px',
  display: 'inline-flex',
  gap: appTheme.spacing['1'],
  alignItems: 'center',
  lineHeight: 1,
});

export const statusBarAction = recipe({
  base: {
    vars: {
      [buttonStyles.buttonVars.borderRadius]: '0px',
    },
  },
});
