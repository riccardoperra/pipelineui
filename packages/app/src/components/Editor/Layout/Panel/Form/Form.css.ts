import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';

export const inlineInputRoot = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
  gap: appTheme.spacing['3'],
});

export const inlineInputLabel = style({
  flex: '1 0 85px',
});

export const panelForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
  paddingLeft: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],
});

export const formStyles = {
  inlineInputLabel,
  inlineInputRoot,
};
