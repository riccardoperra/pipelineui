import { LiteralToken, TemplateToken } from ".";
import { DefinitionInfo } from "../schema/definition-info";
import { TokenRange } from "./token-range";
export declare class NullToken extends LiteralToken {
    constructor(file: number | undefined, range: TokenRange | undefined, definitionInfo: DefinitionInfo | undefined);
    clone(omitSource?: boolean): TemplateToken;
    toString(): string;
    toJSON(): null;
}
//# sourceMappingURL=null-token.d.ts.map