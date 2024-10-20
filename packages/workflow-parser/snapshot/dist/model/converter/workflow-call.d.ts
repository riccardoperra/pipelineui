import { TemplateContext } from "../../templates/template-context";
import { MappingToken } from "../../templates/tokens";
import { WorkflowCallConfig, InputConfig } from "../workflow-template";
export declare function convertEventWorkflowCall(context: TemplateContext, token: MappingToken): WorkflowCallConfig;
export declare function convertWorkflowInputs(context: TemplateContext, token: MappingToken): {
    [inputName: string]: InputConfig;
};
export declare function convertWorkflowInput(context: TemplateContext, token: MappingToken): InputConfig;
//# sourceMappingURL=workflow-call.d.ts.map