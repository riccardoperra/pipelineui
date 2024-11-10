import {YAMLSeq} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';

export const setJobNeeds =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, needs: string[]) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job.has('needs') && needs.length > 0) {
        const seq = new YAMLSeq();
        needs.forEach(need => seq.add(need));
        job.set('needs', seq);
      } else {
        if (needs.length === 0) {
          job.delete('needs');
        } else {
          const needsSeq = job.get('needs') as YAMLSeq;
          const jsonSeq = needsSeq.toJSON();
          for (let i = 0; i < jsonSeq.length; i++) {
            needsSeq.delete(0);
          }
          needs.forEach(need => needsSeq.add(need));
        }
      }
    });
  };
