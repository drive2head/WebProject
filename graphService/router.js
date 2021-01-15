const express = require('express');

const GraphRouter = express.Router();
const GraphController = require('./controller');

GraphRouter.get('/', (req, res) => {
    GraphController.welcome(req, res)
});

GraphRouter.post('/add_record', (req, res) => {
    GraphController.addRecord(req, res);
});

GraphRouter.post('/add_person', (req, res) => {
    GraphController.addPerson(req, res)
});

module.exports = GraphRouter;
