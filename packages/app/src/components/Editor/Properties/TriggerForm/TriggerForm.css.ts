import { dropdownMenuStyles } from '@codeui/kit';
import { style } from '@vanilla-extract/css';

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
