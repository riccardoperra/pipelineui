import {assert, test} from 'vitest';
import {join} from 'node:path';
import {readFile, writeFile} from 'node:fs/promises';
import {getWorkflowJson, isString, Tokens} from '../dist';

const dir = import.meta.dirname;
const exampleYml = await readFile(join(dir, 'data', 'node.js.yml'), 'utf-8');

test('parse job workflow correctly', async () => {
  const result = await getWorkflowJson('custom.yml', exampleYml);

  assert.isTrue(!result.errors?.length, 'No errors found');
  assert.equal(result.jobs.length, 1, 'Parsed jobs correctly');

  const [job1] = result.jobs;
  assert.equal(job1.type, 'job');
  assert.equal(job1.id.value, 'build');
  assert.isTrue(isString(job1.name!));
  assert.equal((job1.name as Tokens.StringToken).value, 'build');
});

test('return raw if expression if set', async () => {
  const result = await getWorkflowJson('custom.yml', exampleYml);

  assert.isTrue(!result.errors?.length, 'No errors found');
  assert.equal(result.jobs.length, 1, 'Parsed jobs correctly');

  const [job1] = result.jobs;

  assert.equal(job1.if.expression, "!startsWith(github.ref, 'refs/tags/')");
});
