let cfg = require('./cfg');
var mongoose = require('mongoose');
mongoose.connect(cfg.logs_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var logSchema = new mongoose.Schema({
	date: Date,
	username: String,
	type: String,
	action: String,
	completed: Boolean,
	output: String,
	loggingFunction: String,
	loggedFunction: String,
});

var Log = mongoose.model('Log', logSchema);

async function addLog (username, type, action, completed,
						output = null, loggingFunction = null, loggedFunction = null) {
	let log = new Log({ date: Date().slice(0, 31), username: username, 
		type: type, action: action, completed: completed, output: output});
	try {
		let res = await log.save();
		return { 'success': true, log_id: res._id.toString() };
	} catch (err) {
		console.log("err: ", err);
		return err;
	}
};

exports.addLog = addLog;
