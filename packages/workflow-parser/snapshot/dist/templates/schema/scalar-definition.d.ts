import { LiteralToken, MappingToken } from "../tokens";
import { Definition } from "./definition";
export declare abstract class ScalarDefinition extends Definition {
    constructor(key: string, definition?: MappingToken);
    abstract isMatch(literal: LiteralToken): boolean;
}
//# sourceMappingURL=scalar-definition.d.ts.map