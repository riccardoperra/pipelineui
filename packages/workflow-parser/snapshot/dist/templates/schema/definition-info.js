export class DefinitionInfo {
    constructor(schemaOrParent, nameOrDefinition) {
        this.isDefinitionInfo = true;
        const parent = schemaOrParent?.isDefinitionInfo === true
            ? schemaOrParent
            : undefined;
        this._schema = parent === undefined ? schemaOrParent : parent._schema;
        // Lookup the definition if a key was passed in
        this.definition =
            typeof nameOrDefinition === "string" ? this._schema.getDefinition(nameOrDefinition) : nameOrDefinition;
        // Record allowed context
        if (this.definition.readerContext.length > 0) {
            this.allowedContext = [];
            // Copy parent allowed context
            const upperSeen = {};
            for (const context of parent?.allowedContext ?? []) {
                this.allowedContext.push(context);
                upperSeen[context.toUpperCase()] = true;
            }
            // Append context if unseen
            for (const context of this.definition.readerContext) {
                const upper = context.toUpperCase();
                if (!upperSeen[upper]) {
                    this.allowedContext.push(context);
                    upperSeen[upper] = true;
                }
            }
        }
        else {
            this.allowedContext = parent?.allowedContext ?? [];
        }
    }
    getScalarDefinitions() {
        return this._schema.getScalarDefinitions(this.definition);
    }
    getDefinitionsOfType(type) {
        return this._schema.getDefinitionsOfType(this.definition, type);
    }
}
//# sourceMappingURL=definition-info.js.map