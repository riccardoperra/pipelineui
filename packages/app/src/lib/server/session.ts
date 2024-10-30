import {action, cache, redirect} from '@solidjs/router';
import {Models as NodeModels} from 'node-appwrite';
import {useSession} from 'vinxi/http';
import {getLoggedInUser} from './appwrite';

export function getSession() {
  return useSession<{
    session: NodeModels.Session | null;
  }>({
    password: process.env.APP_SESSION_SECRET!,
  });
}

export async function getUser(): Promise<NodeModels.User<any> | null> {
  const session = await getSession();
  const userId = session.data.session?.userId;
  if (!userId) return null;
  return getLoggedInUser();
}

export const loggedInUser = cache(async () => {
  'use server';
  const session = await getSession();
  const userId = session.data.session?.userId;
  if (!userId) return null;
  return getLoggedInUser();
}, 'logged_user');

async function logoutSession() {
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

export const logout = action(async () => {
  'use server';
  await logoutSession();
  return redirect('/');
}, 'logout');
