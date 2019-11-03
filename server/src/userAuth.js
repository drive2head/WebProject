var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
  name: String,
  pass: String
});

var User = mongoose.model('User', userSchema);

function addUser (username, password) {
	let user = new User({ name: username, pass: password });
	return user.save((err, user) => {
		if (err) return console.error(err);
		console.log('User was added');
	});
};

async function checkUser (username) {
	return await User.findOne({ name: username });
}

exports.addUser = addUser;
exports.checkUser = checkUser;
