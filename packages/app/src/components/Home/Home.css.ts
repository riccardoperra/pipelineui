import {createVar, style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';

const canvasPatternColor = createVar();

const size = 6;
const scale = 8;

export const homeLayoutWrapper = style({
  vars: {
    [canvasPatternColor]: themeVars.accent1,
  },
  width: '100%',
  height: '100vh',
  backgroundColor: '#0c0c0cba',
  '::before': {
    content: "''",
    vars: {
      '--line': '#a1a1a1',
      '--size': `${size * scale}px`,
    },
    height: '100%',
    width: '100%',
    position: 'fixed',
    background:
      'linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size), linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size)',
    WebkitMask: 'linear-gradient(-5deg, transparent 35%, white)',
    mask: 'linear-gradient(-5deg, transparent 35%, white)',
    top: '0',
    transformStyle: 'flat',
    pointerEvents: 'none',
    zIndex: '-1',
  },
});

export const homeContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: appTheme.spacing['16'],
  width: '100%',
  height: '100%',
});

export const choiceSeparator = style({
  display: 'flex',
  textAlign: 'center',
  color: themeVars.accent10,
  position: 'relative',
  height: '40px',
  gap: appTheme.spacing['4'],
  alignItems: 'center',
  flexShrink: 0,
  whiteSpace: 'nowrap',

  ':before': {
    content: '',
    height: '1px',
    backgroundColor: themeVars.accent6,
    width: '100%',
  },
  ':after': {
    content: '',
    height: '1px',
    backgroundColor: themeVars.accent6,
    width: '100%',
  },
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: appTheme.spacing['3'],
  maxWidth: '600px',
  paddingLeft: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],
});

export const errorBanner = style({
  padding: appTheme.spacing['4'],
  background: themeVars.critical,
  borderRadius: '12px',
});

export const form = style({
  width: '100%',
  display: 'flex',
});

export const loggedInBar = style({
  position: 'absolute',
  right: '16px',
  top: '16px',
});
