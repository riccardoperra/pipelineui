import { TemplateValidationError } from "./template-validation-error";
/**
 * Context object that is flowed through while loading and evaluating object templates
 */
export class TemplateContext {
    constructor(errors, schema, trace) {
        this._fileIds = {};
        this._fileNames = [];
        /**
         * Available functions within expression contexts
         */
        this.expressionFunctions = [];
        /**
         * Available values within expression contexts
         */
        this.expressionNamedContexts = [];
        this.state = {};
        this.errors = errors;
        this.schema = schema;
        this.trace = trace;
    }
    error(tokenOrFileId, err, tokenRange) {
        const token = tokenOrFileId;
        const range = tokenRange || token?.range;
        const prefix = this.getErrorPrefix(token?.file ?? tokenOrFileId, token?.line, token?.col);
        const message = err?.message ?? String(err);
        const e = new TemplateValidationError(message, prefix, undefined, range);
        this.errors.add(e);
        this.trace.error(e.message);
    }
    /**
     * Gets or adds the file ID
     */
    getFileId(file) {
        const key = file.toUpperCase();
        let id = this._fileIds[key];
        if (id === undefined) {
            id = this._fileNames.length + 1;
            this._fileIds[key] = id;
            this._fileNames.push(file);
        }
        return id;
    }
    /**
     * Looks up a file name by ID. Returns undefined if not found.
     */
    getFileName(fileId) {
        return this._fileNames.length >= fileId ? this._fileNames[fileId - 1] : undefined;
    }
    /**
     * Gets a copy of the file table
     */
    getFileTable() {
        return this._fileNames.slice();
    }
    getErrorPrefix(fileId, line, column) {
        const fileName = fileId !== undefined ? this.getFileName(fileId) : undefined;
        if (fileName) {
            if (line !== undefined && column !== undefined) {
                return `${fileName} (Line: ${line}, Col: ${column})`;
            }
            else {
                return fileName;
            }
        }
        else if (line !== undefined && column !== undefined) {
            return `(Line: ${line}, Col: ${column})`;
        }
        else {
            return "";
        }
    }
}
/**
 * Provides information about errors which occurred during validation
 */
export class TemplateValidationErrors {
    constructor(maxErrors, maxMessageLength) {
        this._errors = [];
        this._maxErrors = maxErrors ?? 0;
        this._maxMessageLength = maxMessageLength ?? 0;
    }
    get count() {
        return this._errors.length;
    }
    add(err) {
        for (let e of Array.isArray(err) ? err : [err]) {
            // Check max errors
            if (this._maxErrors <= 0 || this._errors.length < this._maxErrors) {
                // Check max message length
                if (this._maxMessageLength > 0 && e.message.length > this._maxMessageLength) {
                    e = new TemplateValidationError(e.message.substring(0, this._maxMessageLength) + "[...]", e.prefix, e.code, e.range);
                }
                this._errors.push(e);
            }
        }
    }
    /**
     * Throws if any errors
     * @param prefix The error message prefix
     */
    check(prefix) {
        if (this._errors.length <= 0) {
            return;
        }
        if (!prefix) {
            prefix = "The template is not valid.";
        }
        throw new Error(`${prefix} ${this._errors.map(x => x.message).join(",")}`);
    }
    clear() {
        this._errors = [];
    }
    getErrors() {
        return this._errors.slice();
    }
}
//# sourceMappingURL=template-context.js.map