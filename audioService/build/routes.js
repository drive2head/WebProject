"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
// import {SignObject} from "./types";
const AudioRouter = express_1.Router();
AudioRouter.get('/records', (req, res) => {
    controller_1.AudioController.getAllRecords(req, res);
});
AudioRouter.post('/records', (req, res) => {
    controller_1.AudioController.addRecord(req, res);
});
exports.default = AudioRouter;
