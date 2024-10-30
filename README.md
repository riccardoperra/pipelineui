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

## Table of contents

- [Features](#features)
- [Technical info](#-technical-info)
  - [UI](#ui)
  - [YAML Editor](#yaml-editor)
  - [Flow diagram](#flow-diagram)
  - [Backend](#backend)
  - [Other dependencies](#other)
  - [Hosting](#hosting)
- [Supported GitHub Workflow Features](#supported-github-workflow-features)

## Features

### ✅ Built-in editor

Visualize and/or modify your workflow file through a simple UI.

- View your steps dependency graph through the main interactive canvas
- Check your workflow validity through the YAML Viewer and it's linter, which immediately tell you if your file respect the [GitHub Workflow Syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) thanks to the GitHub Language Service integration.
- Modify your workflow file updating the Properties panel in the right side.

[Read here all available editor features](./FEATURES.md)

![Built-in editor](./docs/327shots_so.png)

### ✅ Search for existing GitHub workflows

What if you already have an existing workflow file pushed in your repository? You can use the built-in search to get all workflows
of your repository.

![Search for existing github workflows](./docs/262shots_so.png)

### ✅ Create your own workflows files

If you haven't an existing workflow file, you can create it from scratch if you're authenticated.

Workflow files are persisted into [AppWrite Cloud](https://appwrite.io/) and **are publicly readable to everyone that has the link**.

![Create scratches](./docs/577shots_so.png)

## 🤖 Technical info

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

## Supported GitHub Workflow features

### Generic workflow detail

| Feature                                                                                                                                                                                                                | Supported |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#name)                                                                                                                   |    ✅     |
| [run-name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#run-name)                                                                                                           |    ❌     |
| [on](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#on)                                                                                                                       |    ✅     |
| [on.<event_name>.types](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onevent_nametypes)                                                                                     |    ✅     |
| [on.<pull_request\|pull_request_target>.<branches\|branches-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore) |    ❌     |
| [on.push.<branches\|tags\|branches-ignore\|tags-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore)                         |    ❌     |
| [on.<push\|pull_request\|pull_request_target>.<paths\|paths-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)   |    ❌     |
| [on.<push\|pull_request\|pull_request_target>.<paths\|paths-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)   |    ❌     |
| [on.schedule](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onschedule)                                                                                                      |    ❌     |
| [on.workflow_call](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_call)                                                                                            |    ❌     |
| [on.workflow_call.inputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs)                                                                               |    ❌     |
| [on.workflow_call.inputs.<input_id>.type](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callinputsinput_idtype)                                                   |    ❌     |
| [on.workflow_call.outputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_calloutputs)                                                                             |    ❌     |
| [on.workflow_call.secrets](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecrets)                                                                             |    ❌     |
| [on.workflow_call.secrets.<secret_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecretssecret_id)                                                        |    ❌     |
| [on.workflow_call.secrets.<secret_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecretssecret_idrequired)                                       |    ❌     |
| [on.workflow_run.<branches\|branches-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_runbranchesbranches-ignore)                                           |    ❌     |
| [on.workflow_dispatch](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_runbranchesbranches-ignore)                                                                  |    ✅     |
| [on.workflow_dispatch.inputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs)                                                                       |    ✅     |
| [on.workflow_dispatch.inputs.<input_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idrequired)                                   |    ✅     |
| [on.workflow_dispatch.inputs.<input_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idrequired)                                   |    ✅     |
| [on.workflow_dispatch.inputs.<input_id>.type](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idtype)                                           |    ✅     |
| [permissions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#permissions)                                                                                                     |    ❌     |
| [env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#env)                                                                                                                     |    ✅     |
| [defaults](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaults)                                                                                                           |    ❌     |
| [defaults.run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrun)                                                                                                    |    ❌     |
| [defaults.run.shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrunshell)                                                                                         |    ❌     |
| [defaults.run.working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrunworking-directory)                                                                 |    ❌     |
| [concurrency](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#concurrency)                                                                                                     |    ❌     |

### Jobs

| Feature                                                                                                                                                                        | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------: |
| [jobs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobs)                                                                           |    ✅     |
| [jobs.<job_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id)                                                            |    ✅     |
| [jobs.<job_id>.name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idname)                                                   |    ✅     |
| [jobs.<job_id>.permissions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions)                                     |    ❌     |
| [jobs.<job_id>.needs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds)                                                 |    ✅     |
| [jobs.<job_id>.if](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idif)                                                       |    ✅     |
| [jobs.<job_id>.runs-on](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idruns-on)                                             |    ✅     |
| [jobs.<job_id>.environment](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idenvironment)                                     |    ✅     |
| [jobs.<job_id>.concurrency](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idconcurrency)                                     |    ❌     |
| [jobs.<job_id>.outputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs)                                             |    ❌     |
| [jobs.<job_id>.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idenv)                                                     |    ✅     |
| [jobs.<job_id>.defaults](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaults)                                           |    ❌     |
| [jobs.<job_id>.defaults.run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrun)                                    |    ❌     |
| [jobs.<job_id>.defaults.run.shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrunshell)                         |    ❌     |
| [jobs.<job_id>.defaults.run.working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrunworking-directory) |    ❌     |
| [jobs.<job_id>.timeout-minutes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes)                             |    ❌     |
| [jobs.<job_id>.uses](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iduses)                                                   |    ✅     |
| [jobs.<job_id>.with](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idwith)                                                   |    ❌     |
| [jobs.<job_id>.with.<input_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idwithinput_id)                                |    ❌     |

### Jobs Step

| Feature                                                                                                                                                               | Supported |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.<job_id>.steps](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)                                        |    ✅     |
| [jobs.<job_id>.steps[\*].id](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsid)                               |    ✅     |
| [jobs.<job_id>.steps[\*].if](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif)                               |    ✅     |
| [jobs.<job_id>.steps[\*].name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsname)                           |    ✅     |
| [jobs.<job_id>.steps[\*].uses](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses)                           |    ✅     |
| [jobs.<job_id>.steps[\*].run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun)                             |    ✅     |
| [jobs.<job_id>.steps[\*].working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsworking-directory) |    ❌     |
| [jobs.<job_id>.steps[\*].shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell)                         |    ❌     |
| [jobs.<job_id>.steps[\*].with](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith)                           |    ❌     |
| [jobs.<job_id>.steps[\*].with.args](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswithargs)                  |    ❌     |
| [jobs.<job_id>.steps[\*].with.entrypoint](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswithentrypoint)      |    ❌     |
| [jobs.<job_id>.steps[\*].env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsenv)                             |    ✅     |
| [jobs.<job_id>.steps[\*].continue-on-error](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepscontinue-on-error) |    ❌     |
| [jobs.<job_id>.steps[\*].timeout-minutes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepstimeout-minutes)     |    ❌     |

### Job container

| Feature                                                                                                                                                       | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.<job_id>.container](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer)                        |    ❌     |
| [jobs.<job_id>.container.image](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerimage)             |    ❌     |
| [jobs.<job_id>.container.credentials](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainercredentials) |    ❌     |
| [jobs.<job_id>.container.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerenv)                 |    ❌     |
| [jobs.<job_id>.container.ports](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerports)             |    ❌     |
| [jobs.<job_id>.container.volumes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainervolumes)         |    ❌     |
| [jobs.<job_id>.container.options](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontaineroptions)         |    ❌     |

### Job strategy

| Feature                                                                                                                                                                 | Supported |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.<job_id>.strategy](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategy)                                    |    ❌     |
| [jobs.<job_id>.strategy.matrix](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)                       |    ❌     |
| [jobs.<job_id>.strategy.matrix.include](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixinclude)        |    ❌     |
| [jobs.<job_id>.strategy.matrix.exclude](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixexclude)        |    ❌     |
| [jobs.<job_id>.strategy.fail-fast](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast)                 |    ❌     |
| [jobs.<job_id>.strategy.max-parallel](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymax-parallel)           |    ❌     |
| [jobs.<job_id>.strategy.continue-on-error](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategycontinue-on-error) |    ❌     |

### Job services

| Feature                                                                                                                                                                            | Supported |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.<job_id>.services](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservices)                                               |    ❌     |
| [jobs.<job_id>.services.<service_id>.image](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idimage)             |    ❌     |
| [jobs.<job_id>.services.<service_id>.credentials](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idcredentials) |    ❌     |
| [jobs.<job_id>.services.<service_id>.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idenv)                 |    ❌     |
| [jobs.<job_id>.services.<service_id>.ports](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idports)             |    ❌     |
| [jobs.<job_id>.services.<service_id>.volumes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idvolumes)         |    ❌     |
| [jobs.<job_id>.services.<service_id>.options](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idoptions)         |    ❌     |

### Job secrets

| Feature                                                                                                                                                 | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.<job_id>.secrets](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecrets)                      |    ❌     |
| [jobs.<job_id>.secrets.inherit](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretsinherit)       |    ❌     |
| [jobs.<job_id>.secrets.<secret_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretssecret_id) |    ❌     |
