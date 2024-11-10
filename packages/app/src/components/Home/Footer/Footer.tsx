import {msg} from '@lingui/macro';
import {A} from '@solidjs/router';
import {useI18n} from '~/locales/i18n';
import {footer, footerContent, footerLink, footerLinks} from './Footer.css';

export function HomeFooter() {
  const {_} = useI18n();
  return (
    <footer class={footer}>
      <div class={footerContent}>
        <div class={footerLinks}>
          <A class={footerLink} href={'/about'}>
            {_(msg`About`)}
          </A>

          <A
            class={footerLink}
            target="blank"
            href={'https://github.com/riccardoperra/pipelineui'}
          >
            {_(msg`Source`)}
          </A>
        </div>
        <span style={{color: '#ddd'}}>
          {_(msg`Built with`)}
          <A class={footerLink} href="https://github.com/solidjs/solid">
            Solid
          </A>{' '}
        </span>
      </div>
    </footer>
  );
}
