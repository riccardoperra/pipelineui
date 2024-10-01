import {createVar, style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {appTheme} from '../../../ui/theme.css';

const flowItemPadding = createVar();

export const flowItem = style({
  flex: 1,
  vars: {
    [flowItemPadding]: appTheme.spacing['4'],
  },
  backgroundColor: themeVars.accent4,
  width: '100%',
  borderRadius: '8px',
  padding: '12px',
  paddingBottom: '12px',
  minWidth: '200px',
  height: '128px',
  transition: 'background-color 0.2s ease-in-out',
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  selectors: {},
});
