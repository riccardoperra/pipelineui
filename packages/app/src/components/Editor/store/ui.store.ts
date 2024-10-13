import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';
import {createEffect, createSignal} from 'solid-js';
import Resizable from '@corvu/resizable';

interface EditorUiState {
  leftPanel: 'code' | 'structure' | 'none';
  rightPanel: 'properties' | 'none';
}

type EditorUiCommands = {
  toggleLeftPanel: EditorUiState['leftPanel'];
  toggleRightPanel: EditorUiState['rightPanel'];
};

export const EditorUiStore = defineStore<EditorUiState>(() => ({
  leftPanel: 'code',
  rightPanel: 'properties',
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
    });
    _.hold(_.commands.toggleRightPanel, (value, {set, state}) => {
      const newValue = state.rightPanel === value ? 'none' : value;
      set('rightPanel', newValue);
    });
  });
