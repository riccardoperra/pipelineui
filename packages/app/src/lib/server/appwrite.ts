'use server';
import {Account, Client, Databases, OAuthProvider} from 'node-appwrite';
import {getHeaders} from 'vinxi/http';
import {getSession} from './session';
import {action, cache, redirect} from '@solidjs/router';

export async function createSessionClient() {
  'use server';
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

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function createAdminClient() {
  'use server';
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

export const signupWithGithub = action(async () => {
  'use server';
  const {account} = await createAdminClient();

  const origin = getHeaders().origin;
  const successUrl = `${origin}/api/oauth`;
  const failureUrl = `${origin}/`;

  try {
    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Github,
      successUrl,
      failureUrl,
    );
    return redirect(redirectUrl);
  } catch (e) {
    console.error(e);
    return redirect('error');
  }
}, 'signup-with-github');
