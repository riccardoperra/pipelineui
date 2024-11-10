import {Icon} from '#ui/components/Icon';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@codeui/kit';
import {useAction, useSubmission} from '@solidjs/router';
import type {Models} from 'appwrite';
import {Show} from 'solid-js';
import {logout, signupWithGithub} from '~/lib/session';
import {badge, currentUser} from './CurrentUser.css';
import {useI18n} from '~/locales/i18n';
import {msg} from '@lingui/macro';
export interface CurrentUserBarProps {
  user: Models.User<any> | null;
}

export function EditorHeaderCurrentUser(props: CurrentUserBarProps) {
  const {_} = useI18n();

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
            {_(msg`Signup with GitHub`)}
          </Button>
        </form>
      }
      when={props.user}
    >
      {user => (
        <DropdownMenu>
          <DropdownMenuTrigger
            // @ts-expect-error TOOD: Fix @codeui/kit types
            as={triggerProps => (
              <Button
                size={'sm'}
                {...triggerProps}
                class={currentUser}
                variant={'ghost'}
                theme={'secondary'}
              />
            )}
          >
            <span class={badge}>{initials(user())}</span>
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
              {_(msg`Logout`)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Show>
  );
}
