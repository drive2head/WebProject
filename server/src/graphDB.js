let entity = require("./entity.js");

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'neo4j'));
let session = driver.session();

exports.addPhonemesRecordPerson = (record, person, phonemes) => {
	let queryText = query.addData(recname, req.body.person, req.body.sounds);

	return session.run(queryText)
	.then((result) => {
		/* add log */
		return true;
	})
	.catch((err) => {
		/* add log */
		return false;
	});
};

exports.changePhoneme = (phoneme, id) => {
	let queryText = query.changePhoneme(phoneme, id);

	return session.run(queryText)
	.then((result) => {
		/* add log */
		return true;
	})
	.catch((err) => {
		/* add log */
		return false;
	});
};

exports.changePerson = (person, id) => {
	let queryText = query.changePerson(person, id);

	return session.run(queryText)
	.then((result) => {
		/* add log */
		return true;
	})
	.catch((err) => {
		/* add log */
		return false;
	});
};