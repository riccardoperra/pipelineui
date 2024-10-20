import { LiteralToken, TemplateToken } from ".";
import { DefinitionInfo } from "../schema/definition-info";
import { TokenRange } from "./token-range";
export declare class StringToken extends LiteralToken {
    readonly value: string;
    readonly source: string | undefined;
    constructor(file: number | undefined, range: TokenRange | undefined, value: string, definitionInfo: DefinitionInfo | undefined, source?: string);
    clone(omitSource?: boolean): TemplateToken;
    toString(): string;
    toJSON(): string;
}
//# sourceMappingURL=string-token.d.ts.map