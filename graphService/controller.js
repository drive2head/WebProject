let SpeechDB = require("../server/src/speechDB.js");

function CheckOperationResult(res) {
	if (!res.completed) {
		var result_error = res.output;
		if (res.msg == 'ECONNREFUSED') {
			console.log({ service: result_error.service, message: "Connection refused", error: result_error });
		} else {
			console.log({ service: result_error.service, error: result_error });
		}
		throw res.output;
	}
}

module.exports = GraphController = {
    welcome(req, res) {
        res.send('Hello, Kolya!')
    },

    addRecord(req, res) {
    	const recordName = req.body.recordName;
    	const personNodeId = req.body.personNodeID;
    	SpeechDB.addRecord({recname: recordName, tags: null}, personNodeID)
		.then(result => {
			CheckOperationResult(result);
		})
		.catch(err => {
			var response = { service: err.service, error: err };
			if (err.msg == 'ECONNREFUSED')
				response.message = "Connection refused"
			res.status(500).send(response);
		})
    },

    addPerson(req, res) {
    	console.log("REQ.BODY:\n", req.body);

    	SpeechDB.addPerson(req.body.person)
		.then(result => {
			CheckOperationResult(result);
			res.send(result);
		})
		.catch(err => {
			var response = { service: err.service, error: err };
			if (err.msg == 'ECONNREFUSED')
				response.message = "Connection refused"
			res.status(500).send(response);
		})
    },
};
