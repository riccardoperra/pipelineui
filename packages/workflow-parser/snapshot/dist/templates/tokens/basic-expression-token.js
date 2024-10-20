import { CLOSE_EXPRESSION, OPEN_EXPRESSION } from "../template-constants";
import { ExpressionToken } from "./expression-token";
import { ScalarToken } from "./scalar-token";
import { TokenType } from "./types";
export class BasicExpressionToken extends ExpressionToken {
    /**
     * @param originalExpressions If the basic expression was transformed from individual expressions, these will be the original ones
     */
    constructor(file, range, expression, definitionInfo, originalExpressions, source, expressionRange) {
        super(TokenType.BasicExpression, file, range, undefined, definitionInfo);
        this.expr = expression;
        this.source = source;
        this.originalExpressions = originalExpressions;
        this.expressionRange = expressionRange;
    }
    get expression() {
        return this.expr;
    }
    clone(omitSource) {
        return omitSource
            ? new BasicExpressionToken(undefined, undefined, this.expr, this.definitionInfo, this.originalExpressions, this.source, this.expressionRange)
            : new BasicExpressionToken(this.file, this.range, this.expr, this.definitionInfo, this.originalExpressions, this.source, this.expressionRange);
    }
    toString() {
        return `${OPEN_EXPRESSION} ${this.expr} ${CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        // TODO: Implement expression display string to match `BasicExpressionToken#ToDisplayString()` in the C# parser
        return ScalarToken.trimDisplayString(this.toString());
    }
    toJSON() {
        return {
            type: TokenType.BasicExpression,
            expr: this.expr
        };
    }
}
//# sourceMappingURL=basic-expression-token.js.map