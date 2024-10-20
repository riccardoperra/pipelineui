import { isCollection, isDocument, isMap, isPair, isScalar, isSeq, LineCounter, parseDocument } from "yaml";
import { EventType, ParseEvent } from "../templates/parse-event";
import { BooleanToken, MappingToken, NullToken, NumberToken, SequenceToken, StringToken } from "../templates/tokens/index";
export class YamlObjectReader {
    constructor(fileId, content) {
        this.lineCounter = new LineCounter();
        this.errors = [];
        const doc = parseDocument(content, {
            lineCounter: this.lineCounter,
            keepSourceTokens: true,
            uniqueKeys: false // Uniqueness is validated by the template reader
        });
        for (const err of doc.errors) {
            this.errors.push({ message: err.message, range: rangeFromLinePos(err.linePos) });
        }
        this._generator = this.getNodes(doc);
        this.fileId = fileId;
    }
    *getNodes(node) {
        let range = this.getRange(node);
        if (isDocument(node)) {
            yield new ParseEvent(EventType.DocumentStart);
            for (const item of this.getNodes(node.contents)) {
                yield item;
            }
            yield new ParseEvent(EventType.DocumentEnd);
        }
        if (isCollection(node)) {
            if (isSeq(node)) {
                yield new ParseEvent(EventType.SequenceStart, new SequenceToken(this.fileId, range, undefined));
            }
            else if (isMap(node)) {
                yield new ParseEvent(EventType.MappingStart, new MappingToken(this.fileId, range, undefined));
            }
            for (const item of node.items) {
                for (const child of this.getNodes(item)) {
                    yield child;
                }
            }
            if (isSeq(node)) {
                yield new ParseEvent(EventType.SequenceEnd);
            }
            else if (isMap(node)) {
                yield new ParseEvent(EventType.MappingEnd);
            }
        }
        if (isScalar(node)) {
            yield new ParseEvent(EventType.Literal, YamlObjectReader.getLiteralToken(this.fileId, range, node));
        }
        if (isPair(node)) {
            const scalarKey = node.key;
            range = this.getRange(scalarKey);
            const key = scalarKey.value;
            yield new ParseEvent(EventType.Literal, new StringToken(this.fileId, range, key, undefined));
            for (const child of this.getNodes(node.value)) {
                yield child;
            }
        }
    }
    getRange(node) {
        const range = node?.range ?? [];
        const startPos = range[0];
        const endPos = range[1];
        if (startPos !== undefined && endPos !== undefined) {
            const slp = this.lineCounter.linePos(startPos);
            const elp = this.lineCounter.linePos(endPos);
            return {
                start: { line: slp.line, column: slp.col },
                end: { line: elp.line, column: elp.col }
            };
        }
        return undefined;
    }
    static getLiteralToken(fileId, range, token) {
        const value = token.value;
        if (value === null || value === undefined) {
            return new NullToken(fileId, range, undefined);
        }
        switch (typeof value) {
            case "number":
                return new NumberToken(fileId, range, value, undefined);
            case "boolean":
                return new BooleanToken(fileId, range, value, undefined);
            case "string": {
                let source;
                if (token.srcToken && "source" in token.srcToken) {
                    source = token.srcToken.source;
                }
                return new StringToken(fileId, range, value, undefined, source);
            }
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
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
        if (!this._current) {
            this._current = this._generator.next();
        }
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === EventType.DocumentStart) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
}
function rangeFromLinePos(linePos) {
    if (linePos === undefined) {
        return;
    }
    // TokenRange and linePos are both 1-based
    const start = { line: linePos[0].line, column: linePos[0].col };
    const end = linePos.length == 2 ? { line: linePos[1].line, column: linePos[1].col } : start;
    return { start, end };
}
//# sourceMappingURL=yaml-object-reader.js.map