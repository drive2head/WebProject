var cfg = require('./cfg');

var mongoose = require('mongoose');

var speakerSchema = new mongoose.Schema({
	name: String,
	nodeID: String
});

/**
    * Функция возвращает всех дикторов.
    * @returns {object} записи из базы.
*/
async function getAllSpeakers() {
	try {
		var connection = await mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = connection.model('Speaker', speakerSchema);
		
		return await Speaker.aggregate().project({name: 1});
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
    * Функция возвращает диктора по имени.
    * @param {string} name имя диктора.
    * @returns {object} запись из базы.
*/
async function findSpeakerByName (name) {
	try {
		var connection = await mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = connection.model('Speaker', speakerSchema);
		
		return await Speaker.findOne({ name: name });
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
    * Функция возвращает диктора по id.
    * @param {int} speakerID id диктора.
    * @returns {object} запись из базы.
*/
async function findSpeakerByID (speakerID) {
	try {
		var connection = await mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = connection.model('Speaker', speakerSchema);
		
		return await Speaker.findOne({ _id: speakerID });
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
    * Функция удаляет диктора по id.
    * @param {int} speakerID id диктора.
    * @returns {object} запись из базы.
*/
async function deleteSpeakerByID (speakerID) {
	try {
		var connection = await mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = connection.model('Speaker', speakerSchema);
		
		return await Speaker.deleteOne({ _id: speakerID});
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
    * Функция добавляет диктора.
    * @param {name} имя диктора.
    * @param {int} nodeID id узла.
    * @returns {object} успех или неуспех операции.
*/
async function addSpeaker(name, nodeID) {
	try {
		var connection = await mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = connection.model('Speaker', speakerSchema);

		var speaker = await findSpeakerByName(name);
		if (speaker) {
			err = Error(`This speaker name is already in use`);
			err.service = 'Mongo';
			return { completed: false, output: err, msg: `This speaker name is already in use` };
		}
		var newSpeaker = new Speaker({ name: name, nodeID: nodeID });
		newSpeaker = await newSpeaker.save();
		return { completed: true, output: newSpeaker };
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

exports.findSpeakerByID = findSpeakerByID;
exports.findSpeakerByName = findSpeakerByName;
exports.addSpeaker = addSpeaker;
exports.getAllSpeakers = getAllSpeakers;
exports.deleteSpeakerByID = deleteSpeakerByID;