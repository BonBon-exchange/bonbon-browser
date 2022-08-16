/* eslint-disable promise/no-nesting */
/* eslint-disable promise/no-promise-in-callback */
/* eslint-disable promise/always-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { parseDomain, fromUrl, ParseResultType } from 'parse-domain';

import { Bookmark, Provider, Tag } from 'types/bookmarks';
import { DomainSuggestion } from 'types/suggestions';

import db from './db';

const BOOKMARKS_PATH: Record<Provider, string[]> = {
  Chrome: [
    path.join(
      app.getPath('userData'),
      '../../Local/Google/Chrome/User Data/Default/Bookmarks'
    ),
    path.join(
      app.getPath('userData'),
      '../../Local/Google/Chrome/User Data/Profile 1/Bookmarks'
    ),
    path.join(
      app.getPath('userData'),
      '../../Local/Google/Chrome/User Data/Profile 2/Bookmarks'
    ),
  ],
  Edge: [
    path.join(
      app.getPath('userData'),
      '../../Local/Microsoft/Edge/User Data/Default/Bookmarks'
    ),
  ],
  Brave: [
    path.join(
      app.getPath('userData'),
      '../../Local/BraveSoftware/Brave-Browser/User Data/Default/Bookmarks'
    ),
  ],
};

export const getBookmarksProviders = (): Provider[] => {
  const result: Provider[] = [];
  for (const brow in BOOKMARKS_PATH) {
    const res = BOOKMARKS_PATH[brow as Provider].every(
      (p: string) => !fs.existsSync(p)
    );
    if (!res) result.push(brow as Provider);
  }
  return result;
};

const itemToBookmark = (item: any, tags: string[]): Bookmark => {
  const parseResult = parseDomain(fromUrl(item.url));
  let domain = '';

  if (parseResult.type === ParseResultType.Listed) {
    domain = [parseResult.domain, parseResult.topLevelDomains.join('.')].join(
      '.'
    );
  }
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    domain,
    host: parseResult.hostname.toString(),
    tags,
  };
};

const folderToBms = (folder: any, tags: string[]): Bookmark[] => {
  const bms: any[] = [];
  folder.forEach((item: any) => {
    if (item.type === 'folder') {
      bms.push(...folderToBms(item.children, [item.name, ...tags]));
    } else {
      bms.push(itemToBookmark(item, tags));
    }
  });
  return bms;
};

const rawToBookmarks = (raw: any): Bookmark[] => {
  let bms: any[] = [];
  if (raw.roots) {
    for (const folder in raw.roots) {
      bms = [
        ...folderToBms(raw.roots[folder].children, [raw.roots[folder].name]),
        ...bms,
      ];
    }
  }
  return bms;
};

export const getBookmarksFromProvider = (provider: Provider): Bookmark[] => {
  if (BOOKMARKS_PATH[provider]) {
    return BOOKMARKS_PATH[provider].reduce((acc: any[], curr: string) => {
      const rawBm = JSON.parse(fs.readFileSync(curr, 'utf-8'));
      const bm: any[] = rawToBookmarks(rawBm);
      return [...acc, ...bm];
    }, []);
  }

  return [];
};

export const isBookmarked = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    db.get('SELECT * FROM bookmarks WHERE url = ?', url, (_err, row) =>
      resolve(row !== undefined)
    );
  });
};

const getBookmark = (url: string): Promise<Bookmark> => {
  return new Promise((resolve) => {
    db.get('SELECT * FROM bookmarks WHERE url = ?', url, (_err, row) =>
      resolve(row)
    );
  });
};

const removeTags = (bookmarkId: number) => {
  db.run('DELETE FROM bookmarks_tags WHERE bookmark_id = ?', bookmarkId);
};

export const removeBookmark = (url: string) => {
  getBookmark(url)
    .then((b: any) => {
      if (b && b.id) {
        removeTags(b.id);
        db.run('DELETE FROM bookmarks WHERE url = ?', url);
      }
    })
    .catch(console.log);
};

export const getAllBookmarks = (): Promise<Bookmark[]> => {
  return new Promise((resolve) => {
    db.all(
      'SELECT b.*, json_group_array(bt.tag) as tags FROM bookmarks b LEFT JOIN bookmarks_tags bt ON bt.bookmark_id = b.id GROUP BY b.id',
      (err, rows) => {
        if (err) console.log(err);
        resolve(
          rows.map((row) => {
            try {
              return {
                ...row,
                tags: JSON.parse(row.tags).filter((t: any) => t !== null),
              };
            } catch {
              return row;
            }
          })
        );
      }
    );
  });
};

export const importBookmarks = (bookmarks: Partial<Bookmark>[]) => {
  bookmarks.forEach((b) => {
    if (b.url) {
      isBookmarked(b.url)
        .then((res) => {
          if (res === false) {
            db.run(
              'INSERT INTO bookmarks (url, name, domain, host) VALUES (?, ?, ?, ?)',
              b.url,
              b.name,
              b.domain,
              b.host,
              (err?: Error) => {
                if (err) {
                  console.log(err);
                  return;
                }

                if (b.url) {
                  getBookmark(b.url)
                    .then((book: any) => {
                      if (!book || !book.id) return;
                      b.tags?.forEach((tag: string) => {
                        db.run(
                          'INSERT INTO bookmarks_tags (bookmark_id, tag) VALUES (?, ?)',
                          book.id,
                          tag
                        );
                      });
                    })
                    .catch(console.log);
                }
              }
            );
          }
        })
        .catch(console.log);
    }
  });
};

export const getBookmarksTags = (): Promise<Tag[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT DISTINCT tag FROM bookmarks_tags', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const editBookmark = (bookmark: Partial<Bookmark>) => {
  db.run(
    'UPDATE bookmarks SET url = ?, name = ? WHERE id = ?',
    bookmark.url,
    bookmark.name,
    bookmark.id
  );
  if (bookmark.id) removeTags(bookmark.id);
  bookmark.tags?.forEach((tag: string) => {
    db.run(
      'INSERT INTO bookmarks_tags (bookmark_id, tag) VALUES (?, ?)',
      bookmark.id,
      tag
    );
  });
};

export const addBookmark = (args: {
  url: string;
  name: string;
}): Promise<Bookmark> => {
  return new Promise((resolve, reject) => {
    try {
      const parseResult = parseDomain(fromUrl(args.url));

      if (parseResult.type === ParseResultType.Listed) {
        const domain = [
          parseResult.domain,
          parseResult.topLevelDomains.join('.'),
        ].join('.');

        isBookmarked(args.url)
          .then((res) => {
            if (!res) {
              db.run(
                'INSERT INTO bookmarks (url, name, host, domain) VALUES (?, ?, ?, ?)',
                args.url,
                args.name,
                parseResult.hostname,
                domain,
                () => {
                  db.get(
                    'SELECT id FROM bookmarks WHERE url = ?',
                    args.url,
                    (_err, row) =>
                      resolve({
                        ...args,
                        id: row.id,
                        host: parseResult.hostname,
                        domain,
                      })
                  );
                }
              );
            }
          })
          .catch((e) => {
            reject(new Error(`Error when adding bookmark: ${e?.message}`));
          });
      } else {
        reject(new Error(`Error when adding bookmark: invalid url.`));
      }
    } catch (e: any) {
      reject(new Error(`Error when adding bookmark: ${e?.message}`));
    }
  });
};

export const findBookmarksByDomain = (
  input: string
): Promise<DomainSuggestion[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, url, domain FROM bookmarks WHERE domain LIKE ? LIMIT 10',
      `${input}%`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const findInBookmarks = (str: string): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM bookmarks WHERE url LIKE ? GROUP BY url ORDER BY id DESC LIMIT 5',
      `%${str}%`,
      (err, rows) => {
        if (err) reject(new Error(`Couldn't get bookmarks: ${err.message}`));
        else resolve(rows);
      }
    );
  });
};
