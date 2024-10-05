import {style} from '@vanilla-extract/css';
import {recipe} from '@vanilla-extract/recipes';
import {themeVars} from '@codeui/kit';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
});

export const editor = style({
  display: 'flex',
  width: '100%',
  minHeight: 0,
  flex: 1,
});

export const editorResizable = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
});

export const canvas = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  minWidth: 0,
});

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
  },
});