import { TemplateToken } from ".";
export declare class TraversalState {
    private readonly _token;
    private index;
    private isKey;
    readonly parent: TraversalState | undefined;
    current: TemplateToken | undefined;
    currentKey: TemplateToken | undefined;
    constructor(parent: TraversalState | undefined, token: TemplateToken);
    moveNext(omitKeys: boolean): boolean;
}
//# sourceMappingURL=traversal-state.d.ts.map