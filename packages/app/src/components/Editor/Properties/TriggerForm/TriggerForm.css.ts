import {dropdownMenuStyles, themeVars} from '@codeui/kit';
import {style} from '@vanilla-extract/css';
import {appTheme} from '~/ui/theme.css';

export const dropdown = style([
  {
    vars: {
      [dropdownMenuStyles.dropdownMenuThemeVars.itemMinHeight]:
        '30px !important',
      [dropdownMenuStyles.dropdownMenuThemeVars.itemPadding]:
        '0 8px !important',
    },
    fontSize: '14px',
    maxHeight: '250px',
    overflow: 'auto !important',
  },
]);

export const textFieldWithAdd = style({
  display: 'flex',
  width: '100%',
});

export const addButton = style({
  alignSelf: 'flex-end',
  paddingLeft: '4px',
});

export const listContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
  listStyleType: 'unset',
  padding: 0,
  paddingLeft: appTheme.spacing['3'],
  paddingRight: appTheme.spacing['3'],
});
// TODO: this is the fourth time i write this.
export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  width: '100%',
  border: `1px solid ${themeVars.accent3}`,
  color: themeVars.accent10,
  justifyContent: 'space-between',
  paddingLeft: appTheme.spacing['2'],
  background: themeVars.accent4,
  borderRadius: '6px',
});

export const listItemName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const listItemActions = style({
  flexShrink: 0,
});
