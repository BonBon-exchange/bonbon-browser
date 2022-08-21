/* eslint-disable import/prefer-default-export */
import { parseDomain, fromUrl, ParseResultType } from 'parse-domain';

import { History } from 'types/history';
import { DomainSuggestion } from 'types/suggestions';

import db from './db';

export const addHistory = (args: {
  url: string;
  title: string;
}): Promise<History> => {
  return new Promise((resolve, reject) => {
    try {
      const parseResult = parseDomain(fromUrl(args.url));

      if (parseResult.type === ParseResultType.Listed) {
        const domain = [
          parseResult.domain,
          parseResult.topLevelDomains.join('.'),
        ].join('.');

        db.run(
          'INSERT INTO history (url, date, title, domain, host) VALUES (?, datetime("now", "localtime"), ?, ?, ?)',
          args.url,
          args.title,
          domain,
          parseResult.hostname,
          () => {
            db.all(
              'SELECT id, date FROM history WHERE url = ? ORDER BY id DESC LIMIT 1',
              args.url,
              (err, rows) => {
                if (err) {
                  reject(
                    new Error(
                      `Error when adding to history while selecting Id.`
                    )
                  );
                } else {
                  resolve({
                    ...args,
                    id: Number(rows[0].id),
                    date: rows[0].date.toString(),
                    domain,
                    host: parseResult.hostname,
                  });
                }
              }
            );
          }
        );
      } else {
        reject(new Error(`Error when adding to history: invalid url.`));
      }
    } catch (e: any) {
      reject(new Error(`Error when adding to history: ${e?.message}`));
    }
  });
};

export const findHistoryByDomain = (
  input: string
): Promise<DomainSuggestion[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT DISTINCT domain FROM history WHERE domain LIKE ? LIMIT 10',
      `${input}%`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const removeHistory = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM history WHERE id = ?', id, (err?: Error) => {
      if (err)
        reject(new Error(`Couldn't delete from history: ${err.message}`));
      else resolve();
    });
  });
};

export const clearHistory = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM history', (err?: Error) => {
      if (err) reject(new Error(`Couldn't delete history: ${err.message}`));
      else resolve();
    });
  });
};

export const findInHistory = (str: string): Promise<History[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM history WHERE url LIKE ? GROUP BY url ORDER BY date DESC LIMIT 20',
      `%${str}%`,
      (err, rows: History[]) => {
        if (err) reject(new Error(`Couldn't get history: ${err.message}`));
        else resolve(rows);
      }
    );
  });
};

export const getAllHistory = (): Promise<History[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM history ORDER BY date DESC',
      (err: Error | null, rows: History[]) => {
        if (err) reject(new Error(`Couldn't get history: ${err.message}`));
        else resolve(rows);
      }
    );
  });
};
