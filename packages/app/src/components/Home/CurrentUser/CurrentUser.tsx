import {createAsync, useAction, useSubmission} from '@solidjs/router';
import {getUser, logout} from '~/lib/server/session';
import {Show, useTransition} from 'solid-js';
import {badge, currentUser} from './CurrentUser.css';
import {Models} from 'appwrite';
import {Icon} from '#ui/components/Icon';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@codeui/kit';
import {signupWithGithub} from '../../../lib/server/appwrite';

export function CurrentUserBar() {
  const user = createAsync(() => getUser());

  const initials = (user: Models.User<any>) => {
    if (user.name) {
      const [firstName, lastName] = user.name.split(' ');
      return [firstName, lastName]
        .filter(Boolean)
        .map(str => str.charAt(0))
        .join('');
    } else {
      return '?';
    }
  };

  const logoutAction = useAction(logout);

  const isSignup = useSubmission(signupWithGithub);

  return (
    <Show
      fallback={
        <form action={signupWithGithub} method={'post'}>
          <Button
            variant={'ghost'}
            theme={'secondary'}
            size={'sm'}
            type={'submit'}
            loading={isSignup.pending}
          >
            Signup with Github
          </Button>
        </form>
      }
      when={user()}
    >
      {user => (
        <DropdownMenu>
          <DropdownMenuTrigger
            // @ts-expect-error TOOD: Fix @codeui/kit types
            as={triggerProps => (
              <Button
                size={'lg'}
                {...triggerProps}
                class={currentUser}
                variant={'ghost'}
                theme={'secondary'}
              />
            )}
          >
            <span class={badge}>{initials(user())}</span>
            <span>{user().name || user().email}</span>

            <Icon name={'keyboard_arrow_down'} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              name="logout"
              as={'button'}
              onClick={() => {
                logoutAction().then(() => window.location.reload());
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Show>
  );
}
