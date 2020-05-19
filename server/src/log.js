let cfg = require('./cfg');

var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
	date: Date,			// date of log
	datestring: String, 
	username: String,	// 
	type: String,		// Query/Auth
	logOf: String,		// name of function which returned the result
	completed: Boolean,	// 
	result: Object, 	// for queries it's array of nodes etc.
	logFrom: String,	// name of function, where log was added
});

/**
    * Функция добавляет логи в журнал.
    * @param {string} username имя пользователя.
    * @param {string} type тип действия.
    * @param {object} logOf функция, вызвавшая логирование.
    * @param {bool} completed статус добавления лога.
    * @param {object} result null.
    * @param {string} logFrom null.
    * @returns {object} объект результата добавления лога.
*/
async function addLog (username, type, logOf, completed, result = null, logFrom = null) {
	const date = new Date();
	let now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	try {
		var logs_connection = mongoose.createConnection(cfg.logs_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Log = logs_connection.model('Log', logSchema);
		
		let log = new Log(
		{
			date: date, 
			datestring: now, 
			username: username, 
			type: type, 
			logOf: logOf, 
			completed: completed, 
			result: result, 
			logFrom: logFrom, 
		});

		let res = await log.save();
		return { completed: true, log_id: res._id.toString() };
	} catch (err) {
		return { completed: true, error: err };
	} finally {
		logs_connection.close();
	}
};


exports.addLog = addLog;