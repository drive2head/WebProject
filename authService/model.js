"use strict";
exports.__esModule = true;
exports.userSchema = void 0;
var mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    name: String,
    surname: String
});
