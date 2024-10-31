import {type GenericStoreApi, makePlugin} from 'statebuilder';
import {type Accessor, createSignal, JSX} from 'solid-js';
import YAML, {Document, type ParsedNode} from 'yaml';

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

      const yamlUpdater = (cb: (yaml: YAMLDocument) => boolean | void) => {
        // TODO: handle errors?
        const doc = yaml();
        if (!doc) {
          console.warn('Yaml document not present. Skipping update.');
          return;
        }
        const result = cb(doc);
        if (result === undefined || result) {
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
