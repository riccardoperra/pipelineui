import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

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
