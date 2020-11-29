"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordSchema = void 0;
const mongoose_1 = require("mongoose");
exports.recordSchema = new mongoose_1.Schema({
    path: String,
    name: String,
    speakerId: mongoose_1.Types.ObjectId,
});
