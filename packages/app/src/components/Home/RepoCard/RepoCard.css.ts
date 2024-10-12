import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '#ui/theme.css';

export const repoCard = style({
  background: themeVars.accent2,
  boxShadow: themeVars.dialogBoxShadow,
  borderRadius: '8px',

  border: '1px solid rgb(39 39 42)',
  padding: `${appTheme.spacing['6']} ${appTheme.spacing['6']}`,
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['4'],
  filter: 'drop-shadow(0 0 15px rgba(49,49,49,.35))',
});

export const repoCardInfoWrapper = style({
  display: 'flex',
  gap: appTheme.spacing['4'],
});

export const repoCardInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const repoCardDescription = style({
  color: themeVars.accent8,
});

export const repoCardStars = style({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  marginLeft: 'auto',
  placeSelf: 'flex-start',
  flexShrink: 0,
});

export const repoCardStarsIcon = style({
  color: '#fff341',
});

export const repoCardWorkflows = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const repoCardWorkflowItem = style({
  justifyContent: 'space-between',
  height: '36px',
  textDecoration: 'unset',
});
