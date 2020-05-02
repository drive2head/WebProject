var cfg = require('./cfg');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var recordSchema = new mongoose.Schema({
	name: String,
	path: String,
	speakerID: mongoose.ObjectId
});

var Record = users_connection.model('Record', recordSchema);

/**
    * Функция возвращает все записи.
    * @returns {object} записи из базы.
*/
async function getAllRecords() {
	return await Record.find();
};

/**
    * Функция возвращает записи по названию.
    * @param {string} name название записи.
    * @returns {object} запись из базы.
*/
async function findRecordByName (name) {
	return await Record.findOne({ name: name });
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
		var record = await findRecordByName(name);
		if (record) {
			return { completed: false, output: `This record name is already in use` };
		}
		var newRecord = new Record({ name: name, path: path, speakerID: speakerID });
		newRecord = await newRecord.save();
		return { completed: true, output: newRecord };
	} catch (err) {
		return { completed: false, output: err };
	}
};

exports.findRecordByName = findRecordByName;
exports.addRecord = addRecord;
exports.getAllRecords = getAllRecords;