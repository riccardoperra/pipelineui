import { DEFINITION, BOOLEAN } from "../template-constants";
import { TokenType } from "../tokens/types";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export class BooleanDefinition extends ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${DEFINITION} key`);
                switch (definitionKey.value) {
                    case BOOLEAN: {
                        const mapping = definitionPair.value.assertMapping(`${DEFINITION} ${BOOLEAN}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${DEFINITION} ${BOOLEAN} key`);
                            switch (mappingKey.value) {
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${DEFINITION} ${BOOLEAN} key`);
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
        return DefinitionType.Boolean;
    }
    isMatch(literal) {
        return literal.templateTokenType === TokenType.Boolean;
    }
    validate() {
        // no-op
    }
}
//# sourceMappingURL=boolean-definition.js.map