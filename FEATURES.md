# Github Workflow Syntax Supported Features

### General

| Feature                                                               | Supported | Reference                                                                                                                                        |
| --------------------------------------------------------------------- | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                                                                  |    ✅     | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#name                                                     |
| run-name                                                              |    ❌     | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#run-name                                                 |
| on                                                                    |    ✅     | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#on                                                       |
| on.<event_name>.types                                                 |    ✅     | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onevent_nametypes                                        |
| on.on.<pull_request\|pull_request_target>.<branches\|branches-ignore> |    ❌     | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore |

### On

| on | ✅ | https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#on
| on.
