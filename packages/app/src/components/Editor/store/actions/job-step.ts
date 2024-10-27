import {YAMLSeq, YAMLMap, Pair} from 'yaml';
import {WorkflowStructureJobStep} from '../editor.types';
import {YAMLSession} from '../plugins/yamlSession';
import {findJob} from './helper';

export const addNewJobStep =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, newStep: WorkflowStructureJobStep) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      let steps: YAMLSeq<YAMLMap>;
      if (!job.has('steps')) {
        steps = new YAMLSeq<YAMLMap<unknown, unknown>>(yaml.schema);
        job.set('steps', steps);
      } else {
        steps = job.get('steps') as YAMLSeq<YAMLMap>;
      }
      const step = new YAMLMap(yaml.schema);
      step.add(new Pair('name', newStep.name));
      if ('run' in newStep) {
        step.add(new Pair('run', newStep.run ?? ''));
      }
      steps.add(step);
    });
  };

export const deleteJobStep =
  (yamlSession: YAMLSession) =>
  (jobIdOrIndex: string | number, stepIndex: number) => {
    yamlSession.updater(yaml => {
      const job = findJob(yaml, jobIdOrIndex)!;
      if (!job) {
        return false;
      }
      job.items = job.items.toSpliced(stepIndex, 1);
    });
  };
