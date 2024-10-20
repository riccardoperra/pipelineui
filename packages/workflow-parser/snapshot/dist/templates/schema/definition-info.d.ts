import { TemplateSchema } from ".";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
import { ScalarDefinition } from "./scalar-definition";
export declare class DefinitionInfo {
    private readonly _schema;
    readonly isDefinitionInfo = true;
    readonly definition: Definition;
    readonly allowedContext: string[];
    constructor(schema: TemplateSchema, name: string);
    constructor(parent: DefinitionInfo, name: string);
    constructor(parent: DefinitionInfo, definition: Definition);
    getScalarDefinitions(): ScalarDefinition[];
    getDefinitionsOfType(type: DefinitionType): Definition[];
}
//# sourceMappingURL=definition-info.d.ts.map