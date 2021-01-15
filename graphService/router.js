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
	console.log("GraphRouter::/add_person\nreq:", req);
	// console.log("GraphRouter::/add_person\nreq.body:", req.body);
    GraphController.addPerson(req, res)
});

module.exports = GraphRouter;
