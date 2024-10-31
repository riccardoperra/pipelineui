import {withReduxDevtools} from 'statebuilder/devtools';
import {loggedInUser} from '~/lib/session';
import {eDefineAsync} from '~/lib/statebuilder/async';

export const UserStore = eDefineAsync(() => loggedInUser(), {
  deferStream: true,
}).extend(withReduxDevtools({storeName: 'user'}));
