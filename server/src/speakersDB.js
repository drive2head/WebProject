var cfg = require('./cfg');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.speakers_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var speakerSchema = new mongoose.Schema({
	name: String,
	person: {
		fullName: String,
		age: age,
		sex: String,
		nativeLanguage: String,
		city: String,
		country: String,
		disorders: [String]
	}
});

var Speaker = users_connection.model('Speaker', speakerSchema);

async function getAllSpeakers() {
	return await Speaker.find();
};

async function findRecordByName (name) {
	return await Speaker.findOne({ name: name });
};

async function getSpeaker (speakerID) {
	return await Speaker.findOne({ _id: recordID });
};

async function addSpeaker(name, person) {
	try {
		var speaker = await findRecordByName(name);
		if (speaker) {
			return { completed: false, output: `This speaker name is already in use` };
		}
		var newSpeaker = new Speaker({ name: name, person: person });
		newSpeaker = await newSpeaker.save();
		return { completed: true, output: newSpeaker };
	} catch (err) {
		return { completed: false, output: err };
	}
};

exports.getSpeaker = getSpeaker;
exports.addSpeaker = addSpeaker;
exports.getAllSpeakers = getAllSpeakers;