"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose = require("mongoose");
const { Schema } = mongoose;
exports.userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
});
exports.User = mongoose.model("users", exports.userSchema);
