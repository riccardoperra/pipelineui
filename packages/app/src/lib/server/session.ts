import {useSession} from 'vinxi/http';
import {Models as NodeModels} from 'node-appwrite';

export function getSession() {
  return useSession<{
    session: NodeModels.Session;
    user: NodeModels.User<any>;
  }>({
    password: 'my-custom-secret-very-long-secret-very-long',
  });
}
