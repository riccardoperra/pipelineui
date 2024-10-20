export declare class IdBuilder {
    private name;
    private readonly distinctNames;
    appendSegment(value: string): void;
    build(): string;
    /**
     * Adds a known identifier to the set of distinct ids.
     * @param value The value to add
     * @returns An error if the value is invalid, otherwise undefined
     */
    tryAddKnownId(value: string): string | undefined;
    /**
     * A name is valid if it starts with a letter or underscore, and contains only
     * letters, numbers, underscores, and hyphens.
     * @param name The string name to validate
     * @returns Whether the name is valid
     */
    private isValid;
    private isAlphaNumeric;
    private isNumeric;
    private isAlpha;
}
//# sourceMappingURL=id-builder.d.ts.map