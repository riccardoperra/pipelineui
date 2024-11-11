import {Pair, Scalar, YAMLMap} from 'yaml';
import {YAMLSession} from '../plugins/yamlSession';
import {modifyOnField, removeObjectYamlPrivateProperties} from './helper';
import {WorkflowDispatchInput} from '../editor.types';

export const setWorkflowDispatch =
  (yamlSession: YAMLSession) =>
  (index: number, data: WorkflowDispatchInput, fallbackMissingName = true) => {
    yamlSession.updater(yaml => {
      modifyOnField(yaml, true, on => {
        let workflowDispatch = on.get('workflow_dispatch') as YAMLMap<
          Scalar<String>
        > | null;

        if (!workflowDispatch) {
          workflowDispatch = new YAMLMap();
          const pair = new Pair(
            new Scalar<string>('workflow_dispatch'),
            workflowDispatch,
          );
          on.add(pair);
        }

        let inputs = workflowDispatch.get('inputs') as YAMLMap<
          Scalar<string>,
          YAMLMap
        > | null;
        if (!inputs) {
          inputs = new YAMLMap();
          workflowDispatch.add(new Pair(new Scalar('inputs'), inputs));
        }

        let {name, ...others} = removeObjectYamlPrivateProperties({...data});
        const inputAtIndex = inputs.items.at(index);
        const input = new YAMLMap<Scalar<string>, unknown>();
        if (!name && fallbackMissingName) {
          name = `input-${index}`;
        }
        if (!name) {
          console.warn(
            'Missing `name` for workflow_dispatch. Skipping update',
            {
              index,
              data,
            },
          );
          return;
        }
        const pair = new Pair(new Scalar(name), input);
        switch (others.type) {
          case 'boolean':
            others.default =
              others.default === 'true' || others.default === true;
            break;
          case 'string':
            others.default = String(others.default);
            break;
          case 'number':
            others.default = parseInt(others.default, 10);
            break;
        }

        for (const [key, value] of Object.entries(others)) {
          if (value !== null && value !== undefined) {
            input.set(new Scalar(key), value);
          }
        }
        if (!inputAtIndex) {
          const value = new Pair(new Scalar(name), input);
          inputs.add(value);
        } else {
          inputs.items[index] = pair;
        }
      });
    });
  };

export const deleteWorkflowDispatchItem =
  (yamlSession: YAMLSession) => (index: number) => {
    yamlSession.updater(yaml => {
      const inputs = yaml.getIn([
        'on',
        'workflow_dispatch',
        'inputs',
      ]) as YAMLMap | null;
      if (!inputs) {
        return;
      }
      const inputAtIndex = inputs.items.at(index);
      inputs.delete(inputAtIndex?.key);
    });
  };
