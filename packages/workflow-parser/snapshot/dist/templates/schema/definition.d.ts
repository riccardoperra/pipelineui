import { MappingToken } from "../tokens";
import { DefinitionType } from "./definition-type";
import { TemplateSchema } from "./template-schema";
/**
 * Defines the allowable schema for a user defined type
 */
export declare abstract class Definition {
    /**
     * Used by the template reader to determine allowed expression values and functions.
     * Also used by the template reader to validate function min/max parameters.
     */
    readonly readerContext: string[];
    /**
     * Used by the template evaluator to determine allowed expression values and functions.
     * The min/max parameter info is omitted.
     */
    readonly evaluatorContext: string[];
    readonly key: string;
    readonly description: string | undefined;
    constructor(key: string, definition?: MappingToken);
    abstract get definitionType(): DefinitionType;
    abstract validate(schema: TemplateSchema, name: string): void;
}
//# sourceMappingURL=definition.d.ts.map