import {Pair, Scalar} from 'yaml';
import {WorkflowStructureEnvItem} from '../../../components/Editor/store/editor.types';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob, modifyEnvField, convertEnvItemFieldToYaml} from './helper';

export const setJobEnv =
  (yamlSession: YAMLSession) =>
  (
    jobIdOrIndex: string | number,
    index: number,
    envItem: WorkflowStructureEnvItem,
  ) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      modifyEnvField(job, true, env => {
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

export const deleteJobEnv =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, index: number) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      modifyEnvField(job, true, env => {
        const updatedItems = env.items.toSpliced(index, 1);
        env.items = updatedItems;
        if (updatedItems.length === 0) {
          job.delete('env');
        }
      });
    });
  };
