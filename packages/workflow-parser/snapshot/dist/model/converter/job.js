import { BasicExpressionToken } from "../../templates/tokens";
import { isSequence, isString } from "../../templates/tokens/type-guards";
import { convertConcurrency } from "./concurrency";
import { convertToJobContainer, convertToJobServices } from "./container";
import { handleTemplateTokenErrors } from "./handle-errors";
import { IdBuilder } from "./id-builder";
import { convertToActionsEnvironmentRef } from "./job/environment";
import { convertRunsOn } from "./job/runs-on";
import { convertSteps } from "./steps";
export function convertJob(context, jobKey, token) {
    const error = new IdBuilder().tryAddKnownId(jobKey.value);
    if (error) {
        context.error(jobKey, error);
    }
    let concurrency, container, env, environment, name, outputs, runsOn, services, strategy;
    let needs = undefined;
    let steps = [];
    let workflowJobRef;
    let workflowJobInputs;
    let inheritSecrets = false;
    let workflowJobSecrets;
    let ifValue = 'success()';
    for (const item of token) {
        const propertyName = item.key.assertString("job property name");
        switch (propertyName.value) {
            case "concurrency":
                handleTemplateTokenErrors(item.value, context, undefined, () => convertConcurrency(context, item.value));
                concurrency = item.value;
                break;
            case "container":
                convertToJobContainer(context, item.value);
                container = item.value;
                break;
            case "env":
                handleTemplateTokenErrors(item.value, context, undefined, () => {
                    env = item.value.assertMapping("job env");
                });
                break;
            case "environment":
                handleTemplateTokenErrors(item.value, context, undefined, () => convertToActionsEnvironmentRef(context, item.value));
                environment = item.value;
                break;
            case "name":
                name = item.value.assertScalar("job name");
                break;
            case "needs": {
                needs = [];
                if (isString(item.value)) {
                    const jobNeeds = item.value.assertString("job needs id");
                    needs.push(jobNeeds);
                }
                if (isSequence(item.value)) {
                    for (const seqItem of item.value) {
                        const jobNeeds = seqItem.assertString("job needs id");
                        needs.push(jobNeeds);
                    }
                }
                break;
            }
            case "outputs":
                handleTemplateTokenErrors(item.value, context, undefined, () => {
                    outputs = item.value.assertMapping("job outputs");
                });
                break;
            case "runs-on":
                handleTemplateTokenErrors(item.value, context, undefined, () => convertRunsOn(context, item.value));
                runsOn = item.value;
                break;
            case "services":
                convertToJobServices(context, item.value);
                services = item.value;
                break;
            case "steps":
                steps = convertSteps(context, item.value);
                break;
            case "strategy":
                strategy = item.value;
                break;
            case "uses":
                workflowJobRef = item.value.assertString("job uses value");
                break;
            case "with":
                handleTemplateTokenErrors(item.value, context, undefined, () => {
                    workflowJobInputs = item.value.assertMapping("uses-with value");
                });
                break;
            case "if": 
                handleTemplateTokenErrors(item.value, context, undefined, () => {
                    ifValue = item.value.expr;
                });
                break;    
            case "secrets":
                if (isString(item.value) && item.value.value === "inherit") {
                    inheritSecrets = true;
                }
                else {
                    handleTemplateTokenErrors(item.value, context, undefined, () => {
                        workflowJobSecrets = item.value.assertMapping("uses-secrets value");
                    });
                }
                break;
        }
    }
    if (workflowJobRef !== undefined) {
        return {
            type: "reusableWorkflowJob",
            id: jobKey,
            name: jobName(name, jobKey),
            needs: needs || [],
            if: new BasicExpressionToken(undefined, undefined, ifValue, undefined, undefined, undefined),
            ref: workflowJobRef,
            "input-definitions": undefined,
            "input-values": workflowJobInputs,
            "secret-definitions": undefined,
            "secret-values": workflowJobSecrets,
            "inherit-secrets": inheritSecrets || undefined,
            outputs: undefined,
            concurrency,
            strategy
        };
    }
    else {
        return {
            type: "job",
            id: jobKey,
            name: jobName(name, jobKey),
            needs,
            if: new BasicExpressionToken(undefined, undefined, ifValue, undefined, undefined, undefined),
            env,
            concurrency,
            environment,
            strategy,
            "runs-on": runsOn,
            container,
            services,
            outputs,
            steps
        };
    }
}
function jobName(name, jobKey) {
    if (name === undefined) {
        return jobKey;
    }
    if (isString(name) && name.value === "") {
        return jobKey;
    }
    return name;
}
//# sourceMappingURL=job.js.map