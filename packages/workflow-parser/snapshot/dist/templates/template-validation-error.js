/**
 * Provides information about an error which occurred during validation
 */
export class TemplateValidationError {
    constructor(rawMessage, prefix, code, range) {
        this.rawMessage = rawMessage;
        this.prefix = prefix;
        this.code = code;
        this.range = range;
    }
    get message() {
        if (this.prefix) {
            return `${this.prefix}: ${this.rawMessage}`;
        }
        return this.rawMessage;
    }
    toString() {
        return this.message;
    }
}
//# sourceMappingURL=template-validation-error.js.map