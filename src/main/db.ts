import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(app.getPath('userData'), 'db.db');
const db = new sqlite3.Database(dbPath);

db.run(
  'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, url TEXT NOT NULL, date TEXT NOT NULL, title TEXT)'
);

db.run(
  'CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, url TEXT NOT NULL, name TEXT)'
);

db.run(
  'CREATE TABLE IF NOT EXISTS downloads (id INTEGER PRIMARY KEY, savePath TEXT NOT NULL, filename TEXT, date TEXT, startTime DECIMAL(25, 15))'
);

// migrate history table => add title column
db.get('SELECT title FROM history', (err) => {
  if (err) {
    db.run('ALTER TABLE history ADD title TEXT');
  }
});

export default db;
