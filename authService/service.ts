import {ResultLog, User} from './types';
import {users_db_uri} from './cfg'
import {createConnection, Schema} from "mongoose";
import {userSchema} from './model'

function connect() {
    return createConnection(users_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
}

export async function verifyUser(username: string, password: string): Promise<ResultLog> {
    const users_connection = connect();
    try {
        const user = await getUser(username);
        if (user) {
            if (password === user.password) {
                return { completed: true, output: `User was succesfully verified` };
            } else {
                return { completed: false, output: `Wrong password was given` };
            }
        }
        return { completed: false, output: `User was not found`};
    } catch (err) {
        return { completed: false, output: err };
    } finally {
        users_connection.close();
    }
}
/**
 * Функция возвращает данные о пользователе.
 * @param {string} username логин пользователя.
 * @returns {object} запись из базы.
 */
export async function getUser(username: string): Promise<User | null> {
    const users_connection = connect();
    try {
        const User = users_connection.model<User>('User', userSchema);
        return await User.findOne({ username: username });
    } catch (err) {
        return null;
    } finally {
        users_connection.close();
    }
}
/**
 * Функция добавляет пользователя в базу.
 * @param {string} username логин пользователя.
 * @param {string} password пароль пользователя.
 * @param {string} name имя пользователя.
 * @param {string} surname фамилия пользователя.
 * @returns {object} успех или неуспех операции.
 */
export async function addUser (username: string, password: string, name: string, surname: string): Promise<User | null> {
    const users_connection = connect();
    try {
        const User = users_connection.model<User>('User', userSchema);

        const userExists = await getUser(username);
        if (userExists) {
            return null
        }
        let newUser = new User({ username: username, password: password, name: name, surname: surname });
        newUser = await newUser.save();
        return newUser;
    } catch (err) {
        return null;
    } finally {
        users_connection.close();
    }
}
/**
 * Функция удаляет пользователя из базы.
 * @param {string} username логин пользователя.
 * @returns {object} успех или неуспех операции.
 */
export async function deleteUser(username: string): Promise<ResultLog> {
    const users_connection = connect();
    try {
        const User = users_connection.model('User', userSchema);

        const userExists = await getUser(username);
        if (!userExists) {
            return { completed: false, output: `User '${username}' doesn't exist`};
        }

        await User.deleteOne({ username: username });
        return { completed: true, output: `User was succesfully deleted` };
    } catch (err) {
        return { completed: false, output: err };
    } finally {
        users_connection.close();
    }
}

exports.addUser = addUser;
exports.getUser = getUser;
exports.verifyUser = verifyUser;
exports.deleteUser = deleteUser;
