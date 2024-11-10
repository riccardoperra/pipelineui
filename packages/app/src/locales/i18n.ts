import {I18n} from '@lingui/core';
import {
  createComponent,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from 'solid-js';

export interface I18nContext {
  i18n: I18n;
  _: I18n['t'];
}
export const I18nContext = createContext<I18nContext>();

export function I18nProvider(props: ParentProps<{value: I18n}>) {
  const i18n = props.value;
  const [notifier, notify] = createSignal({}, {equals: false});

  i18n.on('change', () => notify({}));

  const t: (typeof i18n)['t'] = (...args: any[]) => {
    notifier();
    return i18n.t.apply(i18n, args as any);
  };

  return createComponent(I18nContext.Provider, {
    value: {
      i18n,
      _: t,
    },
    get children() {
      return props.children;
    },
  });
}

export function useI18n() {
  const i18n = useContext(I18nContext);
  if (!i18n) {
    throw new Error('Cannot use `useI18n` outside of I18nContext provider');
  }
  return i18n;
}
