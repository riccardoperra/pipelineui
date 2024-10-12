import {http, HttpResponse} from 'msw';
import codeImageProdDeployYaml from './data/codeimage-prod-deploy.yml?raw';
import codeImageMainYml from './data/codeimage-main.yml?raw';
import invalidFile from './data/invalid?raw';
import type {
  GithubGetRepositoryResponse,
  GithubRepositoryFileResponse,
} from '../lib/api';

export const handlers = [
  http.get(
    'https://ungh.cc/repos/riccardoperra/dev',
    async ({request, params}) => {
      return HttpResponse.json({
        repo: {
          name: 'dev',
          repo: 'riccardoperra/dev',
          description: 'Lorem ipsum dolor sit amet',
          stars: 1928,
          defaultBranch: 'main',
          id: 1,
          createdAt: '',
          forks: 1,
          pushedAt: '',
          updatedAt: '',
          watchers: 0,
        },
      } satisfies GithubGetRepositoryResponse);
    },
  ),

  http.get(
    'https://ungh.cc/repos/riccardoperra/dev/files/main',
    async ({request, params}) => {
      return HttpResponse.json({
        meta: {
          sha: '',
        },
        files: [
          {path: '.github/workflows/01.yaml', sha: '', mode: 1, size: 1},
          {path: '.github/workflows/main.yaml', sha: '', mode: 1, size: 1},
          {path: '.github/workflows/invalid.tsx', sha: '', mode: 1, size: 1},
        ],
      } satisfies GithubRepositoryFileResponse);
    },
  ),

  http.get(
    'https://ungh.cc/repos/riccardoperra/dev/files/main/.github/workflows/:id',
    async ({request, params}) => {
      const cases: Record<string, string> = {
        '01.yaml': codeImageProdDeployYaml,
        'main.yaml': codeImageMainYml,
        'invalid.tsx': invalidFile,
      };

      const contents = cases[params.id.toString()] ?? '';
      return HttpResponse.json({
        meta: {
          url: '',
        },
        file: {
          contents,
        },
      });
    },
  ),
];
