import { ActionStep, Job, ReusableWorkflowJob, RunStep, Step, WorkflowJob } from "./workflow-template";
export declare function isRunStep(step: Step): step is RunStep;
export declare function isActionStep(step: Step): step is ActionStep;
export declare function isJob(job: WorkflowJob): job is Job;
export declare function isReusableWorkflowJob(job: WorkflowJob): job is ReusableWorkflowJob;
//# sourceMappingURL=type-guards.d.ts.map