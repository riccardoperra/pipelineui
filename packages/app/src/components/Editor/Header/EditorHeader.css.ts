import {style} from '@vanilla-extract/css';
import {themeVars, buttonStyles} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';
import {recipe} from '@vanilla-extract/recipes';

export const header = style({
  height: '48px',
  width: '100%',
  display: 'flex',
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['4'],
  alignItems: 'center',
  gap: appTheme.spacing['2'],
  backgroundColor: themeVars.accent1,
});

export const subHeader = style({
  height: '32px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: themeVars.accent2,
  borderBottom: `1px solid ${themeVars.accent6}`,
});

export const headerRepoNavContent = style({
  display: 'flex',
  gap: appTheme.spacing['2'],
});

export const headerRepoNavOl = style({
  listStyleType: 'none',
  display: 'flex',
  gap: appTheme.spacing['2'],
  alignItems: 'center',
  padding: 0,
});

export const headerRepoNavLi = style({
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: appTheme.spacing['1'],
  padding: 0,
});

export const subHeaderRightContent = style({
  marginLeft: 'auto',
});

export const headerRightSide = style({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: appTheme.spacing['2'],
});

export const subHeaderAction = recipe({
  base: {
    vars: {
      [buttonStyles.buttonVars.borderRadius]: '0px',
    },
  },
});
