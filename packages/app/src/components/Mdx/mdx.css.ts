import {themeVars} from '@codeui/kit';
import {globalStyle, style} from '@vanilla-extract/css';
import {appTheme} from '~/ui/theme.css';

export const p = style({
  marginTop: appTheme.spacing['4'],
  marginBottom: appTheme.spacing['4'],
});

export const h1 = style({
  color: themeVars.foreground,
  marginBottom: appTheme.spacing['6'],
});

export const h2 = style({
  color: themeVars.foreground,
  marginBottom: appTheme.spacing['3'],
});

export const h3 = style({
  color: themeVars.foreground,
  marginBottom: appTheme.spacing['2'],
});

export const h4 = style({
  color: themeVars.foreground,
  marginBottom: appTheme.spacing['2'],
});

export const h5 = style({
  color: themeVars.foreground,
});

export const a = style({
  textDecoration: 'unset',
  textUnderlineOffset: '4px',
  color: themeVars.brandLink,

  ':hover': {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },

  selectors: {
    ':is(h1,h2,h3,h4,h5,h6) &': {
      color: 'white',
    },

    '&[target=_blank]': {
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    },
    '&[target=_blank]::after': {
      content: 'open_in_new',
      fontFamily: 'Material Symbols Rounded',
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: 1,
      letterSpacing: 'normal',
      textTransform: 'none',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      direction: 'ltr',
      WebkitFontSmoothing: 'antialiased',
      fontFeatureSettings: '"liga"',
      verticalAlign: 'middle',
    },
  },
});

export const ul = style({
  paddingLeft: appTheme.spacing['6'],
  marginBottom: appTheme.spacing['4'],
});

export const li = style({});

export const hr = style({
  borderColor: themeVars.separator,
  marginTop: appTheme.spacing['4'],
  marginBottom: appTheme.spacing['4'],
});

export const tableContainer = style({
  borderRadius: '8px',
  border: `1px solid ${themeVars.separator}`,
  overflow: 'hidden',
  marginBottom: appTheme.spacing['4'],
});

export const table = style({
  borderCollapse: 'collapse',
  width: '100%',
});

export const th = style({
  textAlign: 'left',
  paddingLeft: appTheme.spacing['3'],
  paddingRight: appTheme.spacing['3'],
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  selectors: {
    'thead &': {
      boxShadow: `0 1px 0 0 ${themeVars.separator}`,
    },
  },
});

export const td = style({
  paddingLeft: appTheme.spacing['3'],
  paddingRight: appTheme.spacing['3'],
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  boxShadow: `0 1px 0 0 ${themeVars.separator}`,
  whiteSpace: 'nowrap',
});

export const tr = style({
  selectors: {
    'thead &': {
      background: themeVars.accent2,
    },
  },
});

export const blockquote = style({
  backgroundColor: themeVars.accent3,
  borderLeft: `6px solid ${themeVars.brandSecondary}`,
  paddingLeft: appTheme.spacing['4'],
  paddingRight: appTheme.spacing['4'],
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  borderRadius: '9px',
  marginBottom: appTheme.spacing['2'],

  selectors: {
    '&[data-type="info"]': {
      borderColor: themeVars.brand,
    },
    '&[data-type="warning"]': {
      borderColor: themeVars.caution,
    },
  },
});

export const blockquoteType = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: '18px',
  marginBottom: '8px',
  gap: appTheme.spacing['3'],
  fontWeight: 500,

  selectors: {
    [`${blockquote}[data-type="warning"] &`]: {
      color: themeVars.caution,
    },
    [`${blockquote}[data-type="info"] &`]: {
      color: themeVars.brandLink,
    },
    'p &': {},
  },
});

globalStyle(`${blockquote} p`, {
  marginBottom: appTheme.spacing['2'],
});
