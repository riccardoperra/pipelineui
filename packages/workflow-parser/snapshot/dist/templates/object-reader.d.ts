import { LiteralToken, SequenceToken, MappingToken } from "./tokens";
/**
 * Interface for reading a source object (or file).
 * This interface is used by TemplateReader to build a TemplateToken DOM.
 */
export interface ObjectReader {
    allowLiteral(): LiteralToken | undefined;
    allowSequenceStart(): SequenceToken | undefined;
    allowSequenceEnd(): boolean;
    allowMappingStart(): MappingToken | undefined;
    allowMappingEnd(): boolean;
    validateStart(): void;
    validateEnd(): void;
}
//# sourceMappingURL=object-reader.d.ts.map