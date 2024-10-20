import { isLiteral, isMapping, isSequence, isString } from "../../templates/tokens/type-guards";
import { TokenType } from "../../templates/tokens/types";
import { isValidCron } from "./cron";
import { convertStringList } from "./string-list";
import { convertEventWorkflowCall } from "./workflow-call";
import { convertEventWorkflowDispatchInputs } from "./workflow-dispatch";
export function convertOn(context, token) {
    if (isLiteral(token)) {
        const event = token.assertString("on");
        return {
            [event.value]: {}
        };
    }
    if (isSequence(token)) {
        const result = {};
        for (const item of token) {
            const event = item.assertString("on");
            result[event.value] = {};
        }
        return result;
    }
    if (isMapping(token)) {
        const result = {};
        for (const item of token) {
            const eventKey = item.key.assertString("event name");
            const eventName = eventKey.value;
            if (item.value.templateTokenType === TokenType.Null) {
                result[eventName] = {};
                continue;
            }
            // Schedule is the only event that can be a sequence, handle that separately
            if (eventName === "schedule") {
                const scheduleToken = item.value.assertSequence(`event ${eventName}`);
                result.schedule = convertSchedule(context, scheduleToken);
                continue;
            }
            // All other events are defined as mappings. During schema validation we already ensure that events
            // receive only known keys, so here we can focus on the values and whether they are valid.
            const eventToken = item.value.assertMapping(`event ${eventName}`);
            if (eventName === "workflow_call") {
                result.workflow_call = convertEventWorkflowCall(context, eventToken);
                continue;
            }
            if (eventName === "workflow_dispatch") {
                result.workflow_dispatch = convertEventWorkflowDispatchInputs(context, eventToken);
                continue;
            }
            result[eventName] = {
                ...convertPatternFilter("branches", eventToken),
                ...convertPatternFilter("tags", eventToken),
                ...convertPatternFilter("paths", eventToken),
                ...convertFilter("types", eventToken),
                ...convertFilter("workflows", eventToken)
            };
        }
        return result;
    }
    context.error(token, "Invalid format for 'on'");
    return {};
}
function convertPatternFilter(name, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString(`${name} filter key`);
        switch (key.value) {
            case name:
                if (isString(item.value)) {
                    result[name] = [item.value.value];
                }
                else {
                    result[name] = convertStringList(name, item.value.assertSequence(`${name} list`));
                }
                break;
            case `${name}-ignore`:
                if (isString(item.value)) {
                    result[`${name}-ignore`] = [item.value.value];
                }
                else {
                    result[`${name}-ignore`] = convertStringList(`${name}-ignore`, item.value.assertSequence(`${name}-ignore list`));
                }
                break;
        }
    }
    return result;
}
function convertFilter(name, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString(`${name} filter key`);
        switch (key.value) {
            case name:
                if (isString(item.value)) {
                    result[name] = [item.value.value];
                }
                else {
                    result[name] = convertStringList(name, item.value.assertSequence(`${name} list`));
                }
                break;
        }
    }
    return result;
}
function convertSchedule(context, token) {
    const result = [];
    for (const item of token) {
        const mappingToken = item.assertMapping(`event schedule`);
        if (mappingToken.count == 1) {
            const schedule = mappingToken.get(0);
            const scheduleKey = schedule.key.assertString(`schedule key`);
            if (scheduleKey.value == "cron") {
                const cron = schedule.value.assertString(`schedule cron`);
                // Validate the cron string
                if (!isValidCron(cron.value)) {
                    context.error(cron, "Invalid cron string");
                }
                result.push({ cron: cron.value });
            }
            else {
                context.error(scheduleKey, `Invalid schedule key`);
            }
        }
        else {
            context.error(mappingToken, "Invalid format for 'schedule'");
        }
    }
    return result;
}
//# sourceMappingURL=events.js.map