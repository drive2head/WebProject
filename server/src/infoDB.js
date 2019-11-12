var cfg = require('./cfg');
var localDate = require('./localDate');

var mongoose = require('mongoose');
var users_connection = mongoose.createConnection(cfg.info_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});

// | audioID | nodeID | label | createdBy | lastEditBy | date | //
var nodeInfoSchema = new mongoose.Schema({
  recordID: String,
  nodeID: String,
  label: String,
  createdBy: String,
  lastEditBy: String,
  date: Date
});

var NodeInfo = users_connection.model('NodeInfo', nodeInfoSchema);

async function getNodeInfo (nodeID) {
	return await NodeInfo.findOne({ nodeID: nodeID });
}

function updateNodeInfo(recordID, nodeID, label, username) {
	try {
		var nodeExists = getNode(nodeID);
		if (nodeExists) {
			return 
		}
		var newNodeInfo = new NodeInfo({recordID: recordID, nodeID: nodeID, label: label, createdBy: username, 
									lastEditBy: username, date: localDate.now()});
		newNodeInfo = await newNodeInfo.save();
		return { completed: true, output: newNodeInfo };
	} catch (err) {
		return { completed: false, output: err };
	}
}