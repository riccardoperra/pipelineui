import {createGlobalTheme} from '@vanilla-extract/css';
import {spacing} from './spacing';

export const appTheme = createGlobalTheme(':root', {
  spacing,
});
