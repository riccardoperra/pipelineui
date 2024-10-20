import { MAPPING_PROPERTY_VALUE, TYPE, REQUIRED, DESCRIPTION } from "../template-constants";
import { TokenType } from "../tokens/types";
export class PropertyDefinition {
    constructor(token) {
        this.type = "";
        this.required = false;
        if (token.templateTokenType === TokenType.String) {
            this.type = token.value;
        }
        else {
            const mapping = token.assertMapping(MAPPING_PROPERTY_VALUE);
            for (const mappingPair of mapping) {
                const mappingKey = mappingPair.key.assertString(`${MAPPING_PROPERTY_VALUE} key`);
                switch (mappingKey.value) {
                    case TYPE:
                        this.type = mappingPair.value.assertString(`${MAPPING_PROPERTY_VALUE} ${TYPE}`).value;
                        break;
                    case REQUIRED:
                        this.required = mappingPair.value.assertBoolean(`${MAPPING_PROPERTY_VALUE} ${REQUIRED}`).value;
                        break;
                    case DESCRIPTION:
                        this.description = mappingPair.value.assertString(`${MAPPING_PROPERTY_VALUE} ${DESCRIPTION}`).value;
                        break;
                    default:
                        mappingKey.assertUnexpectedValue(`${MAPPING_PROPERTY_VALUE} key`); // throws
                }
            }
        }
    }
}
//# sourceMappingURL=property-definition.js.map