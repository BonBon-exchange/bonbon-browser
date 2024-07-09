import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(app.getPath('userData'), 'db.db');
const db = new sqlite3.Database(dbPath);

db.run(
  'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, url TEXT NOT NULL, date TEXT NOT NULL, title TEXT, domain TEXT NOT NULL, host TEXT NOT NULL)'
);

db.run(
  'CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, url TEXT NOT NULL, name TEXT, domain NOT NULL, host TEXT NOT NULL)'
);

db.run(
  'CREATE TABLE IF NOT EXISTS downloads (id INTEGER PRIMARY KEY, savePath TEXT NOT NULL, filename TEXT, date TEXT, startTime DECIMAL(25, 15))'
);

db.run(
  'CREATE TABLE IF NOT EXISTS bookmarks_tags (id INTEGER PRIMARY KEY, bookmark_id INTEGER NOT NULL, tag TEXT NOT NULL)'
);

// migrate history table => add title column
db.get(
  'SELECT COUNT(*) AS CNTREC FROM pragma_table_info("history") WHERE name="title"',
  (_err, row: { CNTREC: number }) => {
    if (row.CNTREC === 0) {
      db.run('ALTER TABLE history ADD title TEXT');
    }
  }
);

// migrate history table => add domain column
db.get(
  'SELECT COUNT(*) AS CNTREC FROM pragma_table_info("history") WHERE name="domain"',
  (_err, row: { CNTREC: number }) => {
    if (row.CNTREC === 0) {
      db.run('ALTER TABLE history ADD domain TEXT');
    }
  }
);

// migrate bookmarks table => add domain column
db.get(
  'SELECT COUNT(*) AS CNTREC FROM pragma_table_info("bookmarks") WHERE name="domain"',
  (_err, row: { CNTREC: number }) => {
    if (row.CNTREC === 0) {
      db.run('ALTER TABLE bookmarks ADD domain TEXT');
    }
  }
);

// migrate history table => add host column
db.get(
  'SELECT COUNT(*) AS CNTREC FROM pragma_table_info("history") WHERE name="host"',
  (_err, row: { CNTREC: number }) => {
    if (row.CNTREC === 0) {
      db.run('ALTER TABLE history ADD host TEXT');
    }
  }
);

// migrate bookmarks table => add host column
db.get(
  'SELECT COUNT(*) AS CNTREC FROM pragma_table_info("bookmarks") WHERE name="host"',
  (_err, row: { CNTREC: number }) => {
    if (row.CNTREC === 0) {
      db.run('ALTER TABLE bookmarks ADD host TEXT');
    }
  }
);

export default db;
