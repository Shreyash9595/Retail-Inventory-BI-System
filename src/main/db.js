import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'bangles.db');
const db = new Database(dbPath);

// 1. Updated Table with PRICE column
db.prepare(`
  CREATE TABLE IF NOT EXISTS stock (
    id TEXT,
    size TEXT,
    quantity INTEGER,
    price INTEGER DEFAULT 0, -- New Column
    PRIMARY KEY (id, size)
  )
`).run();

// 2. Auto-generate (Updated to include price)
const checkData = db.prepare('SELECT count(*) as count FROM stock').get();

if (checkData.count === 0) {
  const insert = db.prepare('INSERT INTO stock (id, size, quantity, price) VALUES (?, ?, ?, ?)');
  const sizes = ['2-2', '2-4', '2-6', '2-8', '2-10', '2-12'];

  for (let i = 1; i <= 300; i++) {
    const bangleID = `A${i}`;
    sizes.forEach(size => {
      insert.run(bangleID, size, 0, 0); // Default quantity 0, Price 0
    });
  }
}

export default db;