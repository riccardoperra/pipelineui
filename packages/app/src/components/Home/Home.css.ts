import {createVar, style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars, buttonStyles} from '@codeui/kit';

const canvasPatternColor = createVar();

export const homeLayoutWrapper = style({
  vars: {
    [canvasPatternColor]: themeVars.accent1,
  },
  width: '100%',
  height: '100vh',
  background: `linear-gradient(90deg,#8882 1px,transparent 0),linear-gradient(180deg,#8882 1px,transparent 0)`,
  backgroundColor: '#000',
  backgroundSize: '50px 50px',
});

export const homeContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: appTheme.spacing['16'],
  width: '100%',
  height: '100%',
});

export const mainTitleContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: appTheme.spacing['16'],
  marginBottom: appTheme.spacing['1'],
  padding: `${appTheme.spacing['4']} ${appTheme.spacing['8']}`,
});

export const mainTitle = style({
  fontSize: '34px',
  display: 'flex',
  alignItems: 'center',
  gap: appTheme.spacing['4'],
});

export const mainDescription = style({
  color: '#fafafa',
  textAlign: 'center',
});

export const mainDescriptionHighlight = style({
  color: themeVars.brand,
  textDecorationColor: themeVars.brand,
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

export const contentTitle = style({
  textAlign: 'center',
  color: themeVars.accent10,
});

export const submitRepoInputContainer = style({
  display: 'flex',
  height: '46px',
  position: 'relative',
});

export const submitRepoInputRoot = style({
  flex: 1,
});

export const submitRepoInput = style({
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});

export const submitRepoSubmitButton = style({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  width: '46px',
  vars: {
    [buttonStyles.buttonVars.buttonHeight]: '46px',
  },
});

export const resetRepoSubmitButton = style({
  position: 'absolute',
  right: '50px',
  top: '50%',
  transform: 'translateY(-50%)',
});
