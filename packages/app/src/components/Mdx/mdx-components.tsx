import {A} from '@solidjs/router';
import {
  Match,
  type ParentProps,
  Show,
  Switch,
  children,
  splitProps,
} from 'solid-js';
// import {A} from '~/ui/i18n-anchor';
import {isServer} from 'solid-js/web';
// import {Callout, CalloutProps} from '~/ui/callout';

import * as styles from './mdx.css';
import {Icon} from '~/ui/components/Icon';

export default {
  strong: (props: ParentProps) => <b class="font-semibold">{props.children}</b>,
  //   Callout: (props: CalloutProps) => (
  //     <Callout title={props.title} type={props.type}>
  //       {props.children}
  //     </Callout>
  //   ),
  ssr: (props: ParentProps) => <>{props.children}</>,
  spa: () => <></>,
  h1: (props: ParentProps) => (
    <h1 {...props} class={styles.h1}>
      {props.children}
    </h1>
  ),
  h2: (props: ParentProps) => {
    return (
      <>
        <hr class={styles.hr} />
        <h2 {...props} class={styles.h2}>
          {props.children}
        </h2>
      </>
    );
  },
  h3: (props: ParentProps) => {
    return (
      <h3 {...props} class={styles.h3}>
        {props.children}
      </h3>
    );
  },
  h4: (props: ParentProps) => {
    return (
      <h4 {...props} class={styles.h4}>
        {props.children}
      </h4>
    );
  },
  h5: (props: ParentProps) => {
    return (
      <h5 {...props} class={styles.h5}>
        {props.children}
      </h5>
    );
  },
  a: (props: ParentProps & {href: string}) => {
    const [, rest] = splitProps(props, ['children']);
    const resolved = children(() => props.children);
    const isBlank = props.href.startsWith('https');
    return (
      <A class={styles.a} {...rest} target={isBlank ? '_blank' : undefined}>
        {resolved()}
      </A>
    );
  },
  p: (props: ParentProps) => (
    <p {...props} class={styles.p}>
      {props.children}
    </p>
  ),
  li: (props: ParentProps) => (
    <li {...props} class={styles.li}>
      {props.children}
    </li>
  ),
  ul: (props: ParentProps) => (
    <ul {...props} class={styles.ul}>
      {props.children}
    </ul>
  ),
  nav: (props: ParentProps) => <nav {...props}>{props.children}</nav>,
  table: (props: ParentProps) => (
    <div class={styles.tableContainer}>
      <table class={styles.table}>{props.children}</table>
    </div>
  ),
  blockquote: (props: ParentProps<{type: string}>) => {
    const [local, others] = splitProps(props, ['type', 'children']);
    return (
      <blockquote class={styles.blockquote} {...others} data-type={local.type}>
        <Switch>
          <Match when={local.type === 'warning'}>
            <span class={styles.blockquoteType}>
              <Icon size={'md'} name={'warning'}></Icon>
              Warning
            </span>
          </Match>
          <Match when={local.type === 'info'}>
            <span class={styles.blockquoteType}>
              <Icon size={'md'} name={'info'}></Icon>
              Info
            </span>
          </Match>
        </Switch>
        {local.children}
      </blockquote>
    );
  },
  th: (props: ParentProps) => <th class={styles.th}>{props.children}</th>,
  thead: (props: ParentProps) => <thead>{props.children}</thead>,
  td: (props: ParentProps) => <td class={styles.td}>{props.children}</td>,
  tr: (props: ParentProps) => <tr class={styles.tr}>{props.children}</tr>,
  hr: (props: ParentProps) => {
    return <hr {...props} class={styles.hr} />;
  },
  response: (props: ParentProps) => {
    return <span>{props.children}</span>;
  },
  void: (props: ParentProps) => {
    return <span>{props.children}</span>;
  },
  unknown: (props: ParentProps) => {
    return <span>{props.children}</span>;
  },
};
