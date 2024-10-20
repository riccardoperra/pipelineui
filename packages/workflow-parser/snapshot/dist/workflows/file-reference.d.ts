export type FileReference = LocalFileReference | RemoteFileReference;
export type LocalFileReference = {
    path: string;
};
export type RemoteFileReference = {
    repository: string;
    owner: string;
    path: string;
    version: string;
};
export declare function parseFileReference(ref: string): FileReference;
export declare function fileIdentifier(ref: FileReference): string;
//# sourceMappingURL=file-reference.d.ts.map