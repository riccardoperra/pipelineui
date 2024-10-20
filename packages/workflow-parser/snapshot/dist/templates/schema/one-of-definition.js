import { DEFINITION, ONE_OF, SEQUENCE, NULL, BOOLEAN, NUMBER, SCALAR, CONSTANT, LOOSE_KEY_TYPE, ALLOWED_VALUES } from "../template-constants";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
/**
 * Must resolve to exactly one of the referenced definitions
 */
export class OneOfDefinition extends Definition {
    constructor(key, definition) {
        super(key, definition);
        this.oneOf = [];
        this.oneOfPrefix = [];
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${DEFINITION} key`);
                switch (definitionKey.value) {
                    case ONE_OF: {
                        const oneOf = definitionPair.value.assertSequence(`${DEFINITION} ${ONE_OF}`);
                        for (const item of oneOf) {
                            const oneOfItem = item.assertString(`${DEFINITION} ${ONE_OF} item`);
                            this.oneOf.push(oneOfItem.value);
                        }
                        break;
                    }
                    case ALLOWED_VALUES: {
                        const oneOf = definitionPair.value.assertSequence(`${DEFINITION} ${ALLOWED_VALUES}`);
                        for (const item of oneOf) {
                            const oneOfItem = item.assertString(`${DEFINITION} ${ONE_OF} item`);
                            this.oneOf.push(this.key + "-" + oneOfItem.value);
                        }
                        break;
                    }
                    default:
                        // throws
                        definitionKey.assertUnexpectedValue(`${DEFINITION} key`);
                        break;
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.OneOf;
    }
    validate(schema, name) {
        if (this.oneOf.length === 0) {
            throw new Error(`'${name}' does not contain any references`);
        }
        let foundLooseKeyType = false;
        const mappingDefinitions = [];
        let allowedValuesDefinition;
        let sequenceDefinition;
        let nullDefinition;
        let booleanDefinition;
        let numberDefinition;
        const stringDefinitions = [];
        const seenNestedTypes = {};
        for (const nestedType of this.oneOf) {
            if (seenNestedTypes[nestedType]) {
                throw new Error(`'${name}' contains duplicate nested type '${nestedType}'`);
            }
            seenNestedTypes[nestedType] = true;
            const nestedDefinition = schema.getDefinition(nestedType);
            if (nestedDefinition.readerContext.length > 0) {
                throw new Error(`'${name}' is a one-of definition and references another definition that defines context. This is currently not supported.`);
            }
            switch (nestedDefinition.definitionType) {
                case DefinitionType.Mapping: {
                    const mappingDefinition = nestedDefinition;
                    mappingDefinitions.push(mappingDefinition);
                    if (mappingDefinition.looseKeyType) {
                        foundLooseKeyType = true;
                    }
                    break;
                }
                case DefinitionType.Sequence: {
                    // Multiple sequence definitions not allowed
                    if (sequenceDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${SEQUENCE}'`);
                    }
                    sequenceDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Null: {
                    // Multiple null definitions not allowed
                    if (nullDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${NULL}'`);
                    }
                    nullDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Boolean: {
                    // Multiple boolean definitions not allowed
                    if (booleanDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${BOOLEAN}'`);
                    }
                    booleanDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Number: {
                    // Multiple number definitions not allowed
                    if (numberDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${NUMBER}'`);
                    }
                    numberDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.String: {
                    const stringDefinition = nestedDefinition;
                    // Multiple string definitions
                    if (stringDefinitions.length > 0 && (!stringDefinitions[0].constant || !stringDefinition.constant)) {
                        throw new Error(`'${name}' refers to more than one '${SCALAR}', but some do not set '${CONSTANT}'`);
                    }
                    stringDefinitions.push(stringDefinition);
                    break;
                }
                case DefinitionType.OneOf: {
                    // Multiple allowed-values definitions not allowed
                    if (allowedValuesDefinition) {
                        throw new Error(`'${name}' contains multiple allowed-values definitions`);
                    }
                    allowedValuesDefinition = nestedDefinition;
                    break;
                }
                default:
                    throw new Error(`'${name}' refers to a definition with type '${nestedDefinition.definitionType}'`);
            }
        }
        if (mappingDefinitions.length > 1) {
            if (foundLooseKeyType) {
                throw new Error(`'${name}' refers to two mappings and at least one sets '${LOOSE_KEY_TYPE}'. This is not currently supported.`);
            }
            const seenProperties = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const propertyName of Object.keys(mappingDefinition.properties)) {
                    const newPropertyDef = mappingDefinition.properties[propertyName];
                    // Already seen
                    const existingPropertyDef = seenProperties[propertyName];
                    if (existingPropertyDef) {
                        // Types match
                        if (existingPropertyDef.type === newPropertyDef.type) {
                            continue;
                        }
                        // Collision
                        throw new Error(`'${name}' contains two mappings with the same property, but each refers to a different type. All matching properties must refer to the same type.`);
                    }
                    // New
                    else {
                        seenProperties[propertyName] = newPropertyDef;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=one-of-definition.js.map