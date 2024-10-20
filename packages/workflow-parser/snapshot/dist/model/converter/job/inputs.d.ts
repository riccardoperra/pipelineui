import { TemplateContext } from "../../../templates/template-context";
import { MappingToken, TemplateToken } from "../../../templates/tokens";
import { ReusableWorkflowJob } from "../../workflow-template";
type TokenMap = Map<string, [key: string, value: TemplateToken]>;
export declare function convertWorkflowJobInputs(context: TemplateContext, job: ReusableWorkflowJob): void;
export declare function createTokenMap(mapping: MappingToken | undefined, description: string): TokenMap | undefined;
export {};
//# sourceMappingURL=inputs.d.ts.map