import {Icon} from '#ui/components/Icon';
import {IconButton} from '@codeui/kit';

export interface PanelPlusButtonProps {
  'aria-label': string;
  onClick: () => void;
}

export function PanelPlusButton(props: PanelPlusButtonProps) {
  return (
    <IconButton
      size={'xs'}
      variant={'ghost'}
      theme={'secondary'}
      aria-label={props['aria-label']}
      onClick={() => props.onClick()}
    >
      <Icon name={'add'} size={'sm'} />
    </IconButton>
  );
}
