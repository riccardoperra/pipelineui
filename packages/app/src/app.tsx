import {setupI18n} from '@lingui/core';
import {MetaProvider, Title} from '@solidjs/meta';
import {Router} from '@solidjs/router';
import {FileRoutes} from '@solidjs/start/router';
import {Suspense} from 'solid-js';
import {StateProvider} from 'statebuilder';
import './app.css';
import './global-codeui.css';
import {I18nProvider} from './locales/i18n';

const {messages: enMessages} = await import('./locales/en.po');

export default function App() {
  const i18n = setupI18n();
  i18n.loadAndActivate({locale: 'en', messages: enMessages});

  return (
    <I18nProvider value={i18n}>
      <Router
        root={props => (
          <MetaProvider>
            <Title>PipelineUI</Title>
            <Suspense>
              <StateProvider>{props.children}</StateProvider>
            </Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </I18nProvider>
  );
}
