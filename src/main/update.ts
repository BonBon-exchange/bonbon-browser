import { app } from 'electron';
import { autoUpdater } from 'electron-updater';

export default async function checkForUpdates() {
  return autoUpdater.checkForUpdatesAndNotify();
}

const main = async () => {
  await app.whenReady();
  checkForUpdates();
};

main();
