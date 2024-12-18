import {createVar, style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '~/ui/theme.css';

const flowItemPadding = createVar();

export const flowItem = style({
  vars: {
    [flowItemPadding]: appTheme.spacing['4'],
  },
  backgroundColor: themeVars.accent2,
  borderRadius: '6px',
  fontSize: '13px',
  paddingBottom: '12px',
  width: '250px',
  height: '80px',
  transition: 'background-color 0.2s ease-in-out',
  position: 'relative',
  display: 'inline-flex',
  gap: appTheme.spacing['2'],
  flexDirection: 'column',
  overflow: 'hidden',
  content: '',
  ':before': {
    content: '',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    left: 0,
    top: 0,
    border: `1px solid ${themeVars.accent5}`,
    transition: 'background-color 0.2s ease-in-out, border ease 0.2s',
  },
  selectors: {
    '&[data-selected]': {
      zIndex: 50,
    },
    '&[data-selected]:before': {
      border: `1px solid ${themeVars.brand}`,
    },
  },
});

export const flowItemHeader = style({
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  color: '#fafafa',
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['4'],
  background: themeVars.accent4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  // borderBottom: `1px solid hsla(0,0%,100%,.14)`,
});

export const flowItemContent = style({
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['4'],
});
