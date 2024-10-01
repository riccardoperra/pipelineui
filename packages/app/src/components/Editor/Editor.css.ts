import {style} from '@vanilla-extract/css';

export const editor = style({
  display: 'flex',
  width: '100%',
  height: '100%',
});

export const canvas = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  minWidth: 0,
});
