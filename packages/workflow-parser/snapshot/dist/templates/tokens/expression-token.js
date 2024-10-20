import { Lexer, Parser } from "@actions/expressions";
import { splitAllowedContext } from "../allowed-context";
import { ScalarToken } from "./scalar-token";
export class ExpressionToken extends ScalarToken {
    constructor(type, file, range, directive, definitionInfo) {
        super(type, file, range, definitionInfo);
        this.directive = directive;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return true;
    }
    static validateExpression(expression, allowedContext) {
        const { namedContexts, functions } = splitAllowedContext(allowedContext);
        // Parse
        const lexer = new Lexer(expression);
        const result = lexer.lex();
        const p = new Parser(result.tokens, namedContexts, functions);
        p.parse();
    }
}
//# sourceMappingURL=expression-token.js.map