import {Scalar, YAMLMap} from 'yaml';
import {
  WorkflowTypesTriggerEvent,
  WorkflowTypesTriggerPullRequest,
} from '../editor.types';
import {YAMLSession} from '../plugins/yamlSession';
import {modifyOnField} from './helper';

export const setEventTriggerTypes =
  (yamlSession: YAMLSession) =>
  (data: WorkflowTypesTriggerEvent | WorkflowTypesTriggerPullRequest) => {
    yamlSession.updater(yaml => {
      modifyOnField(yaml, true, on => {
        const map = new YAMLMap();

        if (data.types?.length) {
          map.set(new Scalar('types'), data.types);
          on.set(new Scalar(data.type as string), map);
        } else {
          on.set(new Scalar(data.type as string), map);
        }

        map.has('branches') && map.delete('branches');
        map.has('branches_ignore') && map.delete('branches_ignore');

        if (
          data.type === 'push' ||
          data.type === 'pull_request' ||
          data.type === 'pull_request_target'
        ) {
          if ('branches' in data && data.branches && data.branches.length) {
            map.set(new Scalar('branches'), data.branches ?? []);
          } else {
            map.delete('branches');
          }

          if (
            'branchesIgnore' in data &&
            data.branchesIgnore &&
            data.branchesIgnore?.length
          ) {
            map.set(new Scalar('branches_ignore'), data.branchesIgnore ?? []);
          } else {
            map.delete('branches_ignore');
          }
        }

        if (map.items.length === 0) {
          on.set(new Scalar(data.type as string), null);
        }
      });
    });
  };

export const deleteEventTriggerTypes =
  (yamlSession: YAMLSession) => (data: WorkflowTypesTriggerEvent) => {
    yamlSession.updater(yaml => {
      modifyOnField(yaml, true, on => {
        on.delete(data.type);
      });
    });
  };
