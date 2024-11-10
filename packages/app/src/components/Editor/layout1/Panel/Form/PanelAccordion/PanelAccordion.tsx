import {Accordion} from '@kobalte/core/accordion';
import {IconButton} from '@codeui/kit';
import {type FlowProps} from 'solid-js';
import * as styles from './PanelAccordion.css';
import {Icon} from '#ui/components/Icon';

export interface PanelAccordionItemProps {
  value: string;
  name: string;
  onDelete: () => void;
}

export function PanelAccordion(props: FlowProps) {
  return (
    <Accordion class={styles.panelAccordion} collapsible>
      {props.children}
    </Accordion>
  );
}

export function PanelAccordionItem(props: FlowProps<PanelAccordionItemProps>) {
  return (
    <Accordion.Item value={props.value} class={styles.panelAccordionItem}>
      <Accordion.Header class={styles.panelAccordionHeader}>
        <Accordion.Trigger class={styles.panelAccordionTrigger}>
          <Icon
            size={'sm'}
            name={'keyboard_arrow_down'}
            class={styles.panelAccordionTriggerIcon}
          />

          {props.name}
        </Accordion.Trigger>
        <IconButton
          size={'xs'}
          variant={'ghost'}
          theme={'secondary'}
          aria-label={'Delete'}
          onClick={e => {
            props.onDelete();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Icon size={'sm'} name={'close_small'} />
        </IconButton>
      </Accordion.Header>
      <Accordion.Content class={styles.panelAccordionContent}>
        <div class={styles.panelAccordionItemForm}>{props.children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
