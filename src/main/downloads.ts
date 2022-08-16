/* eslint-disable import/prefer-default-export */
import { Download } from 'types/downloads';
import { IpcAddDownload } from 'types/ipc';

import db from './db';

export const addDownload = (args: IpcAddDownload): void => {
  db.get(
    'SELECT * FROM downloads WHERE savePath = ? AND startTime = ?',
    args.savePath,
    args.startTime,
    (_err: unknown, row: Download[]) => {
      if (!row) {
        db.run(
          'INSERT INTO downloads (savePath, filename, date, startTime) VALUES (?, ?, datetime("now", "localtime"), ?)',
          args.savePath,
          args.filename,
          args.startTime
        );
      }
    }
  );
};

export const getAllDownloads = (): Promise<Download[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM downloads ORDER BY date DESC',
      (err, rows: Download[]) => {
        if (err) reject(new Error(`Couldn't get downloads: ${err.message}`));
        else resolve(rows);
      }
    );
  });
};

export const clearDownloads = (): void => {
  db.run('DELETE FROM downloads');
};

export const removeDownload = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM downloads WHERE id = ?', id, (err?) => {
      if (err) reject(new Error(`Couldn't delete download: ${err.message}`));
      else resolve();
    });
  });
};
