import { Database } from 'sqlite3';
import { existsSync, mkdirSync } from 'fs';

const databaseDir = 'temp';
if (!existsSync(databaseDir)) {
  mkdirSync(databaseDir);
}

//const db = new Database(':memory:');
const db = new Database(`${databaseDir}/items.db`);
//const db = new Database(`${databaseDir}/asw_gui.db`);

// Initialize the database
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)'
  );
});

export { db };
