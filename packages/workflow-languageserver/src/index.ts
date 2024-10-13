import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection as createBrowserConnection,
} from 'vscode-languageserver/browser';
import {initConnection} from '@actions/languageserver/connection';

function getConnection(): any {
  const messageReader = new BrowserMessageReader(self);
  const messageWriter = new BrowserMessageWriter(self);
  return createBrowserConnection(messageReader, messageWriter, {});
}

initConnection(getConnection());
