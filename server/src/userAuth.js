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

function addUser (username, password, name, surname) {
	let user = new User({ username: username, password: password, name: name, surname: surname });
	return user.save((err, user) => {
		if (err) {
			console.log("error:\n", err);
			return console.error(err);
		}
		console.log('User was added: ', user);
	});
};

async function getUser (username) {
	return await User.findOne({ username: username });
}

exports.addUser = addUser;
exports.getUser = getUser;
