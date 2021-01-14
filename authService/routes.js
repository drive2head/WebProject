"use strict";
exports.__esModule = true;
var express_1 = require("express");
var controller_1 = require("./controller");
var express_validator_1 = require("express-validator");
var AuthRouter = express_1.Router();
AuthRouter.post('/signin', express_validator_1.body('username').isEmail(), express_validator_1.body('username').isLength({ min: 4 }), express_validator_1.body('password').isLength({ min: 6 }), function (req, res) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    controller_1.AuthController.signIn(req, res);
});
AuthRouter.post('/signup', express_validator_1.body('username').isEmail(), express_validator_1.body('username').isLength({ min: 4 }), express_validator_1.body('password').isLength({ min: 6 }), express_validator_1.body('name').notEmpty(), express_validator_1.body('surname').notEmpty(), function (req, res) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    controller_1.AuthController.signUp(req, res);
});
AuthRouter.post('/profile', express_validator_1.body('username').isEmail(), express_validator_1.body('username').isLength({ min: 4 }), function (req, res) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    controller_1.AuthController.profile(req, res);
});
exports["default"] = AuthRouter;
