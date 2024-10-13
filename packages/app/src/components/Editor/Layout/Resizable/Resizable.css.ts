import {style} from '@vanilla-extract/css';
import {recipe} from '@vanilla-extract/recipes';
import {themeVars} from '@codeui/kit';

export const resizablePanel = style({
  display: 'flex',
  overflow: 'hidden',
});

export const resizableHandlerContainer = recipe({
  base: {
    backgroundColor: 'transparent',
    width: '4px',
    padding: 0,
    flexBasis: '4px',
    border: 0,
    transition: 'background-color 150ms ease-in-out',
    // ':hover': {
    //   backgroundColor:q themeVars.brand,
    // },
  },
  variants: {
    hidden: {
      true: {
        display: 'none',
      },
    },
    position: {
      left: {
        // marginLeft: '-4px',
      },
      right: {
        // marginRight: '-4px',
      },
      bottom: {
        height: '4px',
        width: '100%',
      },
    },
  },
});

// size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100
export const resizableHandlers = style({
  height: '100%',
  width: '4px',
  selectors: {
    [`[data-active] &`]: {
      backgroundColor: themeVars.brandSecondary,
    },
    [`[data-dragging] &`]: {
      backgroundColor: themeVars.brand,
    },
  },
});
