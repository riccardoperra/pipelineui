import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';
import {createEffect, createMemo, createSignal, on} from 'solid-js';
import Resizable from '@corvu/resizable';
import {cookieStorage, makePersisted} from '@solid-primitives/storage';

interface EditorUiState {
  leftPanel: 'code' | 'merge' | 'none';
  rightPanel: 'properties' | 'none';
  bottomPanel: 'diagnostic' | 'none';
  mergeView: boolean;
}

type EditorUiCommands = {
  toggleLeftPanel: EditorUiState['leftPanel'];
  toggleRightPanel: EditorUiState['rightPanel'];
  toggleBottomPanel: EditorUiState['bottomPanel'];
  setShowMergeView: EditorUiState['mergeView'];
};

export const EditorUiStore = defineStore<EditorUiState>(() => ({
  leftPanel: 'code',
  rightPanel: 'properties',
  mergeView: false,
  bottomPanel: 'none',
}))
  .extend(withProxyCommands<EditorUiCommands>())
  .extend((_, context) => {
    const [verticalResizableContext, setVerticalResizableContext] =
      createSignal<ReturnType<typeof Resizable.useContext>>();
    const [horizontalResizableContext, setHorizontalResizableContext] =
      createSignal<ReturnType<typeof Resizable.useContext>>();

    const [horizontalSizes, setHorizontalSizes] = makePersisted(
      createSignal<number[]>([]),
      {
        storage: cookieStorage,
        name: 'horizontal-resizable-sizes',
      },
    );

    const [verticalSizes, setVerticalSizes] = makePersisted(
      createSignal<number[]>([1, 0]),
      {
        storage: cookieStorage,
        name: 'vertical-resizable-sizes',
      },
    );

    const rightPanelSizeExpanded = createMemo(() => horizontalSizes()[2] > 0);
    createEffect(
      on(rightPanelSizeExpanded, expanded => {
        _.set('rightPanel', expanded ? 'properties' : 'none');
      }),
    );

    const leftPanelSizeExpanded = createMemo(() => horizontalSizes()[0] > 0);
    createEffect(
      on(leftPanelSizeExpanded, expanded => {
        _.set('leftPanel', expanded ? 'code' : 'none');
      }),
    );

    const bottomPanelSizeExpanded = createMemo(() => verticalSizes()[1] > 0);
    createEffect(
      on(bottomPanelSizeExpanded, expanded => {
        _.set('bottomPanel', expanded ? 'diagnostic' : 'none');
      }),
    );

    return {
      verticalResizableContext,
      setVerticalResizableContext,
      horizontalResizableContext,
      setHorizontalResizableContext,
      horizontalSizes,
      setHorizontalSizes,
      verticalSizes,
      setVerticalSizes,
    };
  })
  .extend(_ => {
    _.hold(_.commands.toggleLeftPanel, (value, {set, state}) => {
      const newValue = state.leftPanel === value ? 'none' : value;
      set('leftPanel', newValue);
      const context = _.horizontalResizableContext()!;
      if (newValue === 'none') {
        context.collapse(0);
      } else {
        if (newValue === 'merge') {
          context.collapse(1);
          context.expand(0, 'following');
          context.resize(0, 0.5);
        } else {
          context.expand(0, 'following');
          context.resize(0, 0.25);
        }
      }
    });
    _.hold(_.commands.toggleRightPanel, (value, {set, state}) => {
      const newValue = state.rightPanel === value ? 'none' : value;
      set('rightPanel', newValue);
      const context = _.horizontalResizableContext()!;
      if (newValue === 'none') {
        context.collapse(2);
      } else {
        context.expand(2, 'preceding');
        context.resize(2, 0.17);
      }
    });
    _.hold(_.commands.toggleBottomPanel, (value, {set, state}) => {
      const newValue = state.bottomPanel === value ? 'none' : value;
      set('bottomPanel', newValue);
      const context = _.verticalResizableContext()!;
      if (newValue === 'none') {
        context.collapse(1);
      } else {
        context.expand(1);
        context.resize(1, 0.2, 'preceding');
      }
    });
  });
