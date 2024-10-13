import {linter, type LintSource} from '@codemirror/lint';
import {StateEffect, StateField} from '@codemirror/state';
import {
  DiagnosticSeverity,
  type PublishDiagnosticsParams,
} from 'vscode-languageserver-protocol';
import {posToOffset} from '../utils';

export const diagnosticsEffect = StateEffect.define<PublishDiagnosticsParams>();

export const diagnosticState = StateField.define<
  PublishDiagnosticsParams['diagnostics']
>({
  create: () => [],
  update(value, tr) {
    for (let e of tr.effects) {
      if (e.is(diagnosticsEffect)) {
        value = e.value.diagnostics;
      }
    }
    return value;
  },
});

const severities = {
  [DiagnosticSeverity.Error]: 'error',
  [DiagnosticSeverity.Warning]: 'warning',
  [DiagnosticSeverity.Information]: 'info',
  [DiagnosticSeverity.Hint]: 'info',
} as const;

const lspLinter: LintSource = async view => {
  const diagnostics = view.state.field(diagnosticState);

  return diagnostics
    .map(({range, message, severity}) => ({
      from: posToOffset(view.state.doc, range.start)!,
      to: posToOffset(view.state.doc, range.end)!,
      severity: severities[severity ?? DiagnosticSeverity.Information],
      message,
    }))
    .filter(
      ({from, to}) =>
        from !== null && to !== null && from !== undefined && to !== undefined,
    );
};

export const lspDiagnostics = () => {
  return [diagnosticState, linter(lspLinter)];
};
