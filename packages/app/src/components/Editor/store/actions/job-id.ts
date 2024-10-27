import {YAMLMap, Scalar} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';

export const setJobId =
  (yamlSession: YAMLSession) => (index: number, id: string) => {
    yamlSession.updater(yaml => {
      const jobs = yaml.get('jobs') as YAMLMap<Scalar<string>, YAMLMap>;
      const pair = jobs.items[index];
      if (pair) {
        pair.key = new Scalar(id);
      }
    });
  };
