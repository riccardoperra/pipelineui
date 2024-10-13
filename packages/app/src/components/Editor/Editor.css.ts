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
  position: 'relative',
});

export const editorResizable = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  zIndex: 0,
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
