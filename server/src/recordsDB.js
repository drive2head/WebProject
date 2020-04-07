var cfg = require('./cfg');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var recordSchema = new mongoose.Schema({
	name: String,
	path: String,
	speakerID: mongoose.ObjectId
});

var Record = users_connection.model('Record', recordSchema);

async function getAllRecords() {
	return await Record.find();
};

async function findRecordByName (name) {
	return await Record.findOne({ name: name });
};

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