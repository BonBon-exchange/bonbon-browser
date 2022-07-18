/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import contextMenu from 'electron-context-menu';
import path from 'path';
import { app, session } from 'electron';
import Nucleus from 'nucleus-nodejs';
import i18n from './i18n';

import { event } from './analytics';
import {
  getExtensionsObject,
  installAndLoadUserExtensions,
  makeChromeExtensionSupport,
} from './extensions';
import {
  getMainWindow,
  getSelectedView,
  createWindow,
  setBrowserViewBonds,
} from './browser';
import {
  makeIpcMainEvents,
  getBrowsers,
  getCertificateErrorAuth,
} from './ipcMainEvents';

const downloadItemEventAction = (
  item: Electron.DownloadItem,
  state: string
) => {
  if (item.getSavePath()) {
    getMainWindow()?.webContents.send('download-state', state);
    getSelectedView()?.webContents.send('downloading', {
      savePath: item.getSavePath(),
      filename: item.getFilename(),
      progress: item.getReceivedBytes() / item.getTotalBytes(),
      etag: item.getETag(),
      startTime: item.getStartTime(),
      state,
    });
  }
};

const makeAppEvents = () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      event('close_app');
      app.quit();
    }
  });

  app.on('web-contents-created', (_event, contents) => {
    const extensions = getExtensionsObject();

    contents.on('enter-html-full-screen', () => {
      const view = getSelectedView();
      if (view) setBrowserViewBonds(view, true);
    });

    contents.on('leave-html-full-screen', () => {
      const view = getSelectedView();
      if (view) setBrowserViewBonds(view, false);
    });

    contents.on('new-window', (e, url) => {
      e.preventDefault();
      const selectedView = getSelectedView();
      selectedView?.webContents.send('new-window', { url });
    });

    contents.on('will-attach-webview', (wawevent) => {
      const pathToPreloadScipt = app.isPackaged
        ? path.join(__dirname, '../../../assets/webview-preload.js')
        : path.join(__dirname, '../../assets/webview-preload.js');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wawevent.sender.session.setPreloads([`${pathToPreloadScipt}`]);
    });

    contents.on('did-attach-webview', (_daw, webContents) => {
      getBrowsers()[webContents.id] = webContents;
      webContents.addListener('dom-ready', () => {
        webContents.send('created-webcontents', {
          webContentsId: webContents.id,
        });
      });
      const mainWindow = getMainWindow();
      if (mainWindow) extensions.addTab(webContents, mainWindow);

      webContents.on(
        'certificate-error',
        (_e, _url, _error, certificate, callback) => {
          const isTrusted = getCertificateErrorAuth(
            webContents.id,
            certificate.fingerprint
          );
          callback(isTrusted);
          if (!isTrusted) {
            getSelectedView()?.webContents.send('certificate-error', {
              webContentsId: webContents.id,
              fingerprint: certificate.fingerprint,
            });
          }
        }
      );

      webContents.session.on('will-download', (_e, item, _wc) => {
        item.on('updated', (_ei, state) => {
          downloadItemEventAction(item, state);
        });
        item.on('done', (_ei, state) => {
          downloadItemEventAction(item, state);
        });
      });

      contextMenu({
        window: webContents,
        showInspectElement: true,
        showSearchWithGoogle: false,
        showCopyImageAddress: true,
      });
    });
  });
};

app
  .whenReady()
  .then(() => {
    Nucleus.appStarted();
    makeChromeExtensionSupport();
    makeIpcMainEvents();
    makeAppEvents();
    createWindow()
      .then(() => {
        getMainWindow()
          ?.webContents.executeJavaScript(`localStorage.getItem("i18nextLng");`)
          .then((locale) => {
            if (locale) i18n.changeLanguage(locale);
          });

        session
          .fromPartition('persist:user-partition')
          .setPermissionRequestHandler((webContents, permission, callback) => {
            const url = webContents.getURL();
            return url === 'http://localhost:1212/index.html' ||
              permission === 'fullscreen'
              ? callback(true)
              : callback(false);
          });

        const mainWindow = getMainWindow();

        if (mainWindow) {
          const extensions = getExtensionsObject();
          extensions.addTab(mainWindow.webContents, mainWindow);
          extensions.selectTab(mainWindow.webContents);
        }

        if (!app.isPackaged)
          mainWindow?.webContents.openDevTools({ mode: 'detach' });
      })
      .catch(console.log);

    installAndLoadUserExtensions();

    app.on('activate', () => {
      const mainWindow = getMainWindow();
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
