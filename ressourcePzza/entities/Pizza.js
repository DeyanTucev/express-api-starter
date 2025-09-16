// entities/Pizza.js
const db = require('../../config/database');

class Pizza {
    // Créer une pizza avec vérification des ingrédients et remplissage de pizza_ingredient
    static async create({ name, description, imageUrl, price, dailyPizza, ingredientIds = [] }) {
        try {
            // 1️⃣ Vérifier les ingrédients via l'API
            const ingredients = await Promise.all(
                ingredientIds.map(async (id) => {
                    const response = await fetch(`http://localhost:${process.env.PORT}/api/ingredients/${id}`);
                    if (!response.ok) throw new Error(`Ingrédient ${id} introuvable`);
                    return response.json();
                })
            );

            // 2️⃣ Insérer la pizza
            const sql = `
                INSERT INTO pizza (name, description, imageUrl, price, dailyPizza, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `;
            const params = [name, description || null, imageUrl || null, price, dailyPizza || null];

            const pizzaId = await new Promise((resolve, reject) => {
                db.run(sql, params, function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                });
            });

            // 3️⃣ Remplir la table pizza_ingredient
            const stmt = db.prepare(`INSERT INTO pizza_ingredient (pizza_id, ingredient_id) VALUES (?, ?)`);
            ingredients.forEach(ing => stmt.run(pizzaId, ing.id));
            stmt.finalize();

            // 4️⃣ Récupérer la pizza créée avec ses ingrédients
            const pizza = await Pizza.findById(pizzaId);
            return pizza;

        } catch (err) {
            throw err;
        }
    }

    // Récupérer toutes les pizzas avec leurs ingrédients
    static async findAll() {
        const pizzas = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM pizza ORDER BY id DESC`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        // Pour chaque pizza, récupérer ses ingrédients
        const pizzasWithIngredients = await Promise.all(
            pizzas.map(async pizza => {
                const ingredients = await new Promise((resolve, reject) => {
                    db.all(`
                        SELECT i.id, i.name
                        FROM ingredient i
                        JOIN pizza_ingredient pi ON i.id = pi.ingredient_id
                        WHERE pi.pizza_id = ?
                    `, [pizza.id], (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    });
                });
                pizza.ingredients = ingredients;
                return pizza;
            })
        );

        return pizzasWithIngredients;
    }

    // Récupérer une pizza par ID avec ses ingrédients
    static async findById(id) {
        const pizza = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM pizza WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });

        if (!pizza) return null;

        const ingredients = await new Promise((resolve, reject) => {
            db.all(`
                SELECT i.id, i.name
                FROM ingredient i
                JOIN pizza_ingredient pi ON i.id = pi.ingredient_id
                WHERE pi.pizza_id = ?
            `, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        pizza.ingredients = ingredients;
        return pizza;
    }

    // Mettre à jour une pizza
    static update(id, { name, description, imageUrl, price, dailyPizza }) {
        const sql = `
            UPDATE pizza
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                imageUrl = COALESCE(?, imageUrl),
                price = COALESCE(?, price),
                dailyPizza = COALESCE(?, dailyPizza),
                updated_at = datetime('now')
            WHERE id = ?
        `;
        const params = [name, description, imageUrl, price, dailyPizza, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Pizza.findById(id).then(resolve).catch(reject);
            });
        });
    }

    // Supprimer une pizza
    static delete(id) {
        const sql = `DELETE FROM pizza WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Pizza;
