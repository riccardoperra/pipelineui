import { ScalarToken } from "./scalar-token";
export class LiteralToken extends ScalarToken {
    constructor(type, file, range, definitionInfo) {
        super(type, file, range, definitionInfo);
    }
    get isLiteral() {
        return true;
    }
    get isExpression() {
        return false;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
    /**
     * Throws a good debug message when an unexpected literal value is encountered
     */
    assertUnexpectedValue(objectDescription) {
        throw new Error(`Error while reading '${objectDescription}'. Unexpected value '${this.toString()}'`);
    }
}
//# sourceMappingURL=literal-token.js.map