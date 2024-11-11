import {AccessorWithLatest, createAsync} from '@solidjs/router';
import {
  createComputed,
  createEffect,
  createReaction,
  createRenderEffect,
  createRoot,
  createSignal,
  getOwner,
  on,
  onCleanup,
  Owner,
  Setter,
  untrack,
} from 'solid-js';
import {create} from 'statebuilder';

export interface AsyncSignalState<T> {
  /**
   * The latest value.
   */
  (): T;

  /**
   * The raw signal returned by `createAsync`.
   * Note: this accessor will not contain any value written by `set`.
   */
  raw: AccessorWithLatest<T | undefined>;

  /**
   * Write a new value to the store.
   */
  set: (setter: Setter<T>) => void;
}
function makeAsyncSignal<T>(
  fetcher: (prev: T | undefined) => Promise<T>,
  options?: {
    name?: string;
    initialValue?: T;
    deferStream?: boolean;
  },
): AsyncSignalState<T | undefined> {
  const asyncState = createAsync(fetcher, options);
  const [mode, setMode] = createSignal<'auto' | 'manual'>('auto');
  const [signal, setSignal] = createSignal<T | undefined>(
    options?.initialValue,
  );

  createEffect(() => {
    setSignal(() => asyncState());
  });

  const value = () => {
    const $mode = mode();
    if ($mode === 'auto') {
      return asyncState();
    }
    return signal();
  };

  const set: Setter<T | undefined> = ((arg0: any) => {
    setMode('manual');
    setSignal(arg0);
  }) as Setter<T | undefined>;

  const state: AsyncSignalState<T | undefined> = Object.assign(value, {
    raw: asyncState,
    set,
  });

  return state;
}

/**
 * Define an async signal.
 *
 * @experimental TODO port to statebuilder?
 *
 */
export const eDefineAsync = create('asyncSignal', makeAsyncSignal);
