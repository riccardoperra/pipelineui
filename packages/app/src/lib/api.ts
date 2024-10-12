export interface GithubRepository {
  id: number;
  name: string;
  repo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  stars: number;
  watchers: number;
  forks: number;
  defaultBranch: string;
}

export interface GithubGetRepositoryResponse {
  repo: GithubRepository;
}

export type FetchResponse<T, E = unknown> =
  | {data: T; error: null; failed: false}
  | {data?: undefined; error: E; failed: true};

export async function getGithubRepo(
  name: string,
): Promise<FetchResponse<GithubGetRepositoryResponse, Error>> {
  const response = await fetch(`https://ungh.cc/repos/${name}`);
  if (!response.ok) {
    if (response.status === 404) {
      return {
        error: new Error(`Repo ${name} not found.`),
        failed: true,
      };
    }
    return {
      error: new Error('An error occurred.'),
      failed: true,
    };
  }
  return {
    data: await response.json(),
    error: null,
    failed: false,
  };
}

export interface GithubRepositoryFile {
  path: string;
  size: number;
  sha: string;
  mode: number;
}

export interface GithubRepositoryFileResponse {
  meta: {
    sha: string;
  };
  files: GithubRepositoryFile[];
}

export function getGithubRepoFiles(
  repo: string,
  branch: string,
): Promise<GithubRepositoryFileResponse> {
  return fetch(`https://ungh.cc/repos/${repo}/files/${branch}`).then(response =>
    response.json(),
  );
}

export function getGithubRepoWorkflowFiles(
  repo: string,
  branch: string,
): Promise<GithubRepositoryFile[]> {
  return getGithubRepoFiles(repo, branch).then(response => {
    return response.files.filter(file =>
      file.path.startsWith('.github/workflows'),
    );
  });
}
