import { MappingToken, LiteralToken } from "../tokens";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export declare class BooleanDefinition extends ScalarDefinition {
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    isMatch(literal: LiteralToken): boolean;
    validate(): void;
}
//# sourceMappingURL=boolean-definition.d.ts.map