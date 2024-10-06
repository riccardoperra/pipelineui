import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {recipe} from '@vanilla-extract/recipes';

export const inlineInputRoot = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
  gap: appTheme.spacing['3'],
});

export const inlineInputLabel = style({
  flex: '1 0 85px',
});

export const panelForm = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: appTheme.spacing['2'],
    paddingLeft: appTheme.spacing['2'],
    paddingRight: appTheme.spacing['2'],
  },
  variants: {
    noGap: {
      true: {
        gap: 0,
      },
    },
  },
});

export const formStyles = {
  inlineInputLabel,
  inlineInputRoot,
};
