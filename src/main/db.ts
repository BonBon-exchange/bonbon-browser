import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(app.getPath('userData'), 'db.db');
const db = new sqlite3.Database(dbPath);

db.run(
  'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, url TEXT NOT NULL, date TEXT NOT NULL)'
);

export default db;
