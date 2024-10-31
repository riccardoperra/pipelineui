import {style} from '@vanilla-extract/css';

export const badge = style({
  width: '32px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '14px !important',
  background: '#076a6e',
  color: 'white',
  borderRadius: '9999px',
});

export const currentUser = style({
  fontSize: '14px',
});
