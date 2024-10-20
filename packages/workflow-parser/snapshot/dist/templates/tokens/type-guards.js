import { MappingToken } from "./mapping-token";
import { SequenceToken } from "./sequence-token";
import { TokenType } from "./types";
export function isLiteral(t) {
    return t.isLiteral;
}
export function isScalar(t) {
    return t.isScalar;
}
export function isString(t) {
    return isLiteral(t) && t.templateTokenType === TokenType.String;
}
export function isNumber(t) {
    return isLiteral(t) && t.templateTokenType === TokenType.Number;
}
export function isBoolean(t) {
    return isLiteral(t) && t.templateTokenType === TokenType.Boolean;
}
export function isBasicExpression(t) {
    return isScalar(t) && t.templateTokenType === TokenType.BasicExpression;
}
export function isSequence(t) {
    return t instanceof SequenceToken;
}
export function isMapping(t) {
    return t instanceof MappingToken;
}
//# sourceMappingURL=type-guards.js.map