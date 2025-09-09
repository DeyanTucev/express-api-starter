// routes/router.js
const express = require('express');
const PizzaRouter = require('./pizzas');

const router = express.Router();

router.use('/pizzas', PizzaRouter);

module.exports = router;
