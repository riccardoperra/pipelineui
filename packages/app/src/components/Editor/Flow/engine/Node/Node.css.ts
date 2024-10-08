import {createTheme, style} from '@vanilla-extract/css';

export const [theme, nodeVars] = createTheme({
  transformX: '',
  transformY: '',
});

export const baseNode = style([
  theme,
  {
    display: 'inline-block',
    position: 'absolute',
    transform: `translate3d(${nodeVars.transformX}, ${nodeVars.transformY}, 0)`,
  },
]);
