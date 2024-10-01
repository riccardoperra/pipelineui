import {createTheme, style} from '@vanilla-extract/css';
import {recipe, RecipeVariants} from '@vanilla-extract/recipes';
import {themeVars} from '@codeui/kit';
import {} from '@codeui/kit';
import {appTheme} from '../../../ui/theme.css';

export const [sidebarTheme, sidebarVars] = createTheme({
  width: '260px',
  topOffset: '40px',
});

export const sidebar = recipe({
  base: style([
    sidebarTheme,
    {
      height: '100%',
      width: sidebarVars.width,
      backgroundColor: themeVars.accent2,
      color: themeVars.accent10,
      zIndex: 1,
      transition: 'background-color .2s, border .2s',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: appTheme.spacing['2'],
      '@supports': {
        '(scrollbar-gutter: stable)': {
          paddingRight: 0,
          scrollbarGutter: 'stable',
        },
      },
      flexShrink: 0,
    },
  ]),
  variants: {
    position: {
      none: {},
      right: {
        borderLeft: `1px solid ${themeVars.separator}`,
      },
      left: {
        borderRight: `1px solid ${themeVars.separator}`,
      },
    },
  },
});

export const sidebarLogo = style({
  display: 'flex',
  alignItems: 'center',
});

export type SidebarVariants = RecipeVariants<typeof sidebar>;
