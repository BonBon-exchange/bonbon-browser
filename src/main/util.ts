/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { app } from 'electron';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const downloadFile = (from: string, to: string) => {
  return new Promise<void>((resolve, reject) => {
    const req = https.get(from);
    // eslint-disable-next-line consistent-return
    req.on('response', (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return downloadFile(res.headers.location, to)
          .then(resolve)
          .catch(reject);
      }
      res.pipe(fs.createWriteStream(to)).on('close', resolve);
      res.on('error', reject);
      return true;
    });
    req.on('error', reject);
    req.end();
  });
};

export const changePermissions = (dir: string, mode: string | number) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    fs.chmodSync(filePath, parseInt(`${mode}`, 8));
    if (fs.statSync(filePath).isDirectory()) {
      changePermissions(filePath, mode);
    }
  });
};

export const getPath = () => {
  const savePath = app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

export const isValidHttpUrl = (s: string): boolean => {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const isValidUrl = (s: string): boolean => {
  return s.toLowerCase().indexOf('bonbon://') === 0 || isValidHttpUrl(s);
};
