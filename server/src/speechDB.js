let cfg = require('./cfg');
let entity = require("./model.js");
let query = require("./query.js");

let Integer = require('neo4j-driver/lib/v1/integer.js');
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver(cfg.graph_db_uri, neo4j.auth.basic(cfg.graph_db_login, cfg.graph_db_password));

// function extractNodes returns array of nodes, returned by the query
// each returned node is extended with fields 'label' and 'id'
function extractNodes(record) {
	var recordNodes = [];
	record.forEach((node) => {
		var extendedNode = { ...node };
		extendedNode.id = Integer.toString(node.identity);
		// a node may not have a label if it was deleted (it this case query returns node(s) with only ID)
		if (node.labels) {
			extendedNode.label = node.labels[0]; // at this moment each node has 1 label
		}
		recordNodes.push(extendedNode);
	});
	return recordNodes;
}

function runQuery(queryFunc, multipleRecords=false) {
	return function() {
		var queryText = queryFunc.apply(this, arguments);

		let session = null;
		try {
			session = driver.session();
			return session.run(queryText)
			.then((result) => {
				var nodes = [];
				if (multipleRecords) {
					result.records.forEach((record) => {
						var recordNodes = extractNodes(record);
							recordNodes.forEach((node) => { nodes.push(node); } );
						});
				} else {
					nodes = extractNodes(result.records[0]);
				}
				return { completed: true, output: nodes };
			})
			.catch((err) => {
				return { completed: false, output: { error: err, query: queryText } };
			})
		} catch (err) {
			return { completed: false, output: { error: err, query: queryText } };
		} finally {
			session.close();
		};
	}
}

function validateDeleteResult(deleteFunc) {
	return function() {
		var result = deleteFunc.apply(this, arguments);

		if (result.output === null) {
			return { completed: false, output: 'Node was not deleted'};
		}
	}
}

addRecordPersonPhonemes = runQuery(query.addRecordPersonPhonemes);
changePhoneme = runQuery(query.changePhoneme);
changePerson = runQuery(query.changePerson);
addPerson = runQuery(query.addPerson);
addRecord = runQuery(query.addRecord);
addMarkup = runQuery(query.addMarkup);
getMarkup = runQuery(query.getMarkup, true);
getMarkups = runQuery(query.getMarkups, true);
deletePerson = validateDeleteResult(runQuery(query.deletePerson));
deleteRecord = validateDeleteResult(runQuery(query.deleteRecord));
deleteMarkup = validateDeleteResult(runQuery(query.deleteMarkup));

// exports.addRecordPersonPhonemes = addRecordPersonPhonemes;
exports.changePhoneme = changePhoneme;
exports.changePerson = changePerson;
exports.addPerson = addPerson;
exports.addRecord = addRecord;
exports.addMarkup = addMarkup;
exports.getMarkup = getMarkup;
exports.getMarkups = getMarkups;
exports.deletePerson = deletePerson;
exports.deleteRecord = deleteRecord;
exports.deleteMarkup = deleteMarkup;

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

// 	let session = driver.session();
// 	return session.run(queryText)
// 	.then((result) => {
// 		console.log("result: ", result);
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

// test_addRecordPersonPhonemes()
// .then((result) => {
// 	console.log("test_addRecordPersonPhonemes():\n", result);
// })

// const pers = entity.Person('Name', '18', 'M', 'RU', 'MSK', 'RF');
// const ph0 = entity.Phoneme('A', '0:00:00', '0:05:00', 'RU');
// const ph1 = entity.Phoneme('B', '0:06:00', '0:10:00', 'RU');
// const rec = entity.Record('rec.wav', 'empty');
// addRecordPersonPhonemes(rec, pers, [ph0, ph1])
// .then((result) => {
	// console.log("result: ", result);
// });
