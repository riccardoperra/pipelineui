import { CONSTANT, DEFINITION, IGNORE_CASE, IS_EXPRESSION, REQUIRE_NON_EMPTY, STRING } from "../template-constants";
import { TokenType } from "../tokens/types";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export class StringDefinition extends ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        this.constant = "";
        this.ignoreCase = false;
        this.requireNonEmpty = false;
        this.isExpression = false;
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${DEFINITION} key`);
                switch (definitionKey.value) {
                    case STRING: {
                        const mapping = definitionPair.value.assertMapping(`${DEFINITION} ${STRING}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${DEFINITION} ${STRING} key`);
                            switch (mappingKey.value) {
                                case CONSTANT: {
                                    const constantStringToken = mappingPair.value.assertString(`${DEFINITION} ${STRING} ${CONSTANT}`);
                                    this.constant = constantStringToken.value;
                                    break;
                                }
                                case IGNORE_CASE: {
                                    const ignoreCaseBooleanToken = mappingPair.value.assertBoolean(`${DEFINITION} ${STRING} ${IGNORE_CASE}`);
                                    this.ignoreCase = ignoreCaseBooleanToken.value;
                                    break;
                                }
                                case REQUIRE_NON_EMPTY: {
                                    const requireNonEmptyBooleanToken = mappingPair.value.assertBoolean(`${DEFINITION} ${STRING} ${REQUIRE_NON_EMPTY}`);
                                    this.requireNonEmpty = requireNonEmptyBooleanToken.value;
                                    break;
                                }
                                case IS_EXPRESSION: {
                                    const isExpressionToken = mappingPair.value.assertBoolean(`${DEFINITION} ${STRING} ${IS_EXPRESSION}`);
                                    this.isExpression = isExpressionToken.value;
                                    break;
                                }
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${DEFINITION} ${STRING} key`);
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
        return DefinitionType.String;
    }
    isMatch(literal) {
        if (literal.templateTokenType === TokenType.String) {
            const value = literal.value;
            if (this.constant) {
                return this.ignoreCase ? this.constant.toUpperCase() === value.toUpperCase() : this.constant === value;
            }
            else if (this.requireNonEmpty) {
                return !!value;
            }
            else {
                return true;
            }
        }
        return false;
    }
    validate() {
        if (this.constant && this.requireNonEmpty) {
            throw new Error(`Properties '${CONSTANT}' and '${REQUIRE_NON_EMPTY}' cannot both be set`);
        }
    }
}
//# sourceMappingURL=string-definition.js.map