import {action, query, redirect} from '@solidjs/router';
import {OAuthProvider} from 'node-appwrite';
import {getHeaders} from 'vinxi/http';
import {createAdminClient} from './server/appwrite';
import {getLoggedInUser, getSession, logoutSession} from './server/session';

export const loggedInUser = query(async () => {
  'use server';
  const session = await getSession();
  const userId = session.data.session?.userId;
  if (!userId) return null;
  return getLoggedInUser();
}, 'currentUser');

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

export const logout = action(async () => {
  'use server';
  await logoutSession();
  return redirect('/');
}, 'logout');
