import {Client, Databases, ID, Permission, Query, Role} from 'node-appwrite';
import {action, cache, json, redirect} from '@solidjs/router';
import {
  createAdminClient,
  createSessionClient,
  getLoggedInUser,
} from './server/appwrite';
import {adjectives, colors, uniqueNamesGenerator} from 'unique-names-generator';
import type {EditorParsedRepository} from '../components/Editor/editor.context';

function getScratchAppwriteVars() {
  'use server';
  return {
    databaseId: process.env.APPWRITE_CLOUD_DATABASE_ID!,
    scratchCollectionId: process.env.APPWRITE_CLOUD_SCRATCH_COLLECTION_ID!,
  };
}

export const updateScratch = action(async (id: string, newCode: string) => {
  'use server';
  const projectId = process.env.VITE_APPWRITE_CLOUD_PROJECT_ID!;
  const endpoint = process.env.VITE_APPWRITE_CLOUD_URL!;
  const {databaseId, scratchCollectionId} = getScratchAppwriteVars();
  const user = await getLoggedInUser();
  if (!user) {
    return;
  }

  const client = new Client()
    .setProject(projectId)
    .setEndpoint(endpoint)
    .setSelfSigned(true)
    .setSession(user.$id);

  const database = new Databases(client);

  return database.updateDocument(databaseId, scratchCollectionId, id, {
    code: newCode,
  });
});

export const createScratch = action(async () => {
  'use server';
  const {databaseId, scratchCollectionId} = getScratchAppwriteVars();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  const {database} = await createSessionClient();
  const {database: adminDatabase} = await createAdminClient();

  const permissions = [
    Permission.read(Role.guests()),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ];

  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    style: 'lowerCase',
    separator: '_',
  });

  const response = await database.createDocument(
    databaseId,
    scratchCollectionId,
    ID.unique(),
    {
      name,
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
      userId: user.$id,
    },
  );

  await database.updateDocument(databaseId, scratchCollectionId, response.$id, {
    $permissions: permissions,
  });

  await adminDatabase.updateDocument(
    databaseId,
    scratchCollectionId,
    response.$id,
    undefined,
    permissions,
  );

  throw redirect(`/editor/scratch/${response.$id}`);
}, 'create-scratch');

export const createScratchFork = action(
  async (
    repository: EditorParsedRepository,
    code: string,
    initialCode: string,
  ) => {
    'use server';
    const {databaseId, scratchCollectionId} = getScratchAppwriteVars();
    const user = await getLoggedInUser();
    if (!user) {
      return;
    }

    const {database} = await createSessionClient();
    const {database: adminDatabase} = await createAdminClient();

    const permissions = [
      Permission.read(Role.guests()),
      Permission.write(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ];

    const forkUrl = `${repository.owner}/${repository.repoName}/${repository.branchName}/${repository.filePath.join('/')}`;

    const response = await database.createDocument(
      databaseId,
      scratchCollectionId,
      ID.unique(),
      {
        name: repository.filePath.at(repository.filePath.length - 1),
        initialCode,
        code,
        type: 'fork',
        forkUrl,
        userId: user.$id,
      },
    );

    await adminDatabase.updateDocument(
      databaseId,
      scratchCollectionId,
      response.$id,
      undefined,
      permissions,
    );

    throw redirect(`/editor/scratch/${response.$id}`, {
      revalidate: [listUserScratches.key, getScratch.keyFor(response.$id)],
    });
  },
  'create-scratch',
);

export const deleteScratch = action(async scratchId => {
  'use server';

  const user = await getLoggedInUser();
  if (!user) {
    return;
  }

  const {database} = await createSessionClient();
  const {databaseId, scratchCollectionId} = getScratchAppwriteVars();

  return json(
    await database.deleteDocument(databaseId, scratchCollectionId, scratchId),
    {revalidate: [listUserScratches.key, getScratch.keyFor(scratchId)]},
  );
}, 'create-scratch');

export const getScratch = cache(async (id: string) => {
  'use server';

  const {database} = await createAdminClient();
  const {databaseId, scratchCollectionId} = getScratchAppwriteVars();

  try {
    return await database.getDocument(databaseId, scratchCollectionId, id);
  } catch (e) {
    throw redirect('/not-found');
  }
}, 'get-scratch-by-id');

export const listUserScratches = cache(async () => {
  'use server';
  const user = await getLoggedInUser();
  if (!user) {
    return {documents: [], total: 0};
  }
  const {databaseId, scratchCollectionId} = getScratchAppwriteVars();
  const {database} = await createSessionClient();
  return database.listDocuments(databaseId, scratchCollectionId, [
    Query.equal('userId', user.$id),
  ]);
}, 'list-scratches');
