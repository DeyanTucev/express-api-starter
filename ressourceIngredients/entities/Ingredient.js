// entities/Ingredient.js
const db = require('../../config/database');

class Ingredient {
    static create({ name }) {
        const sql = `INSERT INTO ingredient (name, created_at, updated_at)
                 VALUES (?, datetime('now'), datetime('now'))`;
        const params = [ name ];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                Ingredient.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }

    static findAll() {
        const sql = `SELECT * FROM ingredient ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM ingredient WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name }) {
        const sql = `
      UPDATE ingredient
      SET name = COALESCE(?, name),
          updated_at = datetime('now')
      WHERE id = ?
    `;
        const params = [name, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Ingredient.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM ingredient WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = Ingredient;
