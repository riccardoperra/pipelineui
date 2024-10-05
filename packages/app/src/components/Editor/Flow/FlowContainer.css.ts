import {style} from '@vanilla-extract/css';

export const flowContainer = style({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
});

export const flowCanvas = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '16px',
});
