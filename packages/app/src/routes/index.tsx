import {Title} from '@solidjs/meta';
import {Home} from '../components/Home/Home';
import {StateProvider} from 'statebuilder';

export default function HomePage() {
  return (
    <main>
      <Title>PipelineUI - Visual editor for GitHub</Title>

      <StateProvider>
        <Home />
      </StateProvider>
    </main>
  );
}
