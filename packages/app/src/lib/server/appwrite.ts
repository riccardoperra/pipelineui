import {Account, Client, Databases, OAuthProvider} from 'node-appwrite';
import {getHeaders} from 'vinxi/http';
import {getSession} from './session';
import {action, redirect} from '@solidjs/router';

const projectId = import.meta.env.VITE_APPWRITE_CLOUD_PROJECT_ID;
const endpoint = import.meta.env.VITE_APPWRITE_CLOUD_URL;

export async function createSessionClient() {
  'use server';
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
  'use server';
  try {
    const {account} = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function createAdminClient() {
  'use server';
  const apiKey = import.meta.env.VITE_APPWRITE_CLOUD_FULL_ACCESS_API_KEY;

  console.log({
    apiKey,
    projectId,
    endpoint,
  });

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
  const successUrl = `https://pipelineui.dev/api/oauth`;
  const failureUrl = `https://pipelineui.dev/`;

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
