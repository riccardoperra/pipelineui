import {useSession} from 'vinxi/http';
import {Models as NodeModels} from 'node-appwrite';
import {getLoggedInUser} from './appwrite';
import {action, redirect} from '@solidjs/router';

export function getSession() {
  'use server';
  return useSession<{
    session: NodeModels.Session | null;
  }>({
    password: 'my-custom-secret-very-long-secret-very-long',
  });
}

export async function getUser(): Promise<NodeModels.User<any> | null> {
  'use server';
  const session = await getSession();
  const userId = session.data.session?.userId;
  if (!userId) return null;
  return getLoggedInUser();
}

export async function logoutSession() {
  'use server';
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
