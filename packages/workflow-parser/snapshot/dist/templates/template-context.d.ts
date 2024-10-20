import { FunctionInfo } from "@actions/expressions/funcs/info";
import { TemplateSchema } from "./schema/template-schema";
import { TemplateValidationError } from "./template-validation-error";
import { TemplateToken } from "./tokens";
import { TokenRange } from "./tokens/token-range";
import { TraceWriter } from "./trace-writer";
/**
 * Context object that is flowed through while loading and evaluating object templates
 */
export declare class TemplateContext {
    private readonly _fileIds;
    private readonly _fileNames;
    /**
     * Available functions within expression contexts
     */
    readonly expressionFunctions: FunctionInfo[];
    /**
     * Available values within expression contexts
     */
    readonly expressionNamedContexts: string[];
    readonly errors: TemplateValidationErrors;
    readonly schema: TemplateSchema;
    readonly trace: TraceWriter;
    readonly state: {
        [key: string]: unknown;
    };
    constructor(errors: TemplateValidationErrors, schema: TemplateSchema, trace: TraceWriter);
    error(token: TemplateToken | undefined, err: string, tokenRange?: TokenRange): void;
    error(token: TemplateToken | undefined, err: Error, tokenRange?: TokenRange): void;
    error(token: TemplateToken | undefined, err: unknown): void;
    error(fileId: number | undefined, err: string, tokenRange?: TokenRange): void;
    error(fileId: number | undefined, err: Error, tokenRange?: TokenRange): void;
    error(fileId: number | undefined, err: unknown, tokenRange?: TokenRange): void;
    /**
     * Gets or adds the file ID
     */
    getFileId(file: string): number;
    /**
     * Looks up a file name by ID. Returns undefined if not found.
     */
    getFileName(fileId: number): string | undefined;
    /**
     * Gets a copy of the file table
     */
    getFileTable(): string[];
    private getErrorPrefix;
}
/**
 * Provides information about errors which occurred during validation
 */
export declare class TemplateValidationErrors {
    private readonly _maxErrors;
    private readonly _maxMessageLength;
    private _errors;
    constructor(maxErrors?: number, maxMessageLength?: number);
    get count(): number;
    add(err: TemplateValidationError | TemplateValidationError[]): void;
    /**
     * Throws if any errors
     * @param prefix The error message prefix
     */
    check(prefix?: string): void;
    clear(): void;
    getErrors(): TemplateValidationError[];
}
//# sourceMappingURL=template-context.d.ts.map