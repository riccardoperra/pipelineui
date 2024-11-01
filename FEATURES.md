# Github Workflow Syntax Supported Features

## Generic workflow detail

| Feature                                                                                                                                                                                                                  | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------: |
| [name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#name)                                                                                                                     |    ✅     |
| [run-name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#run-name)                                                                                                             |    ❌     |
| [on](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#on)                                                                                                                         |    ✅     |
| [on.\<event_name>.types](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onevent_nametypes)                                                                                      |    ✅     |
| [on.\<pull_request\|pull_request_target>.\<branches\|branches-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore) |    ❌     |
| [on.push.\<branches\|tags\|branches-ignore\|tags-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore)                          |    ❌     |
| [on.\<push\|pull_request\|pull_request_target>.\<paths\|paths-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)   |    ❌     |
| [on.\<push\|pull_request\|pull_request_target>.\<paths\|paths-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)   |    ❌     |
| [on.schedule](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onschedule)                                                                                                        |    ❌     |
| [on.workflow_call](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_call)                                                                                              |    ❌     |
| [on.workflow_call.inputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs)                                                                                 |    ❌     |
| [on.workflow_call.inputs.\<input_id>.type](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callinputsinput_idtype)                                                    |    ❌     |
| [on.workflow_call.outputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_calloutputs)                                                                               |    ❌     |
| [on.workflow_call.secrets](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecrets)                                                                               |    ❌     |
| [on.workflow_call.secrets.\<secret_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecretssecret_id)                                                         |    ❌     |
| [on.workflow_call.secrets.\<secret_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_callsecretssecret_idrequired)                                        |    ❌     |
| [on.workflow_run.\<branches\|branches-ignore>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_runbranchesbranches-ignore)                                            |    ❌     |
| [on.workflow_dispatch](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_runbranchesbranches-ignore)                                                                    |    ✅     |
| [on.workflow_dispatch.inputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs)                                                                         |    ✅     |
| [on.workflow_dispatch.inputs.\<input_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idrequired)                                    |    ✅     |
| [on.workflow_dispatch.inputs.\<input_id>.required](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idrequired)                                    |    ✅     |
| [on.workflow_dispatch.inputs.\<input_id>.type](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputsinput_idtype)                                            |    ✅     |
| [permissions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#permissions)                                                                                                       |    ❌     |
| [env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#env)                                                                                                                       |    ✅     |
| [defaults](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaults)                                                                                                             |    ❌     |
| [defaults.run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrun)                                                                                                      |    ❌     |
| [defaults.run.shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrunshell)                                                                                           |    ❌     |
| [defaults.run.working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defaultsrunworking-directory)                                                                   |    ❌     |
| [concurrency](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#concurrency)                                                                                                       |    ❌     |

## Jobs

| Feature                                                                                                                                                                         | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobs)                                                                            |    ✅     |
| [jobs.\<job_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id)                                                            |    ✅     |
| [jobs.\<job_id>.name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idname)                                                   |    ✅     |
| [jobs.\<job_id>.permissions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions)                                     |    ❌     |
| [jobs.\<job_id>.needs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds)                                                 |    ✅     |
| [jobs.\<job_id>.if](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idif)                                                       |    ✅     |
| [jobs.\<job_id>.runs-on](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idruns-on)                                             |    ✅     |
| [jobs.\<job_id>.environment](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idenvironment)                                     |    ✅     |
| [jobs.\<job_id>.concurrency](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idconcurrency)                                     |    ❌     |
| [jobs.\<job_id>.outputs](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs)                                             |    ❌     |
| [jobs.\<job_id>.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idenv)                                                     |    ✅     |
| [jobs.\<job_id>.defaults](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaults)                                           |    ❌     |
| [jobs.\<job_id>.defaults.run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrun)                                    |    ❌     |
| [jobs.\<job_id>.defaults.run.shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrunshell)                         |    ❌     |
| [jobs.\<job_id>.defaults.run.working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iddefaultsrunworking-directory) |    ❌     |
| [jobs.\<job_id>.timeout-minutes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes)                             |    ❌     |
| [jobs.\<job_id>.uses](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_iduses)                                                   |    ✅     |
| [jobs.\<job_id>.with](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idwith)                                                   |    ❌     |
| [jobs.\<job_id>.with.\<input_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idwithinput_id)                               |    ❌     |

### Jobs Step

| Feature                                                                                                                                                                | Supported |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.\<job_id>.steps](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps)                                        |    ✅     |
| [jobs.\<job_id>.steps[\*].id](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsid)                               |    ✅     |
| [jobs.\<job_id>.steps[\*].if](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif)                               |    ✅     |
| [jobs.\<job_id>.steps[\*].name](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsname)                           |    ✅     |
| [jobs.\<job_id>.steps[\*].uses](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses)                           |    ✅     |
| [jobs.\<job_id>.steps[\*].run](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun)                             |    ✅     |
| [jobs.\<job_id>.steps[\*].working-directory](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsworking-directory) |    ❌     |
| [jobs.\<job_id>.steps[\*].shell](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell)                         |    ❌     |
| [jobs.\<job_id>.steps[\*].with](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith)                           |    ❌     |
| [jobs.\<job_id>.steps[\*].with.args](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswithargs)                  |    ❌     |
| [jobs.\<job_id>.steps[\*].with.entrypoint](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswithentrypoint)      |    ❌     |
| [jobs.\<job_id>.steps[\*].env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsenv)                             |    ✅     |
| [jobs.\<job_id>.steps[\*].continue-on-error](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepscontinue-on-error) |    ❌     |
| [jobs.\<job_id>.steps[\*].timeout-minutes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepstimeout-minutes)     |    ❌     |

### Job container

| Feature                                                                                                                                                        | Supported |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.\<job_id>.container](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer)                        |    ❌     |
| [jobs.\<job_id>.container.image](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerimage)             |    ❌     |
| [jobs.\<job_id>.container.credentials](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainercredentials) |    ❌     |
| [jobs.\<job_id>.container.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerenv)                 |    ❌     |
| [jobs.\<job_id>.container.ports](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainerports)             |    ❌     |
| [jobs.\<job_id>.container.volumes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainervolumes)         |    ❌     |
| [jobs.\<job_id>.container.options](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontaineroptions)         |    ❌     |

### Job strategy

| Feature                                                                                                                                                                  | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------: |
| [jobs.\<job_id>.strategy](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategy)                                    |    ❌     |
| [jobs.\<job_id>.strategy.matrix](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)                       |    ❌     |
| [jobs.\<job_id>.strategy.matrix.include](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixinclude)        |    ❌     |
| [jobs.\<job_id>.strategy.matrix.exclude](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixexclude)        |    ❌     |
| [jobs.\<job_id>.strategy.fail-fast](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast)                 |    ❌     |
| [jobs.\<job_id>.strategy.max-parallel](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymax-parallel)           |    ❌     |
| [jobs.\<job_id>.strategy.continue-on-error](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategycontinue-on-error) |    ❌     |

### Job services

| Feature                                                                                                                                                                              | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------: |
| [jobs.\<job_id>.services](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservices)                                                |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.image](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idimage)             |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.credentials](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idcredentials) |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.env](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idenv)                 |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.ports](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idports)             |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.volumes](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idvolumes)         |    ❌     |
| [jobs.\<job_id>.services.\<service_id>.options](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idservicesservice_idoptions)         |    ❌     |

### Job secrets

| Feature                                                                                                                                                   | Supported |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| [jobs.\<job_id>.secrets](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecrets)                       |    ❌     |
| [jobs.\<job_id>.secrets.inherit](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretsinherit)        |    ❌     |
| [jobs.\<job_id>.secrets.\<secret_id>](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretssecret_id) |    ❌     |
