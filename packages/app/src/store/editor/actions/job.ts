import {Pair, YAMLMap, YAMLSeq} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';

export const addNewJob = (yamlSession: YAMLSession) => () => {
  yamlSession.updater(yaml => {
    let jobs = yaml.get('jobs') as YAMLMap<string, YAMLMap> | null;
    if (!jobs) {
      jobs = new YAMLMap<string, YAMLMap<unknown, unknown>>();
      yaml.set('jobs', jobs);
    }
    const job = new YAMLMap();
    job.set('steps', new YAMLSeq());
    job.set('runs-on', null);
    const length = jobs.items.length;
    jobs.add(new Pair(`new_job_${length}`, job));
  });
};

export const removeJob = (yamlSession: YAMLSession) => (jobId: string) => {
  yamlSession.updater(yaml => {
    let jobs = yaml.get('jobs') as YAMLMap<string, YAMLMap> | null;
    if (!jobs) {
      return;
    }
    jobs.delete(jobId);
  });
};
