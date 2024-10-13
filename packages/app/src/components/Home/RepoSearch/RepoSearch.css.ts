import {style} from '@vanilla-extract/css';
import {buttonStyles, themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['4'],
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
