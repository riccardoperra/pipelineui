import {createVar, style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '../../../ui/theme.css';

const flowItemPadding = createVar();

export const flowItem = style({
  vars: {
    [flowItemPadding]: appTheme.spacing['4'],
  },
  backgroundColor: themeVars.accent3,
  borderRadius: '4px',
  padding: '12px',
  fontSize: '13px',
  paddingBottom: '12px',
  width: '250px',
  height: '80px',
  transition: 'background-color 0.2s ease-in-out',
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  selectors: {},

  ':before': {
    boxShadow:
      'rgba(21, 21, 29, 0.12) 0px 1px 0px, rgba(21, 21, 29, 0.08) 0px 1px 3px, rgba(0, 0, 0, 0.08) 0px 2px 4px, rgba(0, 0, 0, 0.05) 0px 4px 8px',
  },
});
