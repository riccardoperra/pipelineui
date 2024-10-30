# PipelineUI

Pipeline UI is a visual editor for creating and managing GitHub Actions workflows.
Built with SolidStart, this tool simplifies the process of defining GitHub pipelines
by allowing users to visually editing and update workflows. It automatically generates and
updates the YAML configuration files, ensuring seamless integration with GitHub.

> [!NOTE]
>
> This project has been made for [SolidHack 2024](https://www.solidjs.com/blog/solidhack-2024-announcement).
>
> Since October is the hacktoberfest month, this project use `AppWrite Cloud (Free tier)` for their [Appwrite’s Hacktoberfest 2024 Hackathon](https://appwrite.io/blog/post/appwrite-hacktoberfest-hackathon-2024).

## 🤖 Tech stack

PipelineUI is entirely built with [Solid](https://github.com/solidjs/solid) and [SolidStart](https://github.com/solidjs/solid-start).

There are a few core external dependencies that should be listed here for the awesome work.

### UI

The UI has been built with:

- [@kobalte/core](https://github.com/kobaltedev/kobalte): used to build accessible components in the UI
- [@solid-primitives/\*](https://github.com/solidjs-community/solid-primitives): SolidJS primitives library
- [vanilla-extract](https://vanilla-extract.style/): Zero-runtime CSS in typescript
- [corvu](https://corvu.dev/): UI primitives for SolidJS

> [!WARNING]
>
> The source code of [@vanilla-extract/vite-plugin](https://github.com/vanilla-extract-css/vanilla-extract/tree/master/packages/vite-plugin) has been altered
> in order to support solid start w/ vinxi for ssr/csr build.
>
> [Patch file](./patches/@vanilla-extract__vite-plugin@4.0.17.patch) > [Custom app config](./packages/app/app.config.ts)

---

### YAML Editor

- [CodeMirror6](https://codemirror.net/): used to display the YAML editor and merge view. The LSP integration is an
  adapted fork of [codemirror-languageserver](https://github.com/FurqanSoftware/codemirror-languageserver), which was a
  good starting point to integrate the GitHub workflow language server.
  - [LSP Integration](./packages/app/src/components/Editor/YamlEditor/lsp)
- [actions/languageservices](https://github.com/actions/languageservices): The language service repo for GitHub
  workflows and expressions. This was used to parse the workflow files and validate them, and enhance the editor code
  through linting and hover-in code documentation.

> [!WARNING]
>
> The source code of @actions/workflow-parser has been altered in order to be built into node/browser without getting errors and to
> extend some functionalities that were not available before (e.g. expression parsing).
>
> Currently @actions/languageserver has been wrapped to ship only browser compatible packages and the patche workflow-parser in order to skip all the used node dependencies.
>
> Read more about this in the package [README](./packages/workflow-parser/README.md).
>
> [MIT License](https://github.com/actions/languageservices/blob/main/LICENSE)
>
> [My patch file](./patches/@actions__workflow-parser@0.3.13.patch)

---

### Flow diagram

Flow diagram has been built from scratch taking advantage of some other dependencies:

- [elkjs](https://github.com/kieler/elkjs): Elk layout algorithm, used to calculate the flow item positions
- [panzoom](https://github.com/anvaka/panzoom): Cross-browser compatible pan and zoom library
- [@xyflow/system](https://github.com/xyflow/xyflow): Core of xyflow, currently used to build the smooth edge curve
  svg
  - [smootstep-edge.ts](https://github.com/xyflow/xyflow/blob/97fdff59d40071aee0b3192f7b571c6bdd4d09fd/packages/system/src/utils/edges/smoothstep-edge.ts#L215)

---

### Backend

Backend has been built with [appwrite](https://appwrite.io/), which has been wrapped via solid server functions
to provide authentication and the database persistence.

Most of the code is available into [packages/app/lib/server](packages/app/src/lib/server).

---

### Other dependencies

This projects also uses some of mine older dependencies that were used to speed up the development.
These have also been updated to fix the bugs encountered.

- [@codeui/kit](https://github.com/riccardoperra/codeui): [CodeImage](https://github.com/riccardoperra/codeimage) design
  system which wraps Kobalte.
- [statebuilder](https://github.com/riccardoperra/statebuilder): Pluggable state management
- [solid-codemirror](https://github.com/riccardoperra/solid-codemirror): SolidJS adapter for CodeMirror

---

### Hosting

This application is hosted on Railway. Deploy are made via github action CI/CD

- [Workflow file](./.github/workflows/deploy.yml)
- [See the workflow file on PipelineUI](https://pipelineui.dev/editor/riccardoperra/pipelineui/main/.github/workflows/deploy.yml)

## Features

### ✅ Search for existing GitHub workflows

What if you already have an existing workflow file pushed in your repository? You can use the built-in search to get all workflows
of your repository.

![Search for existing github workflows](./docs/262shots_so.png)

### ✅ Create your own workflows files

If you haven't an existing workflow file, you can create it from scratch if you're authenticated.

Workflow files are persisted into [AppWrite Cloud](https://appwrite.io/) and **are publicly readable to everyone that has the link**.

![Create scratches](./docs/577shots_so.png)

### ✅ Built-in editor

Visualize and/or modify your workflow file through a simple UI.

- View your steps dependency graph through the main interactive canvas
- Check your workflow validity through the YAML Viewer and it's linter, which immediately tell you if your file respect the [GitHub Workflow Syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) thanks to the GitHub Language Service integration.
- Modify your workflow file updating the Properties panel in the right side.

![Built-in editor](./docs/327shots_so.png)

## Supported GitHub Workflow features

- [ ] [Name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#name)
- [ ] [Run-name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#run-name)
- On
  - [ ] [Event name / types](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onevent_nametypes)
  - [ ] [Pull request / Pull request_target](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore)
  - [ ] [Schedule](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onschedule)
  - [ ] [Workflow call](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_call)
  - [ ] [Workflow run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_runbranchesbranches-ignore)
  - [ ] [Workflow dispatch](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatch)
- [ ] [Env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore)
- [ ] [Defaults](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaults)
- [ ] [Concurrency](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#concurrency)
- Jobs
  - [ ] [Job definition](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id)
    - [ ] name
    - [ ] permission
    - [ ] needs
    - [ ] if
    - [ ] runs-on
    - [ ] environment
    - [ ] concurrency
    - [ ] outputs
    - [ ] env
    - [ ] defaults
    - [ ] steps
    - [ ] [container](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer)
    - [ ] [services](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservices)
    - [ ] uses
    - [ ] with
    - [ ] secrets
  - [ ] [Job steps](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)
    - [ ] Definition
    - [ ] with
    - [ ] env
    - [ ]
