let cfg = require('./cfg');

var mongoose = require('mongoose');
var logs_connection = mongoose.createConnection(cfg.logs_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var logSchema = new mongoose.Schema({
	date: Date,			// date of log
	username: String,	// 
	type: String,		// Query/Auth
	logOf: String,		// name of function which returned the result
	completed: Boolean,	// 
	result: Object, 	// for queries it's array of nodes etc.
	logFrom: String,	// name of function, where log was added
});

var Log = logs_connection.model('Log', logSchema);

async function addLog (username, type, logOf, completed, result = null, logFrom = null) {
	const date = new Date();
	let log = new Log(
	{
		date: date, 
		username: username, 
		type: type, 
		logOf: logOf, 
		completed: completed, 
		result: result, 
		logFrom: logFrom, 
	});
	try {
		let res = await log.save((err, user) => {
			if (err) {
				return null;
			}
		});
		return { completed: true, log_id: res._id.toString() };
	} catch (err) {
		return { completed: true, error: err };
	};
};

exports.addLog = addLog;
