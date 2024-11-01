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

export const findJob = (yaml: YAMLDocument, jobId: number | string) => {
  const jobs = yaml.get('jobs') as YAML.YAMLMap<string, YAML.YAMLMap>;
  if (typeof jobId === 'number') {
    return jobs.items[jobId]?.value;
  } else {
    return jobs.get(jobId);
  }
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
