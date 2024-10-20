import { TemplateContext } from "../templates/template-context";
import { TemplateToken } from "../templates/tokens/template-token";
import { TraceWriter } from "../templates/trace-writer";
import { File } from "./file";
export interface ParseWorkflowResult {
    context: TemplateContext;
    value: TemplateToken | undefined;
}
export declare function parseWorkflow(entryFile: File, trace: TraceWriter): ParseWorkflowResult;
export declare function parseWorkflow(entryFile: File, context: TemplateContext): ParseWorkflowResult;
//# sourceMappingURL=workflow-parser.d.ts.map