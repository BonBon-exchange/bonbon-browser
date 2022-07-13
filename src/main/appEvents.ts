/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
import contextMenu from 'electron-context-menu';
import path from 'path';
import { app, ipcMain, session } from 'electron';
import Nucleus from 'nucleus-nodejs';
import i18n from './i18n';

import { event } from './analytics';
import {
  getExtensionsObject,
  installUserExtensions,
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
    });

    contextMenu({
      prepend: (_defaultActions, params) => [
        // App context menu below
        {
          label: i18n.t('Close'),
          visible: params.y > 30 && params.x < 50,
          click: () => {
            const selectedView = getSelectedView();
            selectedView?.webContents.send('close-webview', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Close all'),
          visible: params.y > 30 && params.x < 50,
          click: () => {
            const selectedView = getSelectedView();
            selectedView?.webContents.send('close-all-webview');
          },
        },
        {
          label: i18n.t('Close others'),
          visible: params.y > 30 && params.x < 50,
          click: () => {
            const selectedView = getSelectedView();
            selectedView?.webContents.send('close-others-webview', {
              x: params.x,
              y: params.y,
            });
          },
        },

        // TitleBar context menu below
        {
          label: i18n.t('Close'),
          visible: params.y <= 30,
          click: () => {
            const mainWindow = getMainWindow();
            mainWindow?.webContents.send('close-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Close all'),
          visible: params.y <= 30,
          click: () => {
            const mainWindow = getMainWindow();
            mainWindow?.webContents.send('close-all-tab');
          },
        },
        {
          label: i18n.t('Close others'),
          visible: params.y <= 30,
          click: () => {
            const mainWindow = getMainWindow();
            mainWindow?.webContents.send('close-others-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Rename'),
          visible: params.y <= 30,
          click: () => {
            const mainWindow = getMainWindow();
            mainWindow?.webContents.send('rename-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          type: 'separator',
        },
      ],
      window: contents,
      showInspectElement: true,
      showSearchWithGoogle: false,
      showCopyImageAddress: true,
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

    installUserExtensions();

    app.on('activate', () => {
      const mainWindow = getMainWindow();
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
