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

async function updateNodeInfo(recordID, nodeID, label, username) {
	try {
		var nodeExists = await getNodeInfo(nodeID);
			if (nodeExists) {
				// console.log('this node (', nodeExists, ' exists! )');
				// return { completed: true, output: 'this node exists!' };
				console.log(true);
			} else {
				console.log(false);
				return null;
			}
		var newNodeInfo = new NodeInfo({recordID: recordID, nodeID: nodeID, label: label, createdBy: username, 
									lastEditBy: username, date: localDate.now()});
		return newNodeInfo.save()
		.then((nodeInfo) => {
			return { completed: true, output: nodeInfo };
		});
	} catch (err) {
		return { completed: false, output: err };
	}
}

exports.getNodeInfo = getNodeInfo;
exports.updateNodeInfo = updateNodeInfo;

async function test() {
	// updateNodeInfo('recordID', '296', 'Person', 'username')
	// .then((result) => {
		// console.log('res1: ', result);
	// });

	updateNodeInfo('recordID', '296', 'Person', 'username')
	.then((result) => {
		console.log(result);
	});

	// var res = updateNodeInfo('recordID', '299', 'Phoneme', 'username');
	// console.log('res2: ', res);
};

test();
// console.log(localDate.now());

// console.log(test());

// { id: '296', label: 'Person' }, { id: '299', label: 'Phoneme' }
// console.log('hello').then(', world');
// updateNodeInfo('recordID', '296', 'Person', 'username')
// .then((result) => { console.log(result) });

// updateNodeInfo('recordID', '299', 'Phoneme', 'username')
// .then((result) => {
	// console.log(result);
// });



