import {style} from '@vanilla-extract/css';
import {appTheme} from '../../../../ui/theme.css';

export const jobPanelEditor = style({
  display: 'flex',
  flexDirection: 'column',
  gap: appTheme.spacing['2'],
  paddingLeft: appTheme.spacing['2'],
  paddingRight: appTheme.spacing['2'],
});
