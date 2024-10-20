import { DEFINITION, NULL } from "../template-constants";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
import { TokenType } from "../tokens/types";
export class NullDefinition extends ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${DEFINITION} key`);
                switch (definitionKey.value) {
                    case NULL: {
                        const mapping = definitionPair.value.assertMapping(`${DEFINITION} ${NULL}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${DEFINITION} ${NULL} key`);
                            switch (mappingKey.value) {
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${DEFINITION} ${NULL} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Null;
    }
    isMatch(literal) {
        return literal.templateTokenType === TokenType.Null;
    }
    validate() {
        // no-op
    }
}
//# sourceMappingURL=null-definition.js.map