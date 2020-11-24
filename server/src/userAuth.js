var mongoose = require('mongoose');
if (process.env.STAGE == 'test') {
	var DB_URI = process.env.MONGO_URI;
} else {
	var cfg = require('./cfg');
	var DB_URI = cfg.users_db_uri;;
}


var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
});

async function verifyUser(username, password) {
	try {
		var users_connection = mongoose.createConnection(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
		var User = users_connection.model('User', userSchema);

		var user = await getUser(username);
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
async function getUser (username) {
	try {
		var users_connection = mongoose.createConnection(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
		var User = users_connection.model('User', userSchema);

		return await User.findOne({ username: username });
	} catch (err) {
		return { completed: false, output: err };
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
async function addUser (username, password, name, surname) {
	try {
		var users_connection = mongoose.createConnection(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
		console.log(mongoose.connection.readyState);
		var User = users_connection.model('User', userSchema);

		var userExists = await getUser(username);
		if (userExists) {
			return { completed: false, output: `The username '${username}' is already in use` };
		}
		var newUser = new User({ username: username, password: password, name: name, surname: surname });
		newUser = await newUser.save();
		return { completed: true, output: newUser };
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		users_connection.close();
	}
}
/**
    * Функция удаляет пользователя из базы.
    * @param {string} username логин пользователя.
    * @returns {object} успех или неуспех операции.
*/
async function deleteUser (username) {
	try {
		var users_connection = mongoose.createConnection(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
		var User = users_connection.model('User', userSchema);

		var userExists = await getUser(username);
		if (!userExists) {
			return { completed: false, output: `User '${username}' doesn't exist`};
		}

		await User.deleteOne({ username: username });
		return { completed: true, out: `User was succesfully deleted` };
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