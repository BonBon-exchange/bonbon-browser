/* eslint-disable import/no-dynamic-require */
/* eslint-disable consistent-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable global-require */
/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import path from 'path';
import { app, session } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions-production';
import rimraf from 'rimraf';
import request from 'request';

import { getStore } from './store';
// eslint-disable-next-line import/no-cycle
import { getMainWindow, getSelectedView } from './browser';
import { changePermissions, getPath, downloadFile } from './util';

const unzip: any = require('unzip-crx-3');

const store = getStore();
let extensions: ElectronChromeExtensions;

export const getExtensionsObject = () => extensions;

export const installDevtoolsExtensions = async (): Promise<void> => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensionsToInstall = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensionsToInstall.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

export const makeChromeExtensionSupport = () => {
  extensions = new ElectronChromeExtensions({
    session: session.fromPartition('persist:user-partition'),
    modulePath: app.isPackaged
      ? path.join(
          __dirname,
          '../../../node_modules/electron-chrome-extensions-production'
        )
      : undefined,
    createTab(details) {
      return new Promise((resolve, reject) => {
        const selectedView = getSelectedView();
        selectedView?.webContents.send('new-window', { url: details.url });
        const mainWindow = getMainWindow();
        if (mainWindow && selectedView)
          resolve([selectedView.webContents, mainWindow]);
        else reject(new Error('mainWindow is null'));
      });
    },
    removeTab(_tab, _browserWindow) {
      // Optionally implemented for chrome.tabs.remove support
      // console.log('remove tab', tab, browserWindow);
      return new Error('removeTab is not implemented yet.');
    },
    createWindow(_details) {
      return new Promise((_resolve, reject) => {
        reject(new Error('createWindow es not implemented yet.'));
      });
    },
    removeWindow(_details) {
      // console.log('remove window', details);
      return new Error('removeWindow is not implemented yet.');
    },
    assignTabDetails(_details, _tab) {
      // console.log('assign details', details, tab);
      return new Error('assignTabDetails is not implemented yet.');
    },
  });
};

const downloadChromeExtension = (
  chromeStoreID: string,
  forceDownload?: boolean,
  attempts = 5
): Promise<string> => {
  console.log('Downloading extension: ', chromeStoreID);
  const extensionsStore = getPath();
  if (!fs.existsSync(extensionsStore)) {
    fs.mkdirSync(extensionsStore, { recursive: true });
  }
  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(extensionFolder) || forceDownload) {
      if (fs.existsSync(extensionFolder)) {
        rimraf.sync(extensionFolder);
      }
      const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${chromeStoreID}%26uc&prodversion=32`; // eslint-disable-line
      const filePath = path.resolve(`${extensionFolder}.crx`);
      downloadFile(fileURL, filePath)
        .then(() => {
          unzip(filePath, extensionFolder)
            .then(() => {
              changePermissions(extensionFolder, 755);
              resolve(extensionFolder);
            })
            .catch((err: Error) => {
              if (
                !fs.existsSync(path.resolve(extensionFolder, 'manifest.json'))
              ) {
                return reject(err);
              }
            });
        })
        .catch((err) => {
          console.log(`Failed to fetch extension, trying ${attempts - 1} more times`); // eslint-disable-line
          if (attempts <= 1) {
            return reject(err);
          }
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1)
              .then(resolve)
              .catch(reject);
          }, 200);
        });
    } else {
      resolve(extensionFolder);
    }
  });
};

export const getAllExtensionsIdsFromFolder = (): string[] => {
  return fs
    .readdirSync(getPath(), { withFileTypes: true })
    .filter((item: any) => item.isDirectory())
    .map((item: any) => item.name);
};

export const getAllExtensions = (): Electron.Extension[] => {
  return session.fromPartition('persist:user-partition').getAllExtensions();
};

export const loadExtensions = () => {
  getAllExtensionsIdsFromFolder().forEach((dir) => {
    const extPath = path.join(getPath(), dir);
    session.fromPartition('persist:user-partition').loadExtension(extPath);
  });
};

export const installExtension = (
  id: string,
  forceDownload?: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    downloadChromeExtension(id, forceDownload)
      .then(() => {
        session.fromPartition('persist:user-partition').removeExtension(id);
        session
          .fromPartition('persist:user-partition')
          .loadExtension(path.join(getPath(), id))
          .then(() => resolve())
          .catch(() => reject(new Error(`Couldn't install extension.`)));
      })
      .catch(() => reject(new Error(`Couldn't install extension.`)));
  });
};

export const updateExtensions = (extId?: string) => {
  let ids = [];
  if (!extId) {
    ids = getAllExtensionsIdsFromFolder();
  } else {
    ids.push(extId);
  }

  const regex = /<span class="C-b-p-D-Xe h-C-b-p-D-md">\s*(.+?)\s*<\/span>/gm;
  const allExts = getAllExtensions();
  ids.forEach((id: string) => {
    request(
      { uri: `https://chrome.google.com/webstore/detail/${id}` },
      (_error: any, _response: any, body: any) => {
        const result = regex.exec(body);
        const ext = allExts.find((ex) => ex.path.includes(id));
        if (result && ext) {
          if (result[1] !== ext.version) installExtension(id, true);
        }
      }
    );
  });
};

export const installAndLoadUserExtensions = () => {
  const installUBlockOrigin = store.get('extensions.forceInstallUBlockOrigin');

  if (installUBlockOrigin === true || installUBlockOrigin === undefined) {
    downloadChromeExtension('cjpalhdlnbpafiamejdnhcphjbkeiagm') // uBlockOrigin
      .then(() => {
        loadExtensions();
        setTimeout(() => updateExtensions(), 30000);
      })
      .catch((err) => {
        console.log(err);
        loadExtensions();
        setTimeout(() => updateExtensions(), 30000);
      });
  } else {
    loadExtensions();
    setTimeout(() => updateExtensions(), 30000);
  }
  if (installUBlockOrigin === undefined)
    store.set('extensions.forceInstallUBlockOrigin', false);
};

export const deleteExtension = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ext = session
      .fromPartition('persist:user-partition')
      .getExtension(id);
    session.fromPartition('persist:user-partition').removeExtension(id);
    rimraf(ext.path, (err) => {
      if (!err) {
        rimraf(`${ext.path}.crx`, () => resolve());
        getExtensionsObject().removeExtension(ext);
        getMainWindow()?.webContents.send('remove-extension', id);
      } else {
        reject();
      }
    });
  });
};
