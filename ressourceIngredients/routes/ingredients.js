// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientController = require('../controllers/ingredientController');

const router = express.Router();

/**
 * @openapi
 * /api/ingredient:
 *   get:
 *     summary: Retrieve a list of ingredient
 *     responses:
 *       200:
 *         description: A list of ingredient
 *   post:
 *     summary: Create a new ingredient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: ingredient created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get a ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single ingredient
 *       404:
 *         description: ingredient not found
 *   put:
 *     summary: Update a ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *       200:
 *         description: ingredient updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: ingredient not found
 *   delete:
 *     summary: Delete a ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ingredient deleted
 *       404:
 *         description: ingredient not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
];

router.get('/', ingredientController.findAll);
router.post('/', createAndUpdateValidations, ingredientController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.delete);

module.exports = router;
