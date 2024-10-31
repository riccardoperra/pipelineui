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
  background: `linear-gradient(90deg,#8882 1px,transparent 0),linear-gradient(180deg,#8882 1px,transparent 0)`,
  backgroundColor: '#0c0c0cba',
  backgroundSize: `${size * scale}px ${size * scale}px`,
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
  width: '600px',
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
