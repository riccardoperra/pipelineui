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

export function getGithubRepo(
  name: string,
): Promise<GithubGetRepositoryResponse> {
  return fetch(`https://ungh.cc/repos/${name}`).then(response =>
    response.json(),
  );
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
