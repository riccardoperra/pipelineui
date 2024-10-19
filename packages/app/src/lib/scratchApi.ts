import {Client, Databases, ID} from 'node-appwrite';
import {action, cache, redirect} from '@solidjs/router';
import {userSession} from './appwrite';

const databaseId = '6713df260028ae4ab4cf';
const scratchCollectionId = '6713df310029c373c536';

export const createScratch = action(async () => {
  'use server';

  const session = await userSession();

  const client = new Client()
    .setProject('6713d930003dd483eb11')
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setSelfSigned(true)
    .setSession(session.session.$id);

  const database = new Databases(client);

  const response = await database.createDocument(
    databaseId,
    scratchCollectionId,
    ID.unique(),
    {
      initialCode:
        'name: Scratch file\n' +
        'on: {}\n' +
        'jobs:\n' +
        '  build:\n' +
        '    runs-on: ubuntu-latest\n' +
        '    steps:\n' +
        '      - uses: actions/checkout@v4',
      code:
        'name: Scratch file\n' +
        'on: {}\n' +
        'jobs:\n' +
        '  build:\n' +
        '    runs-on: ubuntu-latest\n' +
        '    steps:\n' +
        '      - uses: actions/checkout@v4',
      type: 'scratch',
    },
  );

  throw redirect(`/editor/scratch/${response.$id}`);
}, 'create-scratch');

export const getScratch = cache(async (id: string) => {
  'use server';

  const client = new Client()
    .setProject('6713d930003dd483eb11')
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setSelfSigned(true)
    .setKey(
      'standard_41396d78fc96ce5d9a7532e327623e2cd167d6ba4e3e4f352d3f02fa825090c6447bd84cd9e6dea083c0bba37214ba84ce798e629cafa7e9b42cad3df4a0420e3afb39a62eb04b1eb2767c8d7104af7f83101cc72174c6b49fac8480d6d9d21893e043be14b3aabc4461c7f50db0c732a88cc793e3d0ca6f7ce69f0349f187a8',
    );

  const database = new Databases(client);

  try {
    return await database.getDocument(databaseId, scratchCollectionId, id);
  } catch (e) {
    throw redirect('/not-found');
  }
}, 'get-scratch-by-id');
