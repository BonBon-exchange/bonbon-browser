/* eslint-disable import/prefer-default-export */
import { parseDomain, fromUrl, ParseResultType } from 'parse-domain';

import db from './db';

export const addHistory = (args: { url: string; title: string }) => {
  return new Promise((resolve, reject) => {
    try {
      const parseResult = parseDomain(fromUrl(args.url));

      if (parseResult.type === ParseResultType.Listed) {
        const domain = [
          parseResult.domain,
          parseResult.topLevelDomains.join('.'),
        ].join('.');

        db.run(
          'INSERT INTO history (url, date, title, domain) VALUES (?, datetime("now", "localtime"), ?, ?)',
          args.url,
          args.title,
          domain,
          () => resolve({ ...args, domain })
        );
      } else {
        reject(new Error(`Error when adding to history: invalid url.`));
      }
    } catch (e: any) {
      reject(new Error(`Error when adding to history: ${e?.message}`));
    }
  });
};

export const findHistoryByDomain = (input: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, url, domain FROM history WHERE domain LIKE ? LIMIT 10',
      `${input}%`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
