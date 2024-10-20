import { TemplateSchema } from "./template-schema";
import { MappingToken } from "../tokens";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
import { PropertyDefinition } from "./property-definition";
export declare class MappingDefinition extends Definition {
    readonly properties: {
        [key: string]: PropertyDefinition;
    };
    looseKeyType: string;
    looseValueType: string;
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    validate(schema: TemplateSchema, name: string): void;
}
//# sourceMappingURL=mapping-definition.d.ts.map