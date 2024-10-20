import { DefinitionInfo } from "../schema/definition-info";
import { TemplateToken } from "./template-token";
import { TokenRange } from "./token-range";
/**
 * Base class for everything that is not a mapping or sequence
 */
export declare abstract class ScalarToken extends TemplateToken {
    constructor(type: number, file: number | undefined, range: TokenRange | undefined, definitionInfo: DefinitionInfo | undefined);
    abstract toString(): string;
    abstract toDisplayString(): string;
    get isScalar(): boolean;
    protected static trimDisplayString(displayString: string): string;
}
//# sourceMappingURL=scalar-token.d.ts.map