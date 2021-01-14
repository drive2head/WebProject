"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.deleteUser = exports.addUser = exports.getUser = exports.verifyUser = void 0;
var cfg_1 = require("./cfg");
var mongoose_1 = require("mongoose");
var model_1 = require("./model");
function connect() {
    return mongoose_1.createConnection(cfg_1.users_db_uri, { useNewUrlParser: true, useUnifiedTopology: true });
}
function verifyUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var users_connection, user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users_connection = connect();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, getUser(username)];
                case 2:
                    user = _a.sent();
                    if (user) {
                        if (password === user.password) {
                            return [2 /*return*/, { completed: true, output: "User was succesfully verified" }];
                        }
                        else {
                            return [2 /*return*/, { completed: false, output: "Wrong password was given" }];
                        }
                    }
                    return [2 /*return*/, { completed: false, output: "User was not found" }];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, { completed: false, output: err_1 }];
                case 4:
                    users_connection.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.verifyUser = verifyUser;
/**
 * Функция возвращает данные о пользователе.
 * @param {string} username логин пользователя.
 * @returns {object} запись из базы.
 */
function getUser(username) {
    return __awaiter(this, void 0, void 0, function () {
        var users_connection, User, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users_connection = connect();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    User = users_connection.model('User', model_1.userSchema);
                    return [4 /*yield*/, User.findOne({ username: username })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, null];
                case 4:
                    users_connection.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
/**
 * Функция добавляет пользователя в базу.
 * @param {string} username логин пользователя.
 * @param {string} password пароль пользователя.
 * @param {string} name имя пользователя.
 * @param {string} surname фамилия пользователя.
 * @returns {object} успех или неуспех операции.
 */
function addUser(username, password, name, surname) {
    return __awaiter(this, void 0, void 0, function () {
        var users_connection, User, userExists, newUser, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users_connection = connect();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    User = users_connection.model('User', model_1.userSchema);
                    return [4 /*yield*/, getUser(username)];
                case 2:
                    userExists = _a.sent();
                    if (userExists) {
                        return [2 /*return*/, null];
                    }
                    newUser = new User({ username: username, password: password, name: name, surname: surname });
                    return [4 /*yield*/, newUser.save()];
                case 3:
                    newUser = _a.sent();
                    return [2 /*return*/, newUser];
                case 4:
                    err_3 = _a.sent();
                    return [2 /*return*/, null];
                case 5:
                    users_connection.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.addUser = addUser;
/**
 * Функция удаляет пользователя из базы.
 * @param {string} username логин пользователя.
 * @returns {object} успех или неуспех операции.
 */
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function () {
        var users_connection, User, userExists, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users_connection = connect();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    User = users_connection.model('User', model_1.userSchema);
                    return [4 /*yield*/, getUser(username)];
                case 2:
                    userExists = _a.sent();
                    if (!userExists) {
                        return [2 /*return*/, { completed: false, output: "User '" + username + "' doesn't exist" }];
                    }
                    return [4 /*yield*/, User.deleteOne({ username: username })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { completed: true, output: "User was succesfully deleted" }];
                case 4:
                    err_4 = _a.sent();
                    return [2 /*return*/, { completed: false, output: err_4 }];
                case 5:
                    users_connection.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.deleteUser = deleteUser;
exports.addUser = addUser;
exports.getUser = getUser;
exports.verifyUser = verifyUser;
exports.deleteUser = deleteUser;
