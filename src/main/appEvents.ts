/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import { app, session } from 'electron';
import contextMenu from 'electron-context-menu';
import Nucleus from 'nucleus-nodejs';
import path from 'path';
import i18n from './i18n';

import { event } from './analytics';
import {
  createWindow,
  getMainWindow,
  getSelectedView,
  setBrowserViewBonds,
} from './browser';
import {
  getExtensionsObject,
  installAndLoadUserExtensions,
  makeChromeExtensionSupport,
} from './extensions';
import {
  getBrowsers,
  getCertificateErrorAuth,
  makeIpcMainEvents,
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
    event('close_app');
    app.quit();
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
      const pathToPreloadScript = app.isPackaged
        ? path.join(__dirname, '../../../assets/webview-preload.js')
        : path.join(__dirname, '../../assets/webview-preload.js');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wawevent.sender.session.setPreloads([`${pathToPreloadScript}`]);
    });

    contents.on('did-attach-webview', (_daw, webContents) => {
      getBrowsers()[webContents.id] = webContents;
      webContents.addListener('dom-ready', () => {
        if (webContents.getURL() === 'https://web.whatsapp.com/') {
          webContents.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
          );
        } else {
          webContents.setUserAgent('');
        }

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
        prepend: () => [
          {
            label: i18n.t('Set as default window size'),
            click: () => {
              contents.send('set-default-window-size', webContents.id);
            },
          },
          {
            label: i18n.t('Distribute windows evenly'),
            click: () => {
              contents.send('distribute-windows-evenly');
            },
          },
        ],
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
    installAndLoadUserExtensions();
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

          if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
          } else {
            mainWindow.show();
            if (process.platform !== 'darwin') {
              mainWindow.maximize();
            }
          }
        }

        if (!app.isPackaged)
          mainWindow?.webContents.openDevTools({ mode: 'detach' });
      })
      .catch(console.log);

    app.on('activate', () => {
      const mainWindow = getMainWindow();
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
