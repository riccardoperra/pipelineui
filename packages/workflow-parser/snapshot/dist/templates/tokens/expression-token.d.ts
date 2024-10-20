import { DefinitionInfo } from "../schema/definition-info";
import { ScalarToken } from "./scalar-token";
import { TokenRange } from "./token-range";
export declare abstract class ExpressionToken extends ScalarToken {
    readonly directive: string | undefined;
    constructor(type: number, file: number | undefined, range: TokenRange | undefined, directive: string | undefined, definitionInfo: DefinitionInfo | undefined);
    get isLiteral(): boolean;
    get isExpression(): boolean;
    static validateExpression(expression: string, allowedContext: string[]): void;
}
//# sourceMappingURL=expression-token.d.ts.map