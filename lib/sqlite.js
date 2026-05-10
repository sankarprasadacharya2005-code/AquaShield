const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  // Hospital Data
  db.run(`CREATE TABLE IF NOT EXISTS hospital_data (
    id TEXT PRIMARY KEY,
    hospitalName TEXT,
    district TEXT,
    city TEXT,
    village TEXT,
    diseaseType TEXT,
    cases INTEGER,
    date TEXT,
    createdAt TEXT
  )`);

  // Feedback
  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    area TEXT,
    description TEXT,
    email TEXT,
    image TEXT,
    status TEXT,
    createdAt TEXT
  )`);

  // Alerts
  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    severity TEXT,
    city TEXT,
    district TEXT,
    createdAt TEXT
  )`);
});

module.exports = {
  run: (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  }),
  all: (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  }),
  get: (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  })
};
