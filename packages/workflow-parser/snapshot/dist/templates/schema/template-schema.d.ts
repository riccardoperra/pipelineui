import { ObjectReader } from "../object-reader";
import { MappingToken } from "../tokens";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
import { MappingDefinition } from "./mapping-definition";
import { PropertyDefinition } from "./property-definition";
import { ScalarDefinition } from "./scalar-definition";
/**
 * This models the root schema object and contains definitions
 */
export declare class TemplateSchema {
    private static readonly _definitionNamePattern;
    private static _internalSchema;
    readonly definitions: {
        [key: string]: Definition;
    };
    readonly version: string;
    constructor(mapping?: MappingToken);
    /**
     * Looks up a definition by name
     */
    getDefinition(name: string): Definition;
    /**
     * Expands one-of definitions and returns all scalar definitions
     */
    getScalarDefinitions(definition: Definition): ScalarDefinition[];
    /**
     * Expands one-of definitions and returns all matching definitions by type
     */
    getDefinitionsOfType(definition: Definition, type: DefinitionType): Definition[];
    /**
     * Attempts match the property name to a property defined by any of the specified definitions.
     * If matched, any unmatching definitions are filtered from the definitions array.
     * Returns the type information for the matched property.
     */
    matchPropertyAndFilter(definitions: MappingDefinition[], propertyName: string): PropertyDefinition | undefined;
    private validate;
    /**
     * Loads a user-defined schema file
     */
    static load(objectReader: ObjectReader): TemplateSchema;
    /**
     * Gets the internal schema used for reading user-defined schema files
     */
    private static getInternalSchema;
}
//# sourceMappingURL=template-schema.d.ts.map