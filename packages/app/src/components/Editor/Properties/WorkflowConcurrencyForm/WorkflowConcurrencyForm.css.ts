import {style} from '@vanilla-extract/css';
import {appTheme} from '../../../../ui/theme.css';
import {themeVars} from '../../../../../../../../codeui/packages/kit';

export const workflowDispatchItemForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const workflowDispatchList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const workflowDispatchItem = style({
  width: '100%',
  border: `1px solid ${themeVars.accent5}`,
  borderRadius: '8px',
  overflow: 'hidden',
});

export const workflowDispatchHeader = style({
  fontSize: '14px',
});

export const workflowDispatchTrigger = style({
  border: 'none',
  width: '100%',
  height: '36px',
  background: `${themeVars.accent2}`,
  color: themeVars.accent10,
  ':hover': {
    background: `${themeVars.accent5}`,
  },
});

export const workflowDispatchContent = style({
  border: 'none',
  background: `${themeVars.accent1}`,
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],

  overflow: 'hidden',
});
