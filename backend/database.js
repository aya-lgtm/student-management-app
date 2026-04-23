const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'students.db'), (err) => {
  if (err) console.error('Erreur DB:', err);
  else console.log('✅ Base de données connectée');
});

db.run(`CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT,
  adresse TEXT,
  filiere TEXT NOT NULL,
  niveau INTEGER NOT NULL CHECK(niveau BETWEEN 1 AND 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;