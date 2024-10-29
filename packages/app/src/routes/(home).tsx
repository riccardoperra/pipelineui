import {Title} from '@solidjs/meta';
import {Home} from '../components/Home/Home';
import {Suspense} from 'solid-js';

export default function HomePage() {
  return (
    <main>
      <Title>PipelineUI - Visual editor for GitHub</Title>

      <Home />
    </main>
  );
}
