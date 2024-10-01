import {Title} from '@solidjs/meta';
import {Button} from '@codeui/kit';

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <Button size={'sm'} theme={'primary'}>
        My button
      </Button>
    </main>
  );
}
