import {MetaProvider, Title} from '@solidjs/meta';
import {Router} from '@solidjs/router';
import {FileRoutes} from '@solidjs/start/router';
import {Suspense} from 'solid-js';
import './global-codeui.css';
import './app.css';
import {StateProvider} from 'statebuilder';

export default function App() {
  return (
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
  );
}
