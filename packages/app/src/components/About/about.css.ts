import {themeVars} from '@codeui/kit';
import {globalStyle, style} from '@vanilla-extract/css';
import {appTheme} from '~/ui/theme.css';
import * as mdxStyles from '~/components/Mdx/mdx.css';

export const aboutContainer = style({
  fontSize: '16px',
  maxWidth: '700px',
  margin: `0 auto ${appTheme.spacing['4']}`,
});

export const aboutBreadcrumb = style({
  display: 'flex',
  listStyleType: 'none',
  padding: 0,
  marginBottom: appTheme.spacing['4'],
});

export const aboutBreadcrumbItem = style({
  selectors: {
    '&:not(:last-child)::after': {
      display: 'inline-block',
      content: '/',
      color: '#fff',
      paddingLeft: appTheme.spacing['2'],
      paddingRight: appTheme.spacing['2'],
    },
  },
});

export const aboutBreadcrumbItemLink = style({
  color: themeVars.brandLink,
  textDecoration: 'unset',
  verticalAlign: 'middle',
  display: 'inline-flex',
  alignItems: 'center',

  selectors: {
    [`${aboutBreadcrumbItem}:last-child:not(:first-child) &`]: {
      color: '#fafafa',
    },
  },
});

globalStyle(`${mdxStyles.table} tr td:first-child`, {
  width: '80%',
});

globalStyle(`${mdxStyles.table} tr :is(td,th):last-child`, {
  textAlign: 'center',
});
