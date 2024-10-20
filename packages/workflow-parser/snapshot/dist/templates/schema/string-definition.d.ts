import { LiteralToken, MappingToken } from "../tokens";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export declare class StringDefinition extends ScalarDefinition {
    constant: string;
    ignoreCase: boolean;
    requireNonEmpty: boolean;
    isExpression: boolean;
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    isMatch(literal: LiteralToken): boolean;
    validate(): void;
}
//# sourceMappingURL=string-definition.d.ts.map