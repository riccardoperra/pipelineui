import { TemplateToken } from "./tokens";
export declare class ParseEvent {
    readonly type: EventType;
    readonly token: TemplateToken | undefined;
    constructor(type: EventType, token?: TemplateToken | undefined);
}
export declare enum EventType {
    Literal = 0,
    SequenceStart = 1,
    SequenceEnd = 2,
    MappingStart = 3,
    MappingEnd = 4,
    DocumentStart = 5,
    DocumentEnd = 6
}
//# sourceMappingURL=parse-event.d.ts.map