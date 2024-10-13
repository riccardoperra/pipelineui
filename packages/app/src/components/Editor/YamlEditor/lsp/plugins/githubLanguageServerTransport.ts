import PostMessageWorkerTransport from '../protocol';

export async function githubLanguageServerTransport() {
  const {default: GithubLanguageServer} = await import(
    '../serviceWorker?worker'
  );
  return new PostMessageWorkerTransport(new GithubLanguageServer());
}
