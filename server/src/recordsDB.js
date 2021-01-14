var cfg = require('./cfg');

var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
	name: String,
	path: String,
	speakerID: mongoose.ObjectId
});

/**
    * Функция возвращает все записи.
    * @returns {object} записи из базы.
*/
async function getAllRecords() {
	try {
		var connection = await mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Record = connection.model('Record', recordSchema);

		return await Record.find();
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		err.service = 'Mongo';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
};

/**
    * Функция возвращает запись по названию.
    * @param {string} name название записи.
    * @returns {object} запись из базы.
*/
async function findRecordByName (name) {
	try {
		var connection = await mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Record = connection.model('Record', recordSchema);
		
		return await Record.findOne({ name: name });
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		err.service = 'Mongo';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
};
/**
    * Функция добавляет запись в базу.
    * @param {string} name название записи.
    * @param {string} path путь к аудиозаписи.
    * @param {int} speakerID id диктора.
    * @returns {object} успех или неуспех операции.
*/
async function addRecord(name, path, speakerID) {
	try {
		var connection = await mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Record = connection.model('Record', recordSchema);

		var record = await findRecordByName(name);
		if (record) {
			err = Error(`This record name is already in use`);
			err.service = 'Mongo';
			return { completed: false, output: err, msg: `This record name is already in use` };
		}
		var newRecord = new Record({ name: name, path: path, speakerID: speakerID });
		newRecord = await newRecord.save();
		return { completed: true, output: newRecord };
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		err.service = 'Mongo';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
};

exports.findRecordByName = findRecordByName;
exports.addRecord = addRecord;
exports.getAllRecords = getAllRecords;