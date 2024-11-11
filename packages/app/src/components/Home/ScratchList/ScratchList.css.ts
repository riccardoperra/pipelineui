import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {themeVars} from '@codeui/kit';

export const scratchList = style({
  display: 'flex',
  listStyleType: 'none',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
});

export const scratchListItem = style({
  display: 'flex',
  flexDirection: 'row',
  gap: `${appTheme.spacing['3']} !important`,
  alignItems: 'center',
  // TODO: fix style ordering!!!!
  height: '48px !important',
  paddingLeft: ` ${appTheme.spacing['4']} !important`,
  paddingRight: `${appTheme.spacing['2']} !important`,
  textDecoration: 'unset',
  background: `${themeVars.accent3} !important`,
  color: `${themeVars.accent10} !important`,
  position: 'relative',
});

export const scratchListItemLink = style({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  outline: 'none',
});

export const scratchListItemInfo = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const scratchListItemInfoName = style({
  fontSize: '14px',
  color: '#fff',
  lineHeight: `18px`,
});

export const scratchListItemInfoType = style({
  fontSize: '13px',
  color: themeVars.accent10,
  lineHeight: `14px`,
});

export const scratchListItemActions = style({
  marginLeft: 'auto',
});
