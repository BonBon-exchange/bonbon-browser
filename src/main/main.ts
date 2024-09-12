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

import './appEvents';
import './logger';

if (app.isPackaged) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}
