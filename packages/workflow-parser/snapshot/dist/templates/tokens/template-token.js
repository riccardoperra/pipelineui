import { TraversalState } from "./traversal-state";
import { TokenType, tokenTypeName } from "./types";
export class TemplateTokenError extends Error {
    constructor(message, token) {
        super(message);
        this.token = token;
    }
}
export class TemplateToken {
    /**
     * Base class for all template tokens
     */
    constructor(type, file, range, definitionInfo) {
        this.type = type;
        this.file = file;
        this.range = range;
        this.definitionInfo = definitionInfo;
    }
    get templateTokenType() {
        return this.type;
    }
    get line() {
        return this.range?.start.line;
    }
    get col() {
        return this.range?.start.column;
    }
    get definition() {
        return this.definitionInfo?.definition;
    }
    get description() {
        return this._description || this.propertyDefinition?.description || this.definition?.description;
    }
    set description(description) {
        this._description = description;
    }
    typeName() {
        return tokenTypeName(this.type);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNull(objectDescription) {
        if (this.type === TokenType.Null) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.Null)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertBoolean(objectDescription) {
        if (this.type === TokenType.Boolean) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.Boolean)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNumber(objectDescription) {
        if (this.type === TokenType.Number) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.Number)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertString(objectDescription) {
        if (this.type === TokenType.String) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.String)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertScalar(objectDescription) {
        if (this?.isScalar === true) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type 'ScalarToken' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertSequence(objectDescription) {
        if (this.type === TokenType.Sequence) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.Sequence)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertMapping(objectDescription) {
        if (this.type === TokenType.Mapping) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${tokenTypeName(TokenType.Mapping)}' was expected.`, this);
    }
    /**
     * Returns all tokens (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit mapping keys
     */
    static *traverse(value, omitKeys) {
        yield [undefined, value, undefined];
        switch (value.templateTokenType) {
            case TokenType.Sequence:
            case TokenType.Mapping: {
                let state = new TraversalState(undefined, value);
                state = new TraversalState(state, value);
                while (state.parent) {
                    if (state.moveNext(omitKeys ?? false)) {
                        value = state.current;
                        yield [state.parent?.current, value, state.currentKey];
                        switch (value.type) {
                            case TokenType.Sequence:
                            case TokenType.Mapping:
                                state = new TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
    toJSON() {
        return undefined;
    }
}
//# sourceMappingURL=template-token.js.map