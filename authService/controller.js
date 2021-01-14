"use strict";
exports.__esModule = true;
exports.AuthController = void 0;
var service_1 = require("./service");
exports.AuthController = {
    signIn: function (req, res) {
        var username = req.body.username, password = req.body.password;
        service_1.verifyUser(username, password)
            .then(function (result) {
            res.status(result.completed ? 200 : 401).send({ status: result.completed, msg: result.output });
        })["catch"](function (err) { return res.status(500).json(err); });
    },
    signUp: function (req, res) {
        var username = req.body.username, password = req.body.password, name = req.body.name, surname = req.body.surname;
        service_1.addUser(username, password, name, surname)
            .then(function (result) {
            if (result) {
                res.send({ status: true, msg: "User was succesfully created" });
            }
            else {
                res.status(409).send({ status: false, msg: "User was not created" });
            }
        })["catch"](function (err) { return res.status(500).json(err); });
    },
    profile: function (req, res) {
        var username = req.body.username;
        service_1.getUser(username)
            .then(function (result) {
            res.send(result);
        })["catch"](function (err) { return res.status(500).json(err); });
    }
};
