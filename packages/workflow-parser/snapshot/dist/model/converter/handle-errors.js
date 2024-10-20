import { TemplateTokenError } from "../../templates/tokens/template-token";
export function handleTemplateTokenErrors(root, context, defaultValue, f) {
    let r = defaultValue;
    try {
        r = f();
    }
    catch (err) {
        if (err instanceof TemplateTokenError) {
            context.error(err.token, err);
        }
        else {
            // Report error for the root node
            context.error(root, err);
        }
    }
    return r;
}
//# sourceMappingURL=handle-errors.js.map