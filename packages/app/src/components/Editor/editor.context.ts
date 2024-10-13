import {createContext, useContext} from 'solid-js';

export interface EditorPageContext {
  source: string;
}

export const EditorContext = createContext<EditorPageContext>();

export function useEditorContext() {
  return useContext(EditorContext)!;
}
