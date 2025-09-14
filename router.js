// routes/router.js
const express = require('express');
const PizzaRouter = require('./ressourcePzza/routes/pizzas');
const IngredientRouter = require('./ressourceIngredients/routes/ingredients');

const router = express.Router();

router.use('/pizzas', PizzaRouter);
router.use('/ingredients', IngredientRouter);

module.exports = router;
