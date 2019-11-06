let log = require("./log.js");
let entity = require("./entity.js");

let query = require("./query.js");

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('editor', 'editor'));
let session = driver.session();

function addRecordPersonPhonemes (record, person, phonemes) {
	let queryText = query.addData(record.name, person, phonemes);

	return session.run(queryText)
	.then((result) => {
		const res = JSON.stringify(result.summary.counters._stats);
		return { type: 'query.create', text: queryText, completed: true, result: result};
	})
	.catch((err) => {
		const result = JSON.stringify(err);
		return { type: 'query.change', text: queryText, completed: false, result: res};
	});
};

function changePhoneme (phoneme, id) {
	let queryText = query.changePhoneme(phoneme, id);

	return session.run(queryText)
	.then((result) => {
		const res = JSON.stringify(result.summary.counters._stats);
		return { type: 'query.change', text: queryText, completed: true, result: result};
	})
	.catch((err) => {
		const res = JSON.stringify(err);
		return { type: 'query.change', text: queryText, completed: false, result: res};
	});
};

function changePerson (person, id) {
	let queryText = query.changePerson(person, id);

	return session.run(queryText)
	.then((result) => {
		const res = JSON.stringify(result.summary.counters._stats);
		return { type: 'query.change', text: queryText, completed: true, result: result};
	})
	.catch((err) => {
		const res = JSON.stringify(err);
		return { type: 'query.change', text: queryText, completed: false, result: res};
	});
};

exports.addRecordPersonPhonemes = addRecordPersonPhonemes
exports.changePhoneme = changePhoneme
exports.changePerson = changePerson

// const pers = entity.Person('X', 'X', 'X', 'X', 'X', 'X');
// const ph = entity.Phoneme('A', 'A', 'A', 'A');
// const rec = entity.Record('rec.wav', 'empty');
// addRecordPersonPhonemes(rec, pers, [ph]);