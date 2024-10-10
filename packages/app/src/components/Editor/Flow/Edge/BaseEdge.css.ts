import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';

// stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default));
// stroke-width: var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));
// fill: none;
export const baseEdge = style({
  fill: 'none',
  stroke: themeVars.accent8,
  strokeWidth: 1,
  transform: 'translateZ(0)',
  pointerEvents: 'all',
  zIndex: 0,
});
