var cfg = require('./cfg');
var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.users_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
});

var User = users_connection.model('User', userSchema);

async function verifyUser(username, password) {
	var user = await getUser(username);
	console.log(`username: ${username}, password: ${password}`);
	console.log(`user: ${user}`)
	if (user) {
		if (password === user.password) {
			return { completed: true, output: `User was succesfully verified` };
		} else {
			return { completed: false, output: `Wrong password was given` };
		}
	}
	return { completed: false, output: `User was not found`}
}

async function getUser (username) {
	return await User.findOne({ username: username });
}

async function addUser (username, password, name, surname) {
	try {
		var userExists = await getUser(username);
		if (userExists) {
			return { completed: false, output: `The username '${username}' is already in use` };
		}
		var newUser = new User({ username: username, password: password, name: name, surname: surname });
		newUser = await newUser.save();
		return { completed: true, output: newUser };
	} catch (err) {
		return { completed: false, output: err };
	}
}

exports.addUser = addUser;
exports.getUser = getUser;
exports.verifyUser = verifyUser;
