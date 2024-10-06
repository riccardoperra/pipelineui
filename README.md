# PipelineUI

> [!NOTE] This project has been made for [SolidHack 2024](https://www.solidjs.com/blog/solidhack-2024-announcement)

Pipeline UI is a visual editor for creating and managing GitHub Actions workflows.
Built with SolidStart, this tool simplifies the process of defining GitHub pipelines
by allowing users to visually edit and update workflows. It automatically generates and
updates the YAML configuration files, ensuring seamless integration with GitHub.

## Supported Github Workflow features

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
