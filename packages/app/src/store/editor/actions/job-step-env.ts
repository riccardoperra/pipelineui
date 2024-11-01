import {Pair, Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {
  convertEnvItemFieldToYaml,
  findJob,
  findJobStep,
  modifyEnvField,
} from './helper';
import {WorkflowStructureEnvItem} from '../editor.types';

export const setJobStepEnv =
  (yamlSession: YAMLSession) =>
  (
    jobIdOrIndex: string | number,
    stepIndex: number,
    index: number,
    envItem: WorkflowStructureEnvItem,
  ) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      const step = findJobStep(job, stepIndex);
      if (!step) {
        return false;
      }
      modifyEnvField(step, true, env => {
        const envAtIndex = env.items.at(index);
        if (!envItem.name) {
          console.warn('Missing `name` for env variable. Skipping update', {
            index,
            data: envItem,
          });
          return;
        }
        const value = convertEnvItemFieldToYaml(envItem);
        if (!envAtIndex) {
          env.add(new Pair(new Scalar(envItem.name), value));
        } else {
          envAtIndex.key = new Scalar<string>(envItem.name);
          envAtIndex.value = value;
        }
      });
    });
  };

export const deleteJobStepEnv =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number, index: number) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      const step = findJobStep(job, stepIndex);
      if (!step) {
        return false;
      }
      modifyEnvField(step, true, env => {
        const updatedItems = env.items.toSpliced(index, 1);
        env.items = updatedItems;
        if (updatedItems.length === 0) {
          step.delete('env');
        }
      });
    });
  };
