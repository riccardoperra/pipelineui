import {defineStore} from 'statebuilder';

export interface EditorState {
  selectedJobId: string | null;
}

export const EditorStore = defineStore<EditorState>(() => ({
  selectedJobId: null,
}));
