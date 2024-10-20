import { TemplateContext } from "../templates/template-context";
import { TemplateToken } from "../templates/tokens/template-token";
import { FileProvider } from "../workflows/file-provider";
import { WorkflowTemplate } from "./workflow-template";
export declare enum ErrorPolicy {
    ReturnErrorsOnly = 0,
    TryConversion = 1
}
export type WorkflowTemplateConverterOptions = {
    /**
     * The maximum depth of reusable workflows allowed in the workflow.
     * If this depth is exceeded, an error will be reported.
     * If {@link fetchReusableWorkflowDepth} is less than this value, the maximum depth
     * won't be enforced.
     * Default: 4
     */
    maxReusableWorkflowDepth?: number;
    /**
     * The depth to fetch reusable workflows, up to {@link maxReusableWorkflowDepth}.
     * Currently only a fetch depth of 0 or 1 is supported.
     * Default: 0
     */
    fetchReusableWorkflowDepth?: number;
    /**
     * The error policy to use when converting the workflow.
     * By default, conversion will be skipped if there are errors in the {@link TemplateContext}.
     */
    errorPolicy?: ErrorPolicy;
};
export declare function convertWorkflowTemplate(context: TemplateContext, root: TemplateToken, fileProvider?: FileProvider, options?: WorkflowTemplateConverterOptions): Promise<WorkflowTemplate>;
//# sourceMappingURL=convert.d.ts.map