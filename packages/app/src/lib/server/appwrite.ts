import {Account, Client, Databases} from 'node-appwrite';
import {getSession} from './session';

export async function createSessionClient() {
  const projectId = process.env.APPWRITE_CLOUD_PROJECT_ID!;
  const endpoint = process.env.APPWRITE_CLOUD_URL!;
  const client = new Client().setProject(projectId).setEndpoint(endpoint);
  const session = await getSession();
  if (!session || !session.data.session?.$id) {
    await session?.clear();
    throw new Error('No session');
  }
  client.setSession(session.data.session.secret);

  return {
    get database() {
      return new Databases(client);
    },
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const apiKey = process.env.APPWRITE_CLOUD_FULL_ACCESS_API_KEY!;
  const projectId = process.env.APPWRITE_CLOUD_PROJECT_ID!;
  const endpoint = process.env.APPWRITE_CLOUD_URL!;

  const client = new Client()
    .setProject(projectId)
    .setEndpoint(endpoint)
    .setKey(apiKey);

  return {
    get database() {
      return new Databases(client);
    },
    get account() {
      return new Account(client);
    },
  };
}
