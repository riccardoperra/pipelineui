import {createTheme, style} from '@vanilla-extract/css';
import {recipe, RecipeVariants} from '@vanilla-extract/recipes';
import {themeVars} from '@codeui/kit';
import {} from '@codeui/kit';
import {appTheme} from '../../../ui/theme.css';

export const [sidebarTheme, sidebarVars] = createTheme({
  width: '100%',
  topOffset: '40px',
});

export const sidebarWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
});

export const sidebar = recipe({
  base: style([
    sidebarTheme,
    {
      height: '100%',
      width: sidebarVars.width,
      backgroundColor: themeVars.accent1,
      color: themeVars.accent10,
      zIndex: 1,
      transition: 'background-color .2s, border .2s',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: appTheme.spacing['2'],
      '@supports': {
        // '(scrollbar-gutter: stable)': {
        // paddingRight: 0,
        // scrollbarGutter: 'stable',
        // },
      },
      flexShrink: 0,
    },
  ]),
  variants: {
    position: {
      none: {},
      right: {
        borderLeft: `1px solid ${themeVars.separator}`,
        paddingRight: 0,
      },
      left: {
        borderRight: `1px solid ${themeVars.separator}`,
        paddingRight: 0,
      },
    },
  },
});

export const sidebarResizeControl = style({
  width: '10px',
  height: '100%',
  backgroundColor: 'red',
  cursor: 'col-resize',
});

export const sidebarLogo = style({
  display: 'flex',
  alignItems: 'center',
});

export type SidebarVariants = RecipeVariants<typeof sidebar>;
