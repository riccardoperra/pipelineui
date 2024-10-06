import {createVar, fallbackVar, style} from '@vanilla-extract/css';
import {recipe, type RecipeVariants} from '@vanilla-extract/recipes';

import {} from '@codeui/kit';

export const iconFontSize = createVar();

export const icon = recipe({
  base: {
    fontSize: fallbackVar(iconFontSize, '24px'),
    fontWeight: 400,
  },

  variants: {
    size: {
      md: {
        vars: {
          [iconFontSize]: '22px',
        },
      },
      sm: {
        vars: {
          [iconFontSize]: '16px',
        },
      },
      xs: {
        vars: {
          [iconFontSize]: '14px',
        },
      },
    },
  },

  defaultVariants: {
    size: 'sm',
  },
});

export type IconVariants = RecipeVariants<typeof icon>;
