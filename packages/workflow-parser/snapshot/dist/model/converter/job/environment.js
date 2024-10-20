import { isScalar } from "../../../templates/tokens/type-guards";
export function convertToActionsEnvironmentRef(context, token) {
    const result = {};
    if (token.isExpression) {
        return result;
    }
    if (isScalar(token)) {
        result.name = token;
        return result;
    }
    const environmentMapping = token.assertMapping("job environment");
    for (const property of environmentMapping) {
        const propertyName = property.key.assertString("job environment key");
        if (property.key.isExpression || property.value.isExpression) {
            continue;
        }
        switch (propertyName.value) {
            case "name":
                result.name = property.value.assertScalar("job environment name key");
                break;
            case "url":
                result.url = property.value;
                break;
        }
    }
    return result;
}
//# sourceMappingURL=environment.js.map