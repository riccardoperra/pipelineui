import {icon, type IconVariants} from './Icon.css';
import {mergeClasses} from '../../../../../../codeui/packages/kit';

type IconName = 'plus' | 'delete' | 'close' | 'fit_screen';

export type IconProps = IconVariants & {
  name: IconName | (string & {});
};

export function Icon(props: IconProps) {
  return (
    <span
      class={mergeClasses(
        'material-symbols-rounded',
        icon({
          size: props.size,
        }),
      )}
    >
      {props.name}
    </span>
  );
}
