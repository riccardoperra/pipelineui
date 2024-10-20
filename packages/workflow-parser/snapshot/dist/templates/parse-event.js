export class ParseEvent {
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}
export var EventType;
(function (EventType) {
    EventType[EventType["Literal"] = 0] = "Literal";
    EventType[EventType["SequenceStart"] = 1] = "SequenceStart";
    EventType[EventType["SequenceEnd"] = 2] = "SequenceEnd";
    EventType[EventType["MappingStart"] = 3] = "MappingStart";
    EventType[EventType["MappingEnd"] = 4] = "MappingEnd";
    EventType[EventType["DocumentStart"] = 5] = "DocumentStart";
    EventType[EventType["DocumentEnd"] = 6] = "DocumentEnd";
})(EventType || (EventType = {}));
//# sourceMappingURL=parse-event.js.map