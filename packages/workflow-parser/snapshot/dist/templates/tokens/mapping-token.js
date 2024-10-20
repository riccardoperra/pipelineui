import { TemplateToken, KeyValuePair } from ".";
import { TokenType } from "./types";
export class MappingToken extends TemplateToken {
    constructor(file, range, definitionInfo) {
        super(TokenType.Mapping, file, range, definitionInfo);
        this.map = [];
    }
    get count() {
        return this.map.length;
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
    add(key, value) {
        this.map.push(new KeyValuePair(key, value));
    }
    get(index) {
        return this.map[index];
    }
    find(key) {
        const pair = this.map.find(pair => pair.key.toString() === key);
        return pair?.value;
    }
    remove(index) {
        this.map.splice(index, 1);
    }
    clone(omitSource) {
        const result = omitSource
            ? new MappingToken(undefined, undefined, this.definitionInfo)
            : new MappingToken(this.file, this.range, this.definitionInfo);
        for (const item of this.map) {
            result.add(item.key.clone(omitSource), item.value.clone(omitSource));
        }
        return result;
    }
    toJSON() {
        const items = [];
        for (const item of this.map) {
            items.push({ Key: item.key, Value: item.value });
        }
        return {
            type: TokenType.Mapping,
            map: items
        };
    }
    *[Symbol.iterator]() {
        for (const item of this.map) {
            yield item;
        }
    }
}
//# sourceMappingURL=mapping-token.js.map