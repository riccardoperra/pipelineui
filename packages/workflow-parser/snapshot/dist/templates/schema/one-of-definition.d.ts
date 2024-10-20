import { TemplateSchema } from "./template-schema";
import { MappingToken } from "../tokens";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
/**
 * Must resolve to exactly one of the referenced definitions
 */
export declare class OneOfDefinition extends Definition {
    readonly oneOf: string[];
    readonly oneOfPrefix: string[];
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    validate(schema: TemplateSchema, name: string): void;
}
//# sourceMappingURL=one-of-definition.d.ts.map