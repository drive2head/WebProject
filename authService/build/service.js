"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.addUser = exports.getUser = exports.verifyUser = void 0;
const mongoose = __importStar(require("mongoose"));
const cfg_1 = require("./cfg");
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
});
function connect() {
    return mongoose.createConnection(cfg_1.users_db_uri, { useNewUrlParser: true, useUnifiedTopology: true });
}
function verifyUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const users_connection = connect();
        try {
            const user = yield getUser(username);
            if (user) {
                if (password === user.password) {
                    return { completed: true, output: `User was succesfully verified` };
                }
                else {
                    return { completed: false, output: `Wrong password was given` };
                }
            }
            return { completed: false, output: `User was not found` };
        }
        catch (err) {
            return { completed: false, output: err };
        }
        finally {
            users_connection.close();
        }
    });
}
exports.verifyUser = verifyUser;
/**
 * Функция возвращает данные о пользователе.
 * @param {string} username логин пользователя.
 * @returns {object} запись из базы.
 */
function getUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const users_connection = connect();
        try {
            const User = users_connection.model('User', userSchema);
            return yield User.findOne({ username: username });
        }
        catch (err) {
            return null;
        }
        finally {
            users_connection.close();
        }
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
    return __awaiter(this, void 0, void 0, function* () {
        const users_connection = connect();
        try {
            const User = users_connection.model('User', userSchema);
            const userExists = yield getUser(username);
            if (userExists) {
                return null;
            }
            let newUser = new User({ username: username, password: password, name: name, surname: surname });
            newUser = yield newUser.save();
            return newUser;
        }
        catch (err) {
            return null;
        }
        finally {
            users_connection.close();
        }
    });
}
exports.addUser = addUser;
/**
 * Функция удаляет пользователя из базы.
 * @param {string} username логин пользователя.
 * @returns {object} успех или неуспех операции.
 */
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const users_connection = connect();
        try {
            const User = users_connection.model('User', userSchema);
            const userExists = yield getUser(username);
            if (!userExists) {
                return { completed: false, output: `User '${username}' doesn't exist` };
            }
            yield User.deleteOne({ username: username });
            return { completed: true, output: `User was succesfully deleted` };
        }
        catch (err) {
            return { completed: false, output: err };
        }
        finally {
            users_connection.close();
        }
    });
}
exports.deleteUser = deleteUser;
exports.addUser = addUser;
exports.getUser = getUser;
exports.verifyUser = verifyUser;
exports.deleteUser = deleteUser;
