import {style} from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const editor = style({
  display: 'flex',
  width: '100%',
  minHeight: 0,
  flex: 1,
});

export const canvas = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  minWidth: 0,
});
