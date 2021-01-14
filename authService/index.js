"use strict";
exports.__esModule = true;
var express = require("express");
var routes_1 = require("./routes");
// console.log(morgan)
var app = express();
// app.use(morgan());
app.use(express.urlencoded());
app.use(express.json());
app.use(routes_1["default"]);
var port = process.env.PORT || 1488;
var server = app.listen(port, function () { return console.log("Listening on: " + port); });
module.exports = server;
