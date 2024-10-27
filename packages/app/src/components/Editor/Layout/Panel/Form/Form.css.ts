import {style} from '@vanilla-extract/css';
import {appTheme} from '#ui/theme.css';
import {recipe} from '@vanilla-extract/recipes';

// TODO: remove important, fix layer
export const inlineInputRoot = style({
  display: 'flex !important',
  alignItems: 'center !important',
  flexDirection: 'row !important',
  width: '100% !important',
  gap: `${appTheme.spacing['3']} !important`,
});

export const inlineInputLabel = style({
  flex: '1 0 85px !important',
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
