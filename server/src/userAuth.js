var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected!');
});

var userSchema = new mongoose.Schema({
  name: String,
  pass: String
});

var User = mongoose.model('User', userSchema);

// User.findOne({ name: 'test' }, function (err, users) {
//   if (err) return console.error(err);
//   console.log(users);
// })

function addUser (username, password) {
	let user = new User({ name: username, pass: password });
	return user.save((err, user) => {
		if (err) return console.error(err);
		console.log('User was added');
	});
};

function checkUser (username) {
	return User.findOne({ name: username}, (err, user) => {
		if (err) return null;
		return user;
	});
}


// exports.addUser = addUser;

// addUser('Alex', '8800');
// let res = checkUser('Alex');
// console.log(res);

// User.findOne({ name: 'Alex' }, function (err, users) {
  // if (err) return console.error(err);
  // console.log(users);
// })

