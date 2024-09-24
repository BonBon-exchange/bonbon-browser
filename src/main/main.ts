/* eslint-disable import/first */
/* eslint-disable global-require */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import * as Sentry from '@sentry/electron/main';

import './appEvents';
import './logger';

if (app.isPackaged) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

Sentry.init({
  dsn: 'https://42d1a849a9ce4cc98d47a7cf45ddbef3@o1316624.ingest.us.sentry.io/6569337',
});
