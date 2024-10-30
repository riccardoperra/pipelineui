import {A} from '@solidjs/router';
import {footer, footerContent, footerLinks, footerLink} from './Footer.css';

export function HomeFooter() {
  return (
    <footer class={footer}>
      <div class={footerContent}>
        <div class={footerLinks}>
          <A class={footerLink} href={'/about'}>
            About
          </A>

          <A
            class={footerLink}
            target="blank"
            href={'https://github.com/riccardoperra/pipelineui'}
          >
            Source
          </A>
        </div>
        <span style={{color: '#ddd'}}>
          Built with{' '}
          <A class={footerLink} href="https://github.com/solidjs/solid">
            Solid
          </A>{' '}
        </span>
      </div>
    </footer>
  );
}
