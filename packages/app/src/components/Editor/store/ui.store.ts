import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';
import {createEffect, createSignal} from 'solid-js';
import Resizable from '@corvu/resizable';

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

    return {
      verticalResizableContext,
      setVerticalResizableContext,
      horizontalResizableContext,
      setHorizontalResizableContext,
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
      }
    });
  });
