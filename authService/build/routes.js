"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const AuthRouter = express_1.Router();
AuthRouter.patch('/signin', (req, res) => {
    controller_1.AuthController.signIn(req, res);
});
AuthRouter.post('/signup', (req, res) => {
    controller_1.AuthController.signUp(req, res);
});
AuthRouter.patch('/profile', (req, res) => {
    controller_1.AuthController.profile(req, res);
});
exports.default = AuthRouter;
