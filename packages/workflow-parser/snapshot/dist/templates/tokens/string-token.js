import { LiteralToken } from ".";
import { TokenType } from "./types";
export class StringToken extends LiteralToken {
    constructor(file, range, value, definitionInfo, source) {
        super(TokenType.String, file, range, definitionInfo);
        this.value = value;
        this.source = source;
    }
    clone(omitSource) {
        return omitSource
            ? new StringToken(undefined, undefined, this.value, this.definitionInfo, this.source)
            : new StringToken(this.file, this.range, this.value, this.definitionInfo, this.source);
    }
    toString() {
        return this.value;
    }
    toJSON() {
        return this.value;
    }
}
//# sourceMappingURL=string-token.js.map