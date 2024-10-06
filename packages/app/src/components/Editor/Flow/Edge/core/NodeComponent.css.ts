import {style} from '@vanilla-extract/css';
import {themeVars} from '@codeui/kit';
import {recipe} from '@vanilla-extract/recipes';
import {appTheme} from '../../../../../ui/theme.css';

export const node = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  backgroundColor: themeVars.accent2,
  borderRadius: '6px',
  fontSize: '13px',
  paddingBottom: '12px',
  width: '250px',
  height: '80px',
  zIndex: 1,
  cursor: 'grab',
  userSelect: 'none',
  // overflow: 'hidden',
  // content: '',
  ':before': {
    content: '',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    left: 0,
    top: 0,
    border: '1px solid #30363d',
    transition: 'background-color 0.2s ease-in-out, border ease 0.2s',
  },
  selectors: {
    '&[data-selected]': {
      zIndex: 50,
    },
    '&[data-selected]:before': {
      border: `1px solid ${themeVars.brand}`,
    },
  },
});

// display: flex;
// flex-direction: column;
// position: absolute;
// cursor: grab;
// background-color: black;
// color: white;
// border: 1px solid #e6d4be;
// border-radius: 6px;
// box-shadow: 1px 1px 11px -6px rgba(0, 0, 0, 0.75);
// user-select: none;
// z-index: 1;
// transition: border ease 0.2s, box-shadow ease 0.2s;
