var cfg = require('./cfg');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.info_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

var nodeInfoSchema = new mongoose.Schema({
	recordID: String,
	nodeID: String,
	label: String,
	createdBy: String,
	lastEditBy: String,
	lastEditDate: Date
});

var NodeInfo = users_connection.model('NodeInfo', nodeInfoSchema);
/**
    * Функция возвращает информацию о узле.
    * @param {int} nodeID id узла.
    * @returns {bool} факт наличия узла в базе.
*/
async function getNodeInfo (nodeID) {
	return await NodeInfo.findOne({ nodeID: nodeID });
}
/**
    * Функция изменяет значение узла.
    * @param {int} recordID id аудиозаписи.
    * @param {int} nodeID id узла.
    * @param {string} label метка узла.
    * @param {string} username логин пользователя.
    * @returns {object} успех или неуспех операции.
*/
async function updateNodeInfo(recordID, nodeID, label, username) {
	try {
		var currentDate = new Date();
		var nodeInfo = null;
		var existingNode = await getNodeInfo(nodeID);
		if (existingNode) {
			existingNode.lastEditBy = username;
			existingNode.lastEditDate = currentDate;
			nodeInfo = existingNode;
		} else {
			nodeInfo = new NodeInfo({recordID: recordID, nodeID: nodeID, label: label, createdBy: username,
				lastEditBy: username, lastEditDate: currentDate});
		}
		return nodeInfo.save()
		.then((nodeInfo) => {
			return { completed: true, output: nodeInfo };
		});
	} catch (err) {
		return { completed: false, output: err };
	}
}

exports.getNodeInfo = getNodeInfo;
exports.updateNodeInfo = updateNodeInfo;
