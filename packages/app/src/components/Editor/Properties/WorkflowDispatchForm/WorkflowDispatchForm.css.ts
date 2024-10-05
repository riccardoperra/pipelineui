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
  counterReset: 'workflowDispatch',
});

export const workflowDispatchItem = style({
  width: '100%',
  border: `1px solid ${themeVars.accent5}`,
  borderRadius: '8px',
  overflow: 'hidden',
});

export const workflowDispatchHeader = style({
  fontSize: '14px',
  display: 'flex',
  height: '36px',
  alignItems: 'center',
  flexDirection: 'row',
  background: `${themeVars.accent2}`,
  color: themeVars.accent10,
  position: 'relative',
  textAlign: 'left',
  ':hover': {
    background: `${themeVars.accent5}`,
  },
});

export const workflowDispatchTrigger = style({
  border: 'none',
  width: '100%',
  textAlign: 'left',
  paddingLeft: appTheme.spacing['3'],
  background: `transparent`,
  color: themeVars.accent10,
});

export const workflowDispatchContent = style({
  border: 'none',
  background: `${themeVars.accent1}`,
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],

  overflow: 'hidden',
});
