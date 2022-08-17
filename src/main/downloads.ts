/* eslint-disable import/prefer-default-export */
import { Download } from 'types/downloads';
import { IpcAddDownload } from 'types/ipc';

import db from './db';

export const addDownload = (args: IpcAddDownload): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM downloads WHERE savePath = ? AND startTime = ?',
      args.savePath,
      args.startTime,
      (err: Error | null, row: Download[]) => {
        if (err) reject(new Error(`Couldn't add download: ${err.message}`));
        else if (!row) {
          db.run(
            'INSERT INTO downloads (savePath, filename, date, startTime) VALUES (?, ?, datetime("now", "localtime"), ?)',
            args.savePath,
            args.filename,
            args.startTime,
            (err2?: Error) => {
              if (err2)
                reject(new Error(`Couldn't add download: ${err2.message}`));
              else resolve();
            }
          );
        } else {
          reject(new Error(`Couldn't add download: download already exists.`));
        }
      }
    );
  });
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

export const clearDownloads = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM downloads', (err?) => {
      if (err) reject(new Error(`Couldn't clear downloads: ${err.message}`));
      else resolve();
    });
  });
};

export const removeDownload = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM downloads WHERE id = ?', id, (err?) => {
      if (err) reject(new Error(`Couldn't delete download: ${err.message}`));
      else resolve();
    });
  });
};
