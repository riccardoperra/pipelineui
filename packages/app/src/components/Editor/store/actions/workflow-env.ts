import {Pair, Scalar} from 'yaml';
import {WorkflowStructureEnvItem} from '../editor.types';
import {YAMLSession} from '../plugins/yamlSession';
import {convertEnvItemFieldToYaml, modifyEnvField} from './helper';

export const setEnvironmentVariable =
  (yamlSession: YAMLSession) =>
  (index: number, envItem: WorkflowStructureEnvItem) => {
    yamlSession.updater(yaml => {
      modifyEnvField(yaml, true, env => {
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

export const deleteEnvironmentVariable =
  (yamlSession: YAMLSession) => (index: number) => {
    yamlSession.updater(yaml => {
      modifyEnvField(yaml, true, env => {
        const updatedItems = env.items.toSpliced(index, 1);
        env.items = updatedItems;
        if (updatedItems.length === 0) {
          yaml.delete('env');
        }
      });
    });
  };
