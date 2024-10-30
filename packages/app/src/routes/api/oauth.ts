import {redirect} from '@solidjs/router';
import type {APIEvent} from '@solidjs/start/server';
import {createAdminClient} from '~/lib/server/appwrite';
import {getSession} from '~/lib/server/session';

export async function GET({request}: APIEvent) {
  const req = new Request(request);
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const secret = url.searchParams.get('secret');
  if (!userId || !secret) {
    throw new Error('Missing OAuth redirect params');
  }
  const {account} = await createAdminClient();
  const session = await account.createSession(userId, secret);

  const solidSession = await getSession();

  await solidSession.update({session});

  return redirect(url.origin);
}
