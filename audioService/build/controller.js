"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const service_1 = require("./service");
exports.AudioController = {
    getAllRecords(req, res) {
        service_1.getAllRecords()
            .then(payload => res.send(payload));
    },
    addRecord(req, res) {
        const name = req.body.name, path = req.body.path, speakerId = req.body.speakerId;
        service_1.addRecord(name, path, speakerId)
            .then(payload => res.send(payload));
    }
};
