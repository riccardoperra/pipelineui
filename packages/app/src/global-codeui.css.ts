import {globalStyle, globalFontFace} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';

import gabaritoFont from './ui/Gabarito-VariableFont_wght.ttf';

globalFontFace('Gabarito', {
  src: `url(${gabaritoFont})`,
  fontDisplay: 'swap',
});

globalStyle('[data-cui-theme=dark] html, body', {
  background: themeVars.accent1,
  color: themeVars.foreground,
  fontFamily: '"Gabarito", "system-ui", "Arial"',
});

globalStyle('::-webkit-scrollbar', {
  width: '18px',
  height: '18px',
});

globalStyle('::-webkit-scrollbar-track', {
  backgroundColor: 'transparent',
});

globalStyle('::-webkit-scrollbar-corner', {
  backgroundColor: '#505050',
  borderRadius: '16px',
  backgroundClip: 'content-box',
  border: '4px solid transparent',
});

globalStyle('::-webkit-scrollbar-thumb', {
  backgroundColor: '#505050',
  borderRadius: '9999px',
  border: '6px solid transparent',
  backgroundClip: 'content-box',
  transition: 'background-color .2s',
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
  backgroundColor: '#333333',
});
