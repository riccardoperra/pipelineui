import {YAMLMap, Scalar} from 'yaml';
import {WorkflowTypesTriggerEvent} from '../../../components/Editor/store/editor.types';
import {YAMLSession} from '../plugins/yamlSession';
import {modifyOnField} from './helper';

export const setEventTriggerTypes =
  (yamlSession: YAMLSession) => (data: WorkflowTypesTriggerEvent) => {
    yamlSession.updater(yaml => {
      modifyOnField(yaml, true, on => {
        const map = new YAMLMap();

        if (data.types?.length) {
          map.set(new Scalar('types'), data.types);
          on.set(new Scalar(data.type as string), map);
        } else {
          on.set(new Scalar(data.type as string), map);
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
