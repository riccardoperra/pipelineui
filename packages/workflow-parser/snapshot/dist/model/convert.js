import { TemplateTokenError } from "../templates/tokens/template-token";
import { parseFileReference } from "../workflows/file-reference";
import { parseWorkflow } from "../workflows/workflow-parser";
import { convertConcurrency } from "./converter/concurrency";
import { convertOn } from "./converter/events";
import { handleTemplateTokenErrors } from "./converter/handle-errors";
import { convertJobs } from "./converter/jobs";
import { convertReferencedWorkflow } from "./converter/referencedWorkflow";
import { isReusableWorkflowJob } from "./type-guards";
export var ErrorPolicy;
(function (ErrorPolicy) {
    ErrorPolicy[ErrorPolicy["ReturnErrorsOnly"] = 0] = "ReturnErrorsOnly";
    ErrorPolicy[ErrorPolicy["TryConversion"] = 1] = "TryConversion";
})(ErrorPolicy || (ErrorPolicy = {}));
const defaultOptions = {
    maxReusableWorkflowDepth: 4,
    fetchReusableWorkflowDepth: 0,
    errorPolicy: ErrorPolicy.ReturnErrorsOnly
};
export async function convertWorkflowTemplate(context, root, fileProvider, options = defaultOptions) {
    const result = {};
    const opts = getOptionsWithDefaults(options);
    if (context.errors.getErrors().length > 0 && opts.errorPolicy === ErrorPolicy.ReturnErrorsOnly) {
        result.errors = context.errors.getErrors().map(x => ({
            Message: x.message
        }));
        return result;
    }
    if (fileProvider === undefined && opts.fetchReusableWorkflowDepth > 0) {
        context.error(root, new Error("A file provider is required to fetch reusable workflows"));
    }
    try {
        const rootMapping = root.assertMapping("root");
        for (const item of rootMapping) {
            const key = item.key.assertString("root key");
            switch (key.value) {
                case "on":
                    result.events = handleTemplateTokenErrors(root, context, {}, () => convertOn(context, item.value));
                    break;
                case "jobs":
                    result.jobs = handleTemplateTokenErrors(root, context, [], () => convertJobs(context, item.value));
                    break;
                case "concurrency":
                    handleTemplateTokenErrors(root, context, {}, () => convertConcurrency(context, item.value));
                    result.concurrency = item.value;
                    break;
                case "env":
                    result.env = item.value;
                    break;
            }
        }
        // Load referenced workflows
        for (const job of result.jobs || []) {
            if (isReusableWorkflowJob(job)) {
                if (opts.maxReusableWorkflowDepth === 0) {
                    context.error(job.ref, new Error("Reusable workflows are not allowed"));
                    continue;
                }
                if (opts.fetchReusableWorkflowDepth === 0 || fileProvider === undefined) {
                    continue;
                }
                try {
                    const file = await fileProvider.getFileContent(parseFileReference(job.ref.value));
                    const workflow = parseWorkflow(file, context);
                    if (!workflow.value) {
                        continue;
                    }
                    convertReferencedWorkflow(context, workflow.value, job);
                }
                catch {
                    context.error(job.ref, new Error("Unable to find reusable workflow"));
                }
            }
        }
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
    finally {
        if (context.errors.getErrors().length > 0) {
            result.errors = context.errors.getErrors().map(x => ({
                Message: x.message
            }));
        }
    }
    return result;
}
function getOptionsWithDefaults(options) {
    return {
        maxReusableWorkflowDepth: options.maxReusableWorkflowDepth !== undefined
            ? options.maxReusableWorkflowDepth
            : defaultOptions.maxReusableWorkflowDepth,
        fetchReusableWorkflowDepth: options.fetchReusableWorkflowDepth !== undefined
            ? options.fetchReusableWorkflowDepth
            : defaultOptions.fetchReusableWorkflowDepth,
        errorPolicy: options.errorPolicy !== undefined ? options.errorPolicy : defaultOptions.errorPolicy
    };
}
//# sourceMappingURL=convert.js.map