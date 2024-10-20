import { TemplateToken } from ".";
import { TokenType } from "./types";
export class SequenceToken extends TemplateToken {
    constructor(file, range, definitionInfo) {
        super(TokenType.Sequence, file, range, definitionInfo);
        this.seq = [];
    }
    get count() {
        return this.seq.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    add(value) {
        this.seq.push(value);
    }
    get(index) {
        return this.seq[index];
    }
    clone(omitSource) {
        const result = omitSource
            ? new SequenceToken(undefined, undefined, this.definitionInfo)
            : new SequenceToken(this.file, this.range, this.definitionInfo);
        for (const item of this.seq) {
            result.add(item.clone(omitSource));
        }
        return result;
    }
    toJSON() {
        return {
            type: TokenType.Sequence,
            seq: this.seq
        };
    }
    *[Symbol.iterator]() {
        for (const item of this.seq) {
            yield item;
        }
    }
}
//# sourceMappingURL=sequence-token.js.map