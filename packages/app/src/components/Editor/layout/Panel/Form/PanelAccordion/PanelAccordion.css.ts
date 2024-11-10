import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

export const panelAccordionItemForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const panelAccordion = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
  counterReset: 'workflowDispatch',
});

export const panelAccordionItem = style({
  width: '100%',
  border: `1px solid ${themeVars.accent5}`,
  borderRadius: '8px',
  overflow: 'hidden',
});

export const panelAccordionHeader = style({
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

export const panelAccordionTrigger = style({
  border: 'none',
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  height: '36px',
  alignItems: 'center',
  gap: appTheme.spacing['2'],
  paddingLeft: appTheme.spacing['3'],
  background: `transparent`,
  color: themeVars.accent10,
});

export const panelAccordionTriggerIcon = style({
  lineHeight: 1,
  selectors: {
    '[data-expanded] > &': {
      transform: `rotate(180deg)`,
    },
  },
});

export const panelAccordionContent = style({
  border: 'none',
  background: `${themeVars.accent1}`,
  paddingTop: appTheme.spacing['2'],
  paddingBottom: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],

  overflow: 'hidden',
});
