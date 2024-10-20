import {createSignal, type FlowProps, JSX} from 'solid-js';
import {Button, Popover, PopoverContent, PopoverTrigger} from '@codeui/kit';
import {contentFooter} from './ConfirmPopover.css';

interface ConfirmPopoverProps {
  description: JSX.Element;
  actionType?: 'destructive';
  confirmLabel?: string;
  onConfirm: () => void;
}

export function ConfirmPopover(props: FlowProps<ConfirmPopoverProps>) {
  const [open, setOpen] = createSignal(false);
  return (
    <Popover open={open()} onOpenChange={setOpen}>
      {props.children}

      <PopoverContent>
        {props.description}

        <div class={contentFooter}>
          <Button
            size={'xs'}
            theme={props.actionType === 'destructive' ? 'negative' : 'primary'}
            onClick={() => props.onConfirm()}
          >
            {props.confirmLabel ?? 'Confirm'}
          </Button>

          <Button
            size={'xs'}
            theme={'secondary'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
