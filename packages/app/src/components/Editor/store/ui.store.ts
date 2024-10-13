import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';
import {createSignal} from 'solid-js';
import Resizable from '@corvu/resizable';

interface EditorUiState {
  leftPanel: 'code' | 'merge' | 'none';
  rightPanel: 'properties' | 'none';
  mergeView: boolean;
}

type EditorUiCommands = {
  toggleLeftPanel: EditorUiState['leftPanel'];
  toggleRightPanel: EditorUiState['rightPanel'];
  setShowMergeView: EditorUiState['mergeView'];
};

export const EditorUiStore = defineStore<EditorUiState>(() => ({
  leftPanel: 'code',
  rightPanel: 'properties',
  mergeView: false,
}))
  .extend(withProxyCommands<EditorUiCommands>())
  .extend((_, context) => {
    const [resizableContext, setResizableContext] =
      createSignal<ReturnType<typeof Resizable.useContext>>();
    return {
      resizableContext,
      setResizableContext,
    };
  })
  .extend(_ => {
    _.hold(_.commands.toggleLeftPanel, (value, {set, state}) => {
      const newValue = state.leftPanel === value ? 'none' : value;
      set('leftPanel', newValue);
      const context = _.resizableContext()!;
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
      const context = _.resizableContext()!;
      if (newValue === 'none') {
        context.collapse(2);
      } else {
        context.expand(2, 'preceding');
        context.resize(2, 0.17);
      }
    });
  });
