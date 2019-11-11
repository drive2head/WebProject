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

async function getUser (username) {
	return await User.findOne({ username: username });
}

async function addUser (username) {
	try {
		var userExits = await getUser(username);
		if (userExits == null) {
			var newUser = new User({ username: username, password: null, name: null, surname: null });
			let saveUser = await newUser.save();
			return { completed: true, output: saveUser };
		} else {
			return { completed: false, output: `The username '${username}' is already in use` };
		}
	} catch (err) {
		return { completed: false, output: err };
	}
}

exports.addUser = addUser;
exports.getUser = getUser;
