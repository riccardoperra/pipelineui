import type {LinguiConfig} from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['en'],
  compileNamespace: 'es',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: 'po',
};

export default config;
