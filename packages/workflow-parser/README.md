# @pipelineui/workflow-parser

> Note: this is just a patch of the
> existing package [@actions/workflow-parser](https://github.com/actions/languageservices/tree/main/workflow-parser)

## Motivation

While integrating the existing github workflow-parser, I've encountered some issues while trying to parse my existing
workflows. Main issues are also related to the exported format, which seems to have some troubles.

## Changes

- Package is now re-bundled with ESM and cjs interop, in order to be used across different environments.
- Update the `if` expression parsing, which now returns the raw text instead of a `success()` placeholder.

## Development

This package contains a `local` folder which is a snapshot of @actions/workflow-parser@0.3.13.
In order to apply patch to the package, develop on it, then call the `patch-parser` command.