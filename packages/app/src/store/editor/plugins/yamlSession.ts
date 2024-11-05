import {type GenericStoreApi, makePlugin} from 'statebuilder';
import {type Accessor, createSignal, JSX} from 'solid-js';
import YAML, {Document, YAMLMap, type ParsedNode} from 'yaml';

export type YAMLDocument = Document.Parsed<ParsedNode, true>;

export interface YAMLSession {
  document: Accessor<YAMLDocument | undefined>;
  init: (yaml: YAMLDocument) => void;
  updater: (cb: (yaml: YAMLDocument) => boolean | void) => void;
  source: Accessor<string>;
  initialSource: Accessor<string>;
}
export interface YamlDocumentSessionPlugin {
  yamlSession: YAMLSession;
}

export const withYamlDocumentSession = () => {
  return makePlugin(
    <S extends GenericStoreApi>(_: S): YamlDocumentSessionPlugin => {
      const [yaml, internalSetYaml] = createSignal<YAMLDocument>();
      const [notifier, setNotifier] = createSignal({}, {equals: false});

      const [initialSource, setInitialSource] = createSignal('');

      const source = () => {
        notifier();
        return yaml()?.toString({nullStr: ''}) ?? '';
      };

      const setYaml = (yaml: YAMLDocument) => {
        internalSetYaml(() => yaml);
        setInitialSource(yaml.toString() ?? '');
      };

      const order = [
        'name',
        'run-name',
        'on',
        'permissions',
        'env',
        'defaults',
        'concurrency',
        'jobs',
      ];

      const yamlApplyPropertiesReordering = (doc: YAMLDocument) => {
        const contents = doc.contents;
        if (!(contents instanceof YAML.YAMLMap)) {
          return;
        }

        // TODO: optimize subscribing to slices. this should not be done every time...
        contents.items = contents.items.sort((a, b) => {
          const indexA = order.indexOf(a.key.toString());
          const indexB = order.indexOf(b.key.toString());
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      };

      const yamlUpdater = (cb: (yaml: YAMLDocument) => boolean | void) => {
        // TODO: handle errors?
        const doc = yaml();
        if (!doc) {
          console.warn('Yaml document not present. Skipping update.');
          return;
        }
        const result = cb(doc);

        if (result === undefined || result) {
          yamlApplyPropertiesReordering(doc);
          setNotifier({});
        }
      };

      return {
        yamlSession: {
          document: yaml,
          init: setYaml,
          updater: yamlUpdater,
          initialSource: initialSource,
          source,
        },
      };
    },
    {
      name: 'yamlSession',
      dependencies: [],
    },
  );
};
