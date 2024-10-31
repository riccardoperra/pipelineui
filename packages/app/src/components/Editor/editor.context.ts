import type {Models} from 'node-appwrite';
import {Accessor, createContext, useContext} from 'solid-js';

export interface EditorParsedRepository {
  owner: string;
  repoName: string;
  branchName: string;
  filePath: string[];
}

export interface EditorPageContext {
  source: string;
  remoteId: string | null;
  repository: EditorParsedRepository | null;
  user: Accessor<Models.User<any> | undefined | null>;
}

export const EditorContext = createContext<EditorPageContext>();

export function useEditorContext() {
  return useContext(EditorContext)!;
}
