import { MappingToken } from "../tokens";
import { Definition } from "./definition";
import { DefinitionType } from "./definition-type";
import { TemplateSchema } from "./template-schema";
export declare class SequenceDefinition extends Definition {
    itemType: string;
    constructor(key: string, definition?: MappingToken);
    get definitionType(): DefinitionType;
    validate(schema: TemplateSchema, name: string): void;
}
//# sourceMappingURL=sequence-definition.d.ts.map