import { TokenType } from "./types";
export class TraversalState {
    constructor(parent, token) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._token = token;
        this.current = token;
    }
    moveNext(omitKeys) {
        switch (this._token.templateTokenType) {
            case TokenType.Sequence: {
                const sequence = this._token;
                if (++this.index < sequence.count) {
                    this.current = sequence.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case TokenType.Mapping: {
                const mapping = this._token;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.currentKey = this.current;
                    this.current = mapping.get(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < mapping.count) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.currentKey = mapping.get(this.index).key;
                        this.current = mapping.get(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.currentKey = undefined;
                    this.current = mapping.get(this.index).key;
                    return true;
                }
                this.currentKey = undefined;
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected token type '${this._token.templateTokenType}' when traversing state`);
        }
    }
}
//# sourceMappingURL=traversal-state.js.map