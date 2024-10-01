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
// import { autoUpdater } from 'electron-updater';

import './appEvents';
import './logger';

if (app.isPackaged) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// app.on('ready', () => {
//   // Check for updates and notify the user
//   autoUpdater.checkForUpdatesAndNotify();
// });

// autoUpdater.on('update-available', () => {
//   dialog.showMessageBox({
//     type: 'info',
//     title: 'Update Available',
//     message: 'A new version is available. Downloading now...',
//   });
// });

// autoUpdater.on('update-downloaded', () => {
//   const options = {
//     type: 'info' as const,
//     buttons: ['Restart', 'Later'],
//     title: 'Update Available',
//     message: 'A new update is available. Restart to apply the update?',
//   };
//   dialog
//     .showMessageBox(options)
//     .then((result) => {
//       if (result.response === 0) {
//         autoUpdater.quitAndInstall();
//       }
//     })
//     .catch(console.log);
// });
