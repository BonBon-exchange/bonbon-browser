/* eslint-disable import/prefer-default-export */
import { Board } from 'types/boards';
import db from './db';

export const getAllBoards = async () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM boards ORDER BY id DESC',
            (err: Error | null, rows: Board[]) => {
              if (err) reject(new Error(`Couldn't get boards: ${err.message}`));
              else resolve(rows);
            }
          );
    })
}