import { EventType, ParseEvent } from "./parse-event";
import { SequenceToken, MappingToken, NullToken, BooleanToken, NumberToken, StringToken } from "./tokens";
export class JSONObjectReader {
    constructor(fileId, input) {
        this._fileId = fileId;
        const value = JSON.parse(input);
        this._generator = this.getParseEvents(value, true);
        this._current = this._generator.next();
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.Literal) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.SequenceStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.SequenceEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.MappingStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.MappingEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.DocumentEnd) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.DocumentStart) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
    /**
     * Returns all tokens (depth first)
     */
    *getParseEvents(value, root) {
        if (root) {
            yield new ParseEvent(EventType.DocumentStart, undefined);
        }
        switch (typeof value) {
            case "undefined":
                yield new ParseEvent(EventType.Literal, new NullToken(this._fileId, undefined, undefined));
                break;
            case "boolean":
                yield new ParseEvent(EventType.Literal, new BooleanToken(this._fileId, undefined, value, undefined));
                break;
            case "number":
                yield new ParseEvent(EventType.Literal, new NumberToken(this._fileId, undefined, value, undefined));
                break;
            case "string":
                yield new ParseEvent(EventType.Literal, new StringToken(this._fileId, undefined, value, undefined));
                break;
            case "object":
                // null
                if (value === null) {
                    yield new ParseEvent(EventType.Literal, new NullToken(this._fileId, undefined, undefined));
                }
                // array
                else if (Array.isArray(value)) {
                    yield new ParseEvent(EventType.SequenceStart, new SequenceToken(this._fileId, undefined, undefined));
                    for (const item of value) {
                        for (const e of this.getParseEvents(item)) {
                            yield e;
                        }
                    }
                    yield new ParseEvent(EventType.SequenceEnd, undefined);
                }
                // object
                else {
                    yield new ParseEvent(EventType.MappingStart, new MappingToken(this._fileId, undefined, undefined));
                    for (const key of Object.keys(value)) {
                        yield new ParseEvent(EventType.Literal, new StringToken(this._fileId, undefined, key, undefined));
                        for (const e of this.getParseEvents(value[key])) {
                            yield e;
                        }
                    }
                    yield new ParseEvent(EventType.MappingEnd, undefined);
                }
                break;
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
        if (root) {
            yield new ParseEvent(EventType.DocumentEnd, undefined);
        }
    }
}
//# sourceMappingURL=json-object-reader.js.map