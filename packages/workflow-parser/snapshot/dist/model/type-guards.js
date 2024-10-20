export function isRunStep(step) {
    return step.run !== undefined;
}
export function isActionStep(step) {
    return step.uses !== undefined;
}
export function isJob(job) {
    return job.type === "job";
}
export function isReusableWorkflowJob(job) {
    return job.type === "reusableWorkflowJob";
}
//# sourceMappingURL=type-guards.js.map