import { LiteralToken, TemplateToken } from ".";
import { DefinitionInfo } from "../schema/definition-info";
import { TokenRange } from "./token-range";
export declare class NumberToken extends LiteralToken {
    private readonly num;
    constructor(file: number | undefined, range: TokenRange | undefined, value: number, definitionInfo: DefinitionInfo | undefined);
    get value(): number;
    clone(omitSource?: boolean): TemplateToken;
    toString(): string;
    toJSON(): number;
}
//# sourceMappingURL=number-token.d.ts.map