let cfg = require('./cfg');
let entity = require("./entity.js");
let query = require("./query.js");

let Integer = require('neo4j-driver/lib/v1/integer.js');
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver(cfg.graph_db_uri, neo4j.auth.basic(cfg.graph_db_login, cfg.graph_db_password));

function addRecordPersonPhonemes (record, person, phonemes) {
	let queryText = query.addData(record.name, person, phonemes);
	let session = null;
	try {
		session = driver.session();
		return session.run(queryText)
		.then((result) => {
			var createdNodes = [];
			const singleRecord = result.records[0];
			singleRecord.forEach((node) => {
				createdNodes.push({ id: Integer.toString(node.identity), label: node.labels[0] });
			});
			return { completed: true, output: createdNodes };
		})
		.catch((err) => {
			return { completed: false, output: { error: err, query: queryText } };
		});
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		session.close();
	};
};

function changePhoneme (phoneme, id) {
	let queryText = query.changePhoneme(phoneme, id);
	let session = null;
	try {
		session = driver.session();
		return session.run(queryText)
		.then((result) => {
			var changedNodes = [];
			if (result.records.length > 0) {
				const singleRecord = result.records[0];
				const node = singleRecord.get(0);
				changedNodes.push({ id: Integer.toString(node.identity), label: node.labels[0] });
			};
			return { completed: true, output: changedNodes };
		})
		.catch((err) => {
			console.log(err);
			return { completed: false, output: err };
		});
	} finally {
		session.close();
	}
};

function changePerson (person, id) {
	let queryText = query.changePerson(person, id);
	let session = null;
	try {
		session = driver.session();
		return session.run(queryText)
		.then((result) => {
			var changedNodes = [];
			if (result.records.length > 0) {
				const singleRecord = result.records[0];
				const node = singleRecord.get(0);
				changedNodes.push({ id: Integer.toString(node.identity), label: node.labels[0] });
			};
			return { completed: true, output: changedNodes };
		})
		.catch((err) => {
			return { completed: false, output: err };
		});
	} finally {
		session.close();
	}
};

exports.addRecordPersonPhonemes = addRecordPersonPhonemes;
exports.changePhoneme = changePhoneme;
exports.changePerson = changePerson;

// function test_addRecordPersonPhonemes() {
// 	let queryText = `\
// 	merge (rec:Record {description:'REC'})
// 	create (person: Person {fullname:'PERS',
// 			nativeLanguage:'NLANG', accent:'ACCENT'})
// 	merge (country: Country {name:'CNTRY'})
// 	merge (city: City {name:'CITY'})
// 	create (rec)-[:SPOKEN_BY]->(person)
// 	create (person)-[:LIVES_IN]->(city)
// 	merge (city)-[:LOCATED_IN]->(country)

// 	merge (dis0: Disorder {name:'DIS0'})
// 	create (person)-[:HAS]->(dis0)
// 	merge (dis1: Disorder {name:'DIS1'})
// 	create (person)-[:HAS]->(dis1)
		
// 	create (ph0: Phoneme {notation:'P0', start:'0',
// 					end:'0', language:'LANG', dialect:'DIALECT'})
// 	create (ph0)-[:CONTAINED_IN]->(rec)
// 	create (ph1: Phoneme {notation:'P1', start:'0',
// 					end:'0', language:'LANG', dialect:'DIALECT'})
// 	create (ph1)-[:CONTAINED_IN]->(rec)

// 	return person, ph0, ph1
// 	`;

// 	return session.run(queryText)
// 	.then((result) => {
// 		var createdNodes = [];
// 		const singleRecord = result.records[0];
// 		singleRecord.forEach((node) => {
// 			createdNodes.push({ id: Integer.toString(node.identity), label: node.labels[0] });
// 		});
// 		return { completed: true, output: createdNodes };
// 	})
// 	.catch((err) => {
// 		return { completed: false, output: err };
// 	});
// };

// test_addRecordPersonPhonemes();

// const pers = entity.Person('X', 'X', 'X', 'X', 'X', 'X');
// const ph = entity.Phoneme('A', 'A', 'A', 'A');
// const rec = entity.Record('rec.wav', 'empty');
// addRecordPersonPhonemes(rec, pers, [ph]);







