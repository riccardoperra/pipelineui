import { DefinitionInfo } from "../schema/definition-info";
import { ExpressionToken } from "./expression-token";
import { SerializedExpressionToken } from "./serialization";
import { TemplateToken } from "./template-token";
import { TokenRange } from "./token-range";
export declare class BasicExpressionToken extends ExpressionToken {
    private readonly expr;
    readonly source: string | undefined;
    readonly originalExpressions: BasicExpressionToken[] | undefined;
    /**
     * The range of the expression within the source string.
     *
     * `range` is the range of the entire expression, including the `${{` and `}}`. `expression` is only the expression
     * without any ${{ }} markers. `expressionRange` is the range of just the expression within the document.
     */
    readonly expressionRange: TokenRange | undefined;
    /**
     * @param originalExpressions If the basic expression was transformed from individual expressions, these will be the original ones
     */
    constructor(file: number | undefined, range: TokenRange | undefined, expression: string, definitionInfo: DefinitionInfo | undefined, originalExpressions: BasicExpressionToken[] | undefined, source: string | undefined, expressionRange?: TokenRange | undefined);
    get expression(): string;
    clone(omitSource?: boolean): TemplateToken;
    toString(): string;
    toDisplayString(): string;
    toJSON(): SerializedExpressionToken;
}
//# sourceMappingURL=basic-expression-token.d.ts.map