import {getWorkflowJson} from '../dist';
import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const dir = import.meta.dirname;
const exampleYml = join(dir, '..', 'example', 'node.js.yml');

const result = await getWorkflowJson(
  'custom-workflow',
  await readFile(exampleYml, {encoding: 'utf-8'}),
);

await writeFile(
  './example/node.js.generated.json',
  JSON.stringify(result, undefined, 2),
);
