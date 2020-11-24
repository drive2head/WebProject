"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const service_1 = require("./service");
exports.AuthController = {
    signIn(req, res) {
        const username = req.body.username, password = req.body.password;
        service_1.verifyUser(username, password)
            .then((result) => {
            res.send({ status: result.completed, msg: result.output });
        });
    },
    signUp(req, res) {
        const username = req.body.username, password = req.body.password, name = req.body.name, surname = req.body.surname;
        service_1.addUser(username, password, name, surname)
            .then((result) => {
            res.send(result);
        });
    },
    profile(req, res) {
        const username = req.body.username;
        service_1.getUser(username)
            .then((result) => {
            res.send(result);
        });
    }
};
