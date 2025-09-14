// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'dev.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Initialisation des tables
db.serialize(() => {
    // Table pizza
    db.run(`
        CREATE TABLE IF NOT EXISTS pizza (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            imageUrl TEXT,
            price REAL NOT NULL,
            dailyPizza INTEGER,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `, (err) => {
        if (err) {
            console.error('Failed to create pizza table', err);
            process.exit(1);
        }
    });

    // Table ingredient
    db.run(`
        CREATE TABLE IF NOT EXISTS ingredient (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `, (err) => {
        if (err) {
            console.error('Failed to create ingredient table', err);
            process.exit(1);
        }
    });
});

module.exports = db;
