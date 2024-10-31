import {createLatest} from '@solid-primitives/memo';
import {AccessorWithLatest, createAsync} from '@solidjs/router';
import {createComputed, createSignal, Setter} from 'solid-js';
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
  const [signal, setSignal] = createSignal<T | undefined>(
    options?.initialValue,
  );

  createComputed(() => {
    // Sync latest signal retrieved by asyncState in order to be available globally after navigation
    const latest = asyncState.latest;
    setSignal(() => latest);
  });

  const latestValue = createLatest([signal, asyncState]);
  const state: AsyncSignalState<T | undefined> = Object.assign(latestValue, {
    raw: asyncState,
    set: setSignal,
  });

  return state;
}

/**
 * Define an async signal.
 *
 * @experimental TODO port to statebuilder?
 */
export const eDefineAsync = create('asyncSignal', makeAsyncSignal);
