var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cfg = require('../server/src/cfg');
let entity = require("../server/src/model.js");
let query = require("../server/src/query.js");
let Integer = require('neo4j-driver/lib/v1/integer.js');
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver(cfg.graph_db_uri, neo4j.auth.basic(cfg.graph_db_login, cfg.graph_db_password), { encrypted: 'ENCRYPTION_OFF' });
let graphTypes = require('neo4j-driver/lib/v1/graph-types.js');
process.on('exit', () => __awaiter(this, void 0, void 0, function* () {
    yield driver.close();
}));
function isNode(object) {
    return object instanceof graphTypes.Node;
}
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
        var extendedNode = Object.assign({}, node);
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
function runQuery(queryFunc, multipleRecords = false, smth = '') {
    return function (...arguments) {
        return __awaiter(this, void 0, void 0, function* () {
            var queryText = queryFunc.apply(this, arguments);
            let session = null;
            try {
                session = driver.session();
                const result = yield session.run(queryText);
                var nodes = [];
                if (multipleRecords) {
                    result.records.forEach((record) => {
                        if (isNode(record.get(0))) {
                            const recordNodes = extractNodes(record);
                            recordNodes.forEach((node) => { nodes.push(node); });
                        }
                        else {
                            nodes.push(record.toObject());
                        }
                    });
                }
                else {
                    if (result.records.length === 0) {
                        nodes = null;
                    }
                    else {
                        const record = result.records[0];
                        if (isNode(record.get(0))) {
                            nodes = extractNodes(record);
                        }
                        else {
                            nodes = record.toObject();
                        }
                    }
                }
                return { completed: true, output: nodes };
                // session = driver.session();
                // const result = await session.run(queryText)
                // .then((result) => {
                // 	var nodes = [];
                // 	if (multipleRecords) {
                // 		result.records.forEach((record) => {
                // 			if (isNode(record.get(0))) {
                // 				recordNodes = extractNodes(record);
                // 				recordNodes.forEach((node) => { nodes.push(node); } );
                // 			} else {
                // 				nodes.push(record.toObject());
                // 			}
                // 		});
                // 	} else {
                // 		if (result.records.length === 0) {
                // 			nodes = null;
                // 		} else {
                // 			record = result.records[0];
                // 			if (isNode(record.get(0))) {
                // 				nodes = extractNodes(record);
                // 			} else {
                // 				nodes = record.toObject();
                // 			}
                // 		}
                // 	}
                // 	return { completed: true, output: nodes };
                // })
                // .catch((err) => {
                // 	return { completed: false, output: { error: err, query: queryText } };
                // })
                // return query_result;
            }
            catch (err) {
                var msg = null;
                if (err.message.includes('ECONNREFUSED'))
                    msg = 'ECONNREFUSED';
                err.service = 'Neo4j';
                return { completed: false, output: err, query: queryText, msg: msg };
            }
            finally {
                yield session.close();
            }
            ;
        });
    };
}
function validateDeleteResult(deleteFunc) {
    return function () {
        return __awaiter(this, arguments, void 0, function* () {
            var result = yield deleteFunc.apply(this, arguments);
            if (result.output === null) {
                const err = Error(`Nodes were NOT deleted OR there WERE NOT such nodes IN THE GRAPH`);
                // err.service = 'Neo4j';
                return { completed: false, output: err, msg: 'Nodes were NOT deleted OR there WERE NOT such nodes IN THE GRAPH' };
            }
            return { completed: true, output: 'Node(s) was succesfully deleted!' };
        });
    };
}
const changePhoneme = runQuery(query.changePhoneme);
const changePerson = runQuery(query.changePerson);
const addPerson = runQuery(query.addPerson);
const addRecord = runQuery(query.addRecord);
const addMarkup = runQuery(query.addMarkup);
// addSentences = runQuery(query.addSentences);
// addWords = runQuery(query.addWords);
const getMarkup = runQuery(query.getMarkup, true);
const getMarkups = runQuery(query.getMarkups, true);
const deletePerson = validateDeleteResult(runQuery(query.deletePerson));
const deleteRecord = validateDeleteResult(runQuery(query.deleteRecord));
const deleteMarkup = validateDeleteResult(runQuery(query.deleteMarkup));
// deleteSentences = validateDeleteResult(runQuery(query.deleteSentences))
// deleteWords = validateDeleteResult(runQuery(query.deleteWords))
// getSentenceMarkup = runQuery(query.getSentenceMarkup, true);
// getSentenceMarkups = runQuery(query.getSentenceMarkups, true);
// getWordMarkup = runQuery(query.getWordMarkup, true);
// getWordMarkups = runQuery(query.getWordMarkups, true);
const _getAllMarkupID = runQuery(query._getAllMarkupID, true, "_getAllMarkupID");
const _getMarkupInfoByID = runQuery(query._getMarkupInfoByID, false, "_getMarkupInfoByID");
const _getMarkupByID = runQuery(query._getMarkupByID, true, "_getMarkupByID");
const _getSentenceMarkupClean = runQuery(query._getSentenceMarkupClean, true, "_getSentenceMarkupClean");
const _getWordMarkupClean = runQuery(query._getWordMarkupClean, true, "_getWordMarkupClean");
exports._getAllMarkupID = _getAllMarkupID;
exports._getMarkupInfoByID = _getMarkupInfoByID;
exports._getMarkupByID = _getMarkupByID;
exports._getSentenceMarkupClean = _getSentenceMarkupClean;
exports._getWordMarkupClean = _getWordMarkupClean;
exports.changePhoneme = changePhoneme;
exports.changePerson = changePerson;
exports.addPerson = addPerson;
exports.addRecord = addRecord;
exports.addMarkup = addMarkup;
// exports.addSentences = addSentences;
// exports.addWords = addWords;
// exports.getMarkup = getMarkup;
exports.getMarkups = getMarkups;
// exports.getSentenceMarkup = getSentenceMarkup;
// exports.getSentenceMarkups = getSentenceMarkups;
// exports.getWordMarkup = getWordMarkup;
// exports.getWordMarkups = getWordMarkups;
exports.deletePerson = deletePerson;
exports.deleteRecord = deleteRecord;
exports.deleteMarkup = deleteMarkup;
// exports.deleteSentences = deleteSentences;
// exports.deleteWords = deleteWords;
exports.driver = driver;
exports.extractMarkdowns = extractMarkdowns;
/**
 * Функция возвращает все разметки аудиозаписей, для которых был размечен слой с фонемами.
 * @param {function} fucn функция-обработчик, которая будет применяться к каждой отдельной разметке (опциональный параметр).
 * @returns {object} список JSON-объектов с разметками.
 */
function extractMarkdowns(func = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const n = 0;
        const res = yield _getAllMarkupID();
        const markup_ids = [];
        res.output.forEach(obj => {
            markup_ids.push(Integer.toString(obj['ID']));
        });
        const promises = markup_ids.map((markup_id) => __awaiter(this, void 0, void 0, function* () {
            let jsonObj = (yield _getMarkupInfoByID(markup_id)).output;
            jsonObj['phonemes'] = (yield _getMarkupByID(markup_id)).output;
            jsonObj['words'] = (yield _getWordMarkupClean(jsonObj['username'], jsonObj['recordName'])).output;
            jsonObj['sentences'] = (yield _getSentenceMarkupClean(jsonObj['username'], jsonObj['recordName'])).output;
            if (func)
                func(jsonObj);
            return jsonObj;
        }));
        return Promise.all(promises);
    });
}
/*
phonemes = [{ notation: "x", start: 0, end: 0, language: 'ru', dialect: null }, { notation: "y", start: 0, end: 0, language: 'ru', dialect: null }]
addMarkup("test", "test", phonemes)
.then(result => {
    console.log("RESULT:\n", result);
})
.catch(err => {
    console.log("ERROR:\n", err);
})
*/
//# sourceMappingURL=service.js.map