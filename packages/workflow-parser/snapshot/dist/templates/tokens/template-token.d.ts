import { BooleanToken, MappingToken, NullToken, NumberToken, ScalarToken, SequenceToken, StringToken } from ".";
import { Definition } from "../schema/definition";
import { DefinitionInfo } from "../schema/definition-info";
import { PropertyDefinition } from "../schema/property-definition";
import { SerializedToken } from "./serialization";
import { TokenRange } from "./token-range";
import { TokenType } from "./types";
export declare class TemplateTokenError extends Error {
    readonly token?: TemplateToken | undefined;
    constructor(message: string, token?: TemplateToken | undefined);
}
export declare abstract class TemplateToken {
    private readonly type;
    private _description;
    readonly file: number | undefined;
    readonly range: TokenRange | undefined;
    definitionInfo: DefinitionInfo | undefined;
    propertyDefinition: PropertyDefinition | undefined;
    /**
     * Base class for all template tokens
     */
    constructor(type: TokenType, file: number | undefined, range: TokenRange | undefined, definitionInfo: DefinitionInfo | undefined);
    get templateTokenType(): number;
    get line(): number | undefined;
    get col(): number | undefined;
    get definition(): Definition | undefined;
    get description(): string | undefined;
    set description(description: string | undefined);
    abstract get isScalar(): boolean;
    abstract get isLiteral(): boolean;
    abstract get isExpression(): boolean;
    abstract clone(omitSource?: boolean): TemplateToken;
    typeName(): string;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNull(objectDescription: string): NullToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertBoolean(objectDescription: string): BooleanToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNumber(objectDescription: string): NumberToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertString(objectDescription: string): StringToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertScalar(objectDescription: string): ScalarToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertSequence(objectDescription: string): SequenceToken;
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertMapping(objectDescription: string): MappingToken;
    /**
     * Returns all tokens (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit mapping keys
     */
    static traverse(value: TemplateToken, omitKeys?: boolean): Generator<[parent: TemplateToken | undefined, token: TemplateToken, keyToken: TemplateToken | undefined], void>;
    toJSON(): SerializedToken;
}
//# sourceMappingURL=template-token.d.ts.map