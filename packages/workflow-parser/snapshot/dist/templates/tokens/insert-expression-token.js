import { ScalarToken, ExpressionToken } from ".";
import { INSERT_DIRECTIVE, OPEN_EXPRESSION, CLOSE_EXPRESSION } from "../template-constants";
import { TokenType } from "./types";
export class InsertExpressionToken extends ExpressionToken {
    constructor(file, range, definitionInfo) {
        super(TokenType.InsertExpression, file, range, INSERT_DIRECTIVE, definitionInfo);
    }
    clone(omitSource) {
        return omitSource
            ? new InsertExpressionToken(undefined, undefined, this.definitionInfo)
            : new InsertExpressionToken(this.file, this.range, this.definitionInfo);
    }
    toString() {
        return `${OPEN_EXPRESSION} ${INSERT_DIRECTIVE} ${CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
    toJSON() {
        return {
            type: TokenType.InsertExpression,
            expr: "insert"
        };
    }
}
//# sourceMappingURL=insert-expression-token.js.map