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
  flex: '1 !important',
});

// TODO: fix style order in prod build

export const submitRepoInput = style({
  borderTopRightRadius: '0 !important',
  borderBottomRightRadius: '0 !important',
});

export const submitRepoSubmitButton = style({
  borderTopLeftRadius: '0 !important',
  borderBottomLeftRadius: '0 !important',
  width: '46px !important',
  height: '46px !important',
});

export const resetRepoSubmitButton = style({
  // @ts-expect-error Remove important
  position: 'absolute !important',
  right: '50px !important',
  top: '50% !important',
  transform: 'translateY(-50%) !important',
});
