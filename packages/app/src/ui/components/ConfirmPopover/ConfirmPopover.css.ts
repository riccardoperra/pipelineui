import {style} from '@vanilla-extract/css';
import {appTheme} from '../../theme.css';

export const contentFooter = style({
  display: 'flex',
  gap: appTheme.spacing['2'],
  flexWrap: 'wrap',
  marginTop: appTheme.spacing['3'],
});
