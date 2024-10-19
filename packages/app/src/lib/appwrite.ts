import {Client} from 'appwrite';
import {createContext} from 'solid-js';
import {getSession} from './server/session';
import {cache} from '@solidjs/router';

export const appwriteBrowser = new Client()
  .setProject('6713d930003dd483eb11')
  .setEndpoint('https://cloud.appwrite.io/v1');

const AppwriteBrowser = createContext(appwriteBrowser);

export const userSession = cache(async () => {
  'use server';
  const session = await getSession();
  return session.data;
}, 'session');

// export const SessionStore = ɵdefineResource(async () => {
//   const data = getSession().then(d => d.data);
//   console.log(data);
//   return await data;
// });
