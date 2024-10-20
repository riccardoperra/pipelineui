import { TemplateToken, ExpressionToken } from ".";
import { DefinitionInfo } from "../schema/definition-info";
import { SerializedExpressionToken } from "./serialization";
import { TokenRange } from "./token-range";
export declare class InsertExpressionToken extends ExpressionToken {
    constructor(file: number | undefined, range: TokenRange | undefined, definitionInfo: DefinitionInfo | undefined);
    clone(omitSource?: boolean): TemplateToken;
    toString(): string;
    toDisplayString(): string;
    toJSON(): SerializedExpressionToken;
}
//# sourceMappingURL=insert-expression-token.d.ts.map