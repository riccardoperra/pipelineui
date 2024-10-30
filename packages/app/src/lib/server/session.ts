import type {Models as NodeModels} from 'node-appwrite';
import {useSession} from 'vinxi/http';
import {createSessionClient} from './appwrite';

export function getSession() {
  return useSession<{
    session: NodeModels.Session | null;
  }>({
    password: process.env.APP_SESSION_SECRET!,
  });
}

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function logoutSession() {
  try {
    const session = await getSession();
    await session.update(d => {
      d.session = null;
      return d;
    });
  } catch (e) {
    console.error('error removing session');
  }
}
