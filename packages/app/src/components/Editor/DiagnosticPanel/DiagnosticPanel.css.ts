import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

export const panel = style({
  borderTop: `1px solid ${themeVars.separator}`,
  background: themeVars.accent3,
  overflow: 'auto',
  width: '100%',
});

export const diagnosticList = style({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: appTheme.spacing['1'],
});

export const diagnosticListItem = style({
  width: '100%',
  height: '26px',
  fontSize: '13.5px',
  alignItems: 'center',
  color: themeVars.foreground,
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['2'],
  display: 'flex',
  gap: appTheme.spacing['2'],
  userSelect: 'none',
  appearance: 'none',
  background: 'transparent',
  border: 0,
  transition: 'background 150ms ease-in-out',

  ':hover': {
    background: themeVars.brandSecondaryAccentHover,
  },

  ':active': {
    background: themeVars.brandSoftAccentActive,
  },
});

export const diagnosticIcon = style({
  selectors: {
    '&[data-severity="error"]': {
      color: themeVars.critical,
    },
    '&[data-severity="warning"]': {
      color: themeVars.caution,
    },
    '&[data-severity="info"]': {
      color: themeVars.brand,
    },
    '&[data-severity="help"]': {
      color: themeVars.accent9,
    },
  },
});
