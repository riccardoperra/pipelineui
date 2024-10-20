import { JSONObjectReader } from "../templates/json-object-reader";
import { TemplateSchema } from "../templates/schema";
import WorkflowSchema from "../workflow-v1.0.json" assert { type: "json" };
let schema;
export function getWorkflowSchema() {
    if (schema === undefined) {
        const json = JSON.stringify(WorkflowSchema);
        schema = TemplateSchema.load(new JSONObjectReader(undefined, json));
    }
    return schema;
}
//# sourceMappingURL=workflow-schema.js.map