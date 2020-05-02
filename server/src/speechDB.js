let cfg = require('./cfg');
let entity = require("./model.js");
let query = require("./query.js");

let Integer = require('neo4j-driver/lib/v1/integer.js');
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver(cfg.graph_db_uri, neo4j.auth.basic(cfg.graph_db_login, cfg.graph_db_password));

// function extractNodes returns array of nodes, returned by the query
// each returned node is extended with fields 'label' and 'id'
/**
    * Функция извлекает узлы из записи из бд.
    * @param {string} record название записи.
    * @returns {array} узлы.
*/
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
/**
    * Функция запускает запрос в бд.
    * @param {pointer} queryFunc функция запроса.
    * @param {bool} multipleRecords флаг на использование нескольких записей в одном запросе.
    * @returns {object} успех или неуспех операции.
*/
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
					if (result.records.length === 0) {
						nodes = null;
					} else {
						nodes = extractNodes(result.records[0]);
					}
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
	return async function() {
		var result = await deleteFunc.apply(this, arguments);

		if (result.output === null) {
			return { completed: false, output: 'Node was NOT deleted'};
		}

		return { completed: true, output: 'Node(s) was succesfully deleted!'};
	}
}

changePhoneme = runQuery(query.changePhoneme);
changePerson = runQuery(query.changePerson);
addPerson = runQuery(query.addPerson);
addRecord = runQuery(query.addRecord);
addMarkup = runQuery(query.addMarkup);
addSentences = runQuery(query.addSentences);
addWords = runQuery(query.addWords);
getMarkup = runQuery(query.getMarkup, true);
getMarkups = runQuery(query.getMarkups, true);
deletePerson = validateDeleteResult(runQuery(query.deletePerson));
deleteRecord = validateDeleteResult(runQuery(query.deleteRecord));
deleteMarkup = validateDeleteResult(runQuery(query.deleteMarkup));
deleteSentences = validateDeleteResult(runQuery(query.deleteSentences))
deleteWords = validateDeleteResult(runQuery(query.deleteWords))
getSentenceMarkup = runQuery(query.getSentenceMarkup, true);
getSentenceMarkups = runQuery(query.getSentenceMarkups, true);
getWordMarkup = runQuery(query.getWordMarkup, true);
getWordMarkups = runQuery(query.getWordMarkups, true);

exports.getSentenceMarkup = getSentenceMarkup;
exports.getSentenceMarkups = getSentenceMarkups;
exports.getWordMarkup = getWordMarkup;
exports.getWordMarkups = getWordMarkups;

exports.changePhoneme = changePhoneme;
exports.changePerson = changePerson;
exports.addPerson = addPerson;
exports.addRecord = addRecord;
exports.addMarkup = addMarkup;
exports.addSentences = addSentences;
exports.addWords = addWords;
exports.getMarkup = getMarkup;
exports.getMarkups = getMarkups;
exports.deletePerson = deletePerson;
exports.deleteRecord = deleteRecord;
exports.deleteMarkup = deleteMarkup;
exports.deleteSentences = deleteSentences;
exports.deleteWords = deleteWords;
