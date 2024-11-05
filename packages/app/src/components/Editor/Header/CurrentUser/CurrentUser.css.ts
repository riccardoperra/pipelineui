import {style} from '@vanilla-extract/css';

export const badge = style({
  width: '28px',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '13px !important',
  background: '#076a6e',
  color: 'white',
  borderRadius: '9999px',
});

export const currentUser = style({
  fontSize: '14px !important',
});
