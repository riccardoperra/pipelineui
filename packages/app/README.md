# @pipelineui/app

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Structure

- `src/locales/**`: Localization files and Lingui adapter
- `src/mocks`: mswjs mocks (currently disabled)
- `src/store`: App stores (such as editor, ui, user, etc.)
- `src/routes`: App routes
- `src/components`: App components
  - `/About`: About pages components
  - `/Editor`: Editor components
  - `/Home`: Home components
- `src/lib`: Application specific functions, store extensions, api, session manager etc
- `src/ui`: Generic UI theme, components, etc.

### GitHub API

This project uses [ungh](https://github.com/unjs/ungh) from UnJS in order to call GitHub API.
