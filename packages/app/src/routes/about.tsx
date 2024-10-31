import {
  A,
  RouteMatch,
  RouteSectionProps,
  useCurrentMatches,
} from '@solidjs/router';
import * as styles from '~/components/About/about.css';
import mdxComponents from '~/components/Mdx/mdx-components';

import {createMemo, For, Show, Suspense} from 'solid-js';
import {MDXProvider} from 'solid-mdx';
import {HomeTitle} from '~/components/Home/HomeTitle/HomeTitle';
import {Icon} from '~/ui/components/Icon';
import {Title} from '@solidjs/meta';

const config = {
  '/about': {
    title: 'About',
  },
  '/about/supported-workflow-features': {
    title: 'Supported Workflow features',
  },
} as Record<string, {title: string}>;

export default function AboutLayout(props: RouteSectionProps) {
  const matches = useCurrentMatches();
  const breadcrumbs = createMemo(() =>
    matches().reduce(
      (acc, m) => {
        const entryConfig = config[m.path];
        if (acc.find(item => item.route.path === m.path)) {
          return acc;
        }
        if (!entryConfig) {
          throw new Error('Cannot build route tree');
        }
        return [
          ...acc,
          {
            route: m,
            config: entryConfig,
          },
        ];
      },
      [] as {route: RouteMatch; config: {title: string}}[],
    ),
  );

  return (
    <Suspense>
      <MDXProvider components={mdxComponents}>
        <Title>{breadcrumbs().at(-1)?.config.title}</Title>
        <main class={styles.aboutContainer}>
          <HomeTitle />

          <Show
            fallback={
              <nav>
                <ol class={styles.aboutBreadcrumb}>
                  <li class={styles.aboutBreadcrumbItem}>
                    <A href={'/'} class={styles.aboutBreadcrumbItemLink}>
                      <Icon name={'arrow_back'} />
                      Home
                    </A>
                  </li>
                </ol>
              </nav>
            }
            when={breadcrumbs().length > 1}
          >
            <nav>
              <ol class={styles.aboutBreadcrumb}>
                <li class={styles.aboutBreadcrumbItem}>
                  <A href={'/'} class={styles.aboutBreadcrumbItemLink}>
                    <Icon name={'arrow_back'} />
                    Home
                  </A>
                </li>
                <For each={breadcrumbs()}>
                  {breadcrumb => (
                    <li class={styles.aboutBreadcrumbItem}>
                      <A
                        href={breadcrumb.route.path}
                        class={styles.aboutBreadcrumbItemLink}
                      >
                        {breadcrumb.config.title}
                      </A>
                    </li>
                  )}
                </For>
              </ol>
            </nav>
          </Show>

          {props.children}
        </main>
      </MDXProvider>
    </Suspense>
  );
}
