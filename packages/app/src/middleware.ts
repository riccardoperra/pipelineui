import {createMiddleware} from '@solidjs/start/middleware';
import {createSessionClient} from './lib/server/guest-middlware';

export default createMiddleware({
  onRequest: [
    async event => {
      await createSessionClient();
    },
  ],
});
