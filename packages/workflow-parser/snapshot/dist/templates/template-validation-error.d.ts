import { TokenRange } from "./tokens/token-range";
/**
 * Provides information about an error which occurred during validation
 */
export declare class TemplateValidationError {
    readonly rawMessage: string;
    readonly prefix: string | undefined;
    readonly code: string | undefined;
    readonly range: TokenRange | undefined;
    constructor(rawMessage: string, prefix: string | undefined, code: string | undefined, range: TokenRange | undefined);
    get message(): string;
    toString(): string;
}
//# sourceMappingURL=template-validation-error.d.ts.map