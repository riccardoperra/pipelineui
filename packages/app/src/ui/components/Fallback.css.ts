import {keyframes, style} from '@vanilla-extract/css';

export const shimmer = keyframes({
  from: {
    backgroundPosition: '100%',
  },
  to: {
    backgroundPosition: '0%',
  },
});

export const fallback = style({
  color: 'transparent',
  boxDecorationBreak: 'clone',
  borderRadius: '6px',
  background: 'linear-gradient(to right, #3f3f3f 33%, #222, #3f3f3f 66%)',
  backgroundSize: '300%',
  animation: `${shimmer} 2s infinite ease-in-out`,
});
