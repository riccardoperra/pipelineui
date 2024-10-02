import {defineStore} from 'statebuilder';
import {withProxyCommands} from 'statebuilder/commands';

interface EditorUiState {
  leftPanel: 'code' | 'structure' | 'none';
}

type EditorUiCommands = {
  toggleLeftPanel: EditorUiState['leftPanel'];
};

export const EditorUiStore = defineStore<EditorUiState>(() => ({
  leftPanel: 'none',
}))
  .extend(withProxyCommands<EditorUiCommands>())
  .extend(_ => {
    _.hold(_.commands.toggleLeftPanel, (value, {set, state}) => {
      const newValue = state.leftPanel === value ? 'none' : value;
      set('leftPanel', newValue);
    });
  });
