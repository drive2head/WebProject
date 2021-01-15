const express = require('express');

const GraphRouter = express.Router();
const GraphController = require('./controller');

GraphRouter.get('/', (req, res) => {
    GraphController.welcome(req, res)
});

module.exports = GraphRouter;
