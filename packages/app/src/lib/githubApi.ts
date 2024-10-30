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
  'use server';
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
  'use server';
  return fetch(`https://ungh.cc/repos/${repo}/files/${branch}`).then(response =>
    response.json(),
  );
}

export interface GithubRepositoryFileContent {
  meta: {
    url: string;
  };
  file: {
    contents: string;
  };
}

export async function getGithubRepoFileContent(
  repo: string,
  branch: string,
  path: string,
): Promise<FetchResponse<GithubRepositoryFileContent, Error>> {
  'use server';
  const response = await fetch(
    `https://ungh.cc/repos/${repo}/files/${branch}/${path}`,
  );
  if (!response.ok) {
    if (response.status === 404) {
      return {
        error: new Error(`Workflow not found.`),
        failed: true,
      };
    }
    return {
      error: new Error('An error occurred.'),
      failed: true,
    };
  }
  return {data: await response.json(), failed: false, error: null};
}

export function getGithubRepoWorkflowFiles(
  repo: string,
  branch: string,
): Promise<GithubRepositoryFile[]> {
  'use server';
  return getGithubRepoFiles(repo, branch).then(response => {
    return response.files.filter(file =>
      file.path.startsWith('.github/workflows'),
    );
  });
}

class SearchRepoError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export async function getGithubData(path: string) {
  'use server';
  const result = await getGithubRepo(path);
  if (result.error) {
    throw new SearchRepoError(result.error.message);
  }
  const files = await getGithubRepoWorkflowFiles(
    result.data.repo.repo,
    result.data.repo.defaultBranch,
  );
  return {repo: result.data.repo, workflows: files};
}
