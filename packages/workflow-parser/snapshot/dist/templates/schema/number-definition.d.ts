import { MappingToken, LiteralToken } from "../tokens";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export declare class NumberDefinition extends ScalarDefinition {
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    isMatch(literal: LiteralToken): boolean;
    validate(): void;
}
//# sourceMappingURL=number-definition.d.ts.map