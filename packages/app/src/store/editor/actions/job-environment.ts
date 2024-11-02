import {Scalar, YAMLMap} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';
import {JobEnvironment} from '../editor.types';

export const setJobEnvironment =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, environment: JobEnvironment) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (environment.type === 'value') {
        if (!environment.name) {
          job.delete('environment');
          return;
        }
        job.set('environment', new Scalar(environment.name));
      } else {
        const node = new YAMLMap();
        node.set('name', environment.name);
        node.set('url', environment.url);
        job.set('environment', node);
      }
    });
  };
