import { LiteralToken } from ".";
import { TokenType } from "./types";
export class BooleanToken extends LiteralToken {
    constructor(file, range, value, definitionInfo) {
        super(TokenType.Boolean, file, range, definitionInfo);
        this.bool = value;
    }
    get value() {
        return this.bool;
    }
    clone(omitSource) {
        return omitSource
            ? new BooleanToken(undefined, undefined, this.bool, this.definitionInfo)
            : new BooleanToken(this.file, this.range, this.bool, this.definitionInfo);
    }
    toString() {
        return this.bool ? "true" : "false";
    }
    toJSON() {
        return this.bool;
    }
}
//# sourceMappingURL=boolean-token.js.map