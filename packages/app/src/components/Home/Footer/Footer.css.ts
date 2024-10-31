import {themeVars} from '@codeui/kit';
import {style} from '@vanilla-extract/css';
import {appTheme} from '~/ui/theme.css';

export const footer = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingRight: appTheme.spacing['4'],
  paddingBottom: appTheme.spacing['1'],
  marginTop: appTheme.spacing['1'],
  position: 'relative',
  paddingTop: appTheme.spacing['1'],
});

export const footerContent = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: appTheme.spacing['3'],
});

export const footerLinks = style({
  display: 'flex',
  gap: appTheme.spacing['8'],
});

export const footerLink = style({
  color: 'white',
  textDecoration: 'unset',
  paddingBottom: '1px',
  borderBottom: '1px solid transparent',
  ':hover': {
    color: themeVars.brand,
    borderColor: themeVars.brand,
  },
});
