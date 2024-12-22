import { Item } from '../types';
import { db } from './sqlite';

export class ItemsRepository {
  public async getItems(): Promise<Item[]> {
    return new Promise<Item[]>((resolve, reject) => {
      db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows as Item[]);
      });
    });
  }

  public async addItem(name: string): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO items (name) VALUES (?)');
      stmt.run(name, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, name } as Item);
      });
      stmt.finalize();
    });
  }
}

export const itemsRepository = new ItemsRepository();
