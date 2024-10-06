import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';

export const environmentControlForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['4'],
  width: '240px',
});

export const environmentControlInput = style({
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  cursor: 'pointer',
});

export const environmentControlInputValue = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
