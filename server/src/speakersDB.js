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
		var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = users_connection.model('Speaker', speakerSchema);
		
		return await Speaker.aggregate().project({name: 1});
	} finally {
		users_connection.close();
	}
};
/**
    * Функция возвращает диктора по имени.
    * @param {string} name имя диктора.
    * @returns {object} запись из базы.
*/
async function findSpeakerByName (name) {
	try {
		var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = users_connection.model('Speaker', speakerSchema);
		
		return await Speaker.findOne({ name: name });
	} finally {
		users_connection.close();
	}
};

/**
    * Функция возвращает диктора по id.
    * @param {int} speakerID id диктора.
    * @returns {object} запись из базы.
*/
async function findSpeakerByID (speakerID) {
	try {
		var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = users_connection.model('Speaker', speakerSchema);
		
		return await Speaker.findOne({ _id: speakerID });
	} finally {
		users_connection.close();
	}
};

/**
    * Функция удаляет диктора по id.
    * @param {int} speakerID id диктора.
    * @returns {object} запись из базы.
*/
async function deleteSpeakerByID (speakerID) {
	try {
		var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = users_connection.model('Speaker', speakerSchema);
		
		return await Speaker.deleteOne({ _id: speakerID});
	} finally {
		users_connection.close();
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
		var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var Speaker = users_connection.model('Speaker', speakerSchema);

		var speaker = await findSpeakerByName(name);
		if (speaker) {
			return { completed: false, output: `This speaker name is already in use` };
		}
		var newSpeaker = new Speaker({ name: name, nodeID: nodeID });
		newSpeaker = await newSpeaker.save();
		return { completed: true, output: newSpeaker };
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		users_connection.close();
	}
};

exports.findSpeakerByID = findSpeakerByID;
exports.findSpeakerByName = findSpeakerByName;
exports.addSpeaker = addSpeaker;
exports.getAllSpeakers = getAllSpeakers;
exports.deleteSpeakerByID = deleteSpeakerByID;