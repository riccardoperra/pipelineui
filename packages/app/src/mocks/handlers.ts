import {http, HttpResponse} from 'msw';
import codeImageProdDeployYaml from './data/codeimage-prod-deploy.yml?raw';
import codeImageMainYml from './data/codeimage-main.yml?raw';

export const handlers = [
  http.get(
    'https://ungh.cc/repos/riccardoperra/ci-test/files/main/.github/workflows/:id',
    async ({request, params}) => {
      const cases: Record<string, string> = {
        '01.yaml': codeImageProdDeployYaml,
        'main.yaml': codeImageMainYml,
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
