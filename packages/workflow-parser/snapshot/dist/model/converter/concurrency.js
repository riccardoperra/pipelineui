import { isString } from "../../templates/tokens/type-guards";
export function convertConcurrency(context, token) {
    const result = {};
    if (token.isExpression) {
        return result;
    }
    if (isString(token)) {
        result.group = token;
        return result;
    }
    const concurrencyProperty = token.assertMapping("concurrency group");
    for (const property of concurrencyProperty) {
        const propertyName = property.key.assertString("concurrency group key");
        if (property.key.isExpression || property.value.isExpression) {
            continue;
        }
        switch (propertyName.value) {
            case "group":
                result.group = property.value.assertString("concurrency group");
                break;
            case "cancel-in-progress":
                result.cancelInProgress = property.value.assertBoolean("cancel-in-progress").value;
                break;
            default:
                context.error(propertyName, `Invalid property name: ${propertyName.value}`);
        }
    }
    return result;
}
//# sourceMappingURL=concurrency.js.map