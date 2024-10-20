import { BasicExpressionToken } from "./basic-expression-token";
import { BooleanToken } from "./boolean-token";
import { LiteralToken } from "./literal-token";
import { MappingToken } from "./mapping-token";
import { NumberToken } from "./number-token";
import { ScalarToken } from "./scalar-token";
import { SequenceToken } from "./sequence-token";
import { StringToken } from "./string-token";
import { TemplateToken } from "./template-token";
export declare function isLiteral(t: TemplateToken): t is LiteralToken;
export declare function isScalar(t: TemplateToken): t is ScalarToken;
export declare function isString(t: TemplateToken): t is StringToken;
export declare function isNumber(t: TemplateToken): t is NumberToken;
export declare function isBoolean(t: TemplateToken): t is BooleanToken;
export declare function isBasicExpression(t: TemplateToken): t is BasicExpressionToken;
export declare function isSequence(t: TemplateToken): t is SequenceToken;
export declare function isMapping(t: TemplateToken): t is MappingToken;
//# sourceMappingURL=type-guards.d.ts.map