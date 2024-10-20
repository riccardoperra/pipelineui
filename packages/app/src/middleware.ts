import {createMiddleware} from '@solidjs/start/middleware';

export default createMiddleware({
  onRequest: [
    async event => {
      // await createSessionClient();
    },
  ],
});
