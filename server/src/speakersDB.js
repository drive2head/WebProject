var cfg = require('./cfg');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var speakerSchema = new mongoose.Schema({
	name: String,
	nodeID: String
});

var Speaker = users_connection.model('Speaker', speakerSchema);

async function getAllSpeakers() {
	return await Speaker.aggregate().project({name: 1});
};

async function findSpeakerByName (name) {
	return await Speaker.findOne({ name: name });
};

async function findSpeakerByID (speakerID) {
	return await Speaker.findOne({ _id: speakerID });
};

async function deleteSpeakerByID (speakerID) {
	return await Speaker.deleteOne({ _id: speakerID});
};

async function addSpeaker(name, nodeID) {
	try {
		var speaker = await findSpeakerByName(name);
		if (speaker) {
			return { completed: false, output: `This speaker name is already in use` };
		}
		var newSpeaker = new Speaker({ name: name, nodeID: nodeID });
		newSpeaker = await newSpeaker.save();
		return { completed: true, output: newSpeaker };
	} catch (err) {
		return { completed: false, output: err };
	}
};

exports.findSpeakerByID = findSpeakerByID;
exports.findSpeakerByName = findSpeakerByName;
exports.addSpeaker = addSpeaker;
exports.getAllSpeakers = getAllSpeakers;
exports.deleteSpeakerByID = deleteSpeakerByID;