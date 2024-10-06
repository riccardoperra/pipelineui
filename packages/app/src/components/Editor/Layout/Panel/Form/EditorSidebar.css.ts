import {createTheme, style} from '@vanilla-extract/css';
import {recipe} from '@vanilla-extract/recipes';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

export const [sidebarTheme, sidebarVars] = createTheme({
  gap: appTheme.spacing['4'],
  panelTitleTextColor: '#fafafa',
  panelRowsTextColor: themeVars.accent9,
});

export const panelHeader = style([
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flexShrink: 0,
    width: '100%',
    fontWeight: 500,
    fontSize: '14px',
    color: '#fafafa',
  },
]);

export const panelContent = style([
  {
    paddingBottom: appTheme.spacing['4'],
  },
]);

export const panelHeaderRight = style({
  marginLeft: 'auto',
});

export const panelRow = style([
  {
    position: 'relative',
    display: 'grid',
    width: '100%',
    paddingTop: appTheme.spacing['1'],
    paddingBottom: appTheme.spacing['1'],
    columnGap: appTheme.spacing['2'],
    gridTemplateColumns: 'minmax(0,1.25fr) repeat(2,minmax(0,1fr))',
    gridTemplateRows: 'auto',
    color: sidebarVars.panelTitleTextColor,
  },
]);

export const panelRowContent = recipe({
  base: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: '1 0 0',
    // vars: {
    //   [fontSize]: themeVars.fontSize.xs,
    // },
  },
  variants: {
    twoColumn: {
      true: {
        gridColumn: '2 / -1',
      },
    },
    threeColumn: {
      true: {
        gridColumn: '1 / -1',
        paddingLeft: appTheme.spacing['3'],
      },
    },
  },
});

export const panelDivider = style({
  borderBottom: `1px solid ${themeVars.separator}`,
});
