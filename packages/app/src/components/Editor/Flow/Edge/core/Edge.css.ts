import {recipe} from '@vanilla-extract/recipes';
import {themeVars} from '@codeui/kit';

export const edge = recipe({
  base: {},
  variants: {
    selected: {
      true: {
        stroke: themeVars.brand,
        strokeWidth: 3,
        fill: 'transparent',
        zIndex: 50,
      },
      false: {
        pointerEvents: 'all',
        stroke: 'rgba(168,168,168,0.8)',
        strokeWidth: 2,
        fill: 'transparent',
        cursor: 'pointer',
      },
    },
  },
});
