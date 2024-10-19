import {Client} from 'node-appwrite';
import {useSession} from 'vinxi/http';
import {getSession} from './session';

export async function createSessionClient() {
  const client = new Client()
    .setProject('6713d930003dd483eb11')
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setSelfSigned(true)
    .setKey(
      'standard_a70b44d44ccfd2fdd62748e6a2cd51590a712d440a1649be2fb493813b5c3ffe55519f45e15919248216e832d60a72394826e50bfff3f53d8cddd449ce41aa6710a360a7f94f4d35061cb81d7ea70b633d9f463c07baaefa0dfca17ccd1a83c51a6b5529b5d9c381f80f1c67f0f48586f1ec1508e9781f2dc71b361a83e03c6c',
    );

  const session = await getSession();
  if (!session || !session.data.session?.$id) {
    await session?.clear();
    throw new Error('No session');
  }

  client.setSession(session.data.session.secret);
}
