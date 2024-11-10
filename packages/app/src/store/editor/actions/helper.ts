import * as YAML from 'yaml';
import {YAMLDocument} from '../plugins/yamlSession';
import {StringExpression, WorkflowStructureEnvItem} from '../editor.types';

export const modifyEnvField = (
  yaml: YAMLDocument | YAML.YAMLMap,
  createIfNotExists: boolean = true,
  updater: (on: YAML.YAMLMap<YAML.Scalar<string>>) => void,
) => {
  let envField = yaml.get('env') as YAML.YAMLMap<YAML.Scalar<string>>;
  if (!envField) {
    if (!createIfNotExists) {
      console.warn('`env` field missing. Skipping update.');
      return;
    }
    envField = new YAML.YAMLMap();
    yaml.set(new YAML.Scalar('env'), envField);
  }
  updater(envField);
};

export const modifyOnField = (
  yaml: YAMLDocument,
  createIfNotExists: boolean = true,
  updater: (on: YAML.YAMLMap<YAML.Scalar<string>, YAML.YAMLMap | null>) => void,
) => {
  let onField = yaml.get('on') as YAML.YAMLMap<
    YAML.Scalar<string>,
    YAML.YAMLMap<YAML.Scalar<string>, YAML.YAMLMap>
  >;
  if (!onField) {
    if (!createIfNotExists) {
      console.warn('`on` field missing. Skipping update.');
      return;
    }
    onField = new YAML.YAMLMap();
    yaml.set(new YAML.Scalar('on'), onField);
  }
  updater(onField);
};

const jobPropertiesOrder = [
  'name',
  'permissions',
  'needs',
  'if',
  'runs-on',
  'environment',
  'concurrency',
  'outputs',
  'env',
  'defaults',
  'steps',
  'timeout-minutes',
  'strategy',
  'continue-on-error',
  'container',
  'services',
  'uses',
  'with',
  'secrets',
];

const jobProxyHandler: ProxyHandler<YAML.YAMLMap> = {
  get(target, p, receiver) {
    const result = Reflect.get(target, p, receiver);
    if (p === 'set' || p === 'delete') {
      const patchedFn = (...args: any[]) => {
        const setResult = result.bind(target)(...args);
        // While setting or deleting job properties, reorder items
        target.items = target.items.sort((a, b) =>
          orderYamlMapItemByKey(
            jobPropertiesOrder,
            a as YAML.Pair<YAML.ParsedNode, YAML.ParsedNode>,
            b as YAML.Pair<YAML.ParsedNode, YAML.ParsedNode>,
          ),
        );
        return setResult;
      };
      return patchedFn.bind(target);
    }
    return result;
  },
};

export const findJob = (yaml: YAMLDocument, jobId: number | string) => {
  const jobs = yaml.get('jobs') as YAML.YAMLMap<string, YAML.YAMLMap>;
  let job: YAML.YAMLMap<unknown, unknown> | null | undefined;
  if (typeof jobId === 'number') {
    job = jobs.items[jobId]?.value;
  } else {
    job = jobs.get(jobId);
  }
  if (!job) {
    return job;
  }
  return new Proxy(job, jobProxyHandler);
};

export const findJobStep = (jobYaml: YAML.YAMLMap, stepIndex: number) => {
  const steps = jobYaml.get('steps') as YAML.YAMLSeq<YAML.YAMLMap> | undefined;
  if (!steps) {
    return null;
  }
  return steps.get(stepIndex);
};

export const convertEnvItemFieldToYaml = (
  envItem: WorkflowStructureEnvItem,
) => {
  let value: unknown;
  if (
    envItem.type === 'string' ||
    envItem.type === 'number' ||
    envItem.type === 'boolean'
  ) {
    value = new YAML.Scalar(String(envItem.value));
  } else if (envItem.type === 'expression') {
    // TODO parse value?
    value = new YAML.Scalar(envItem.value as StringExpression).value;
  }
  return value;
};

export function removeObjectYamlPrivateProperties(object: Record<string, any>) {
  const clone = structuredClone(object);
  for (const key in clone) {
    if (key[0] === '$') {
      delete clone[key];
    }
  }
  return clone;
}

export function orderYamlMapItemByKey(
  order: string[],
  a: YAML.Pair<YAML.ParsedNode, YAML.ParsedNode | null>,
  b: YAML.Pair<YAML.ParsedNode, YAML.ParsedNode | null>,
): number {
  const indexA = order.indexOf(a.key.toString());
  const indexB = order.indexOf(b.key.toString());
  if (indexA === -1 && indexB === -1) return 0;
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
}
