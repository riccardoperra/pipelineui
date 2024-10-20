import { DefinitionInfo } from "../schema/definition-info";
import { ScalarToken } from "./scalar-token";
import { TokenRange } from "./token-range";
export declare abstract class LiteralToken extends ScalarToken {
    constructor(type: number, file: number | undefined, range: TokenRange | undefined, definitionInfo: DefinitionInfo | undefined);
    get isLiteral(): boolean;
    get isExpression(): boolean;
    toDisplayString(): string;
    /**
     * Throws a good debug message when an unexpected literal value is encountered
     */
    assertUnexpectedValue(objectDescription: string): void;
}
//# sourceMappingURL=literal-token.d.ts.map