// src/mocks/node.js
import {setupServer} from 'msw/node';
import {handlers} from './handlers';

export const server = setupServer(...handlers);
