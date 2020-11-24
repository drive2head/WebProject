"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
app.use(morgan_1.default('combined'));
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
const port = process.env.PORT || 1488;
app.listen(port, () => console.log(`Port: ${port}`));
app.use(routes_1.default);
