var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
});

var User = mongoose.model('User', userSchema);

function addUser (username, password, name, surname) {
	let user = new User({ username: username, password: password, name: name, surname: surname });
	return user.save((err, user) => {
		if (err) return console.error(err);
		console.log('User was added');
	});
};

async function checkUser (username) {
	return await User.findOne({ username: username });
}

exports.addUser = addUser;
exports.checkUser = checkUser;
