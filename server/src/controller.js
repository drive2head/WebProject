// let entity = require("./entity.js"); /* only for debug */
let SpeechDB = require("./speechDB.js");
let RecordsDB = require("./recordsDB.js");
let SpeakersDB = require("./speakersDB.js");
let MarkupsDB = require("./markupsDB.js");

// let userAuth = require("./userAuth.js");
let log = require("./log.js");
let formidable = require('formidable');
let fs = require('fs');
let cfg = require('./cfg');

const axios = require('axios');
const express = require('express');
const app = express();
const Morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(Morgan('combined'));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('files'))

app.use(bodyParser({limit: '50mb'}));
// app.use(bodyParser.json({limit: '50mb', extended: true}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

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

// app.get('/extract_markdowns', async (req, res) => {
// 	function write_json_to_file(jsonObj) {
// 		let date = new Date();
// 		let now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
// 		let path = cfg.phonemes_dir;
// 		let filename = jsonObj['username'] + '_' + jsonObj['recordName'].split('.').slice(0, -1).join('.') + '_' + now + '.json';
// 		fs.writeFile(path + filename, JSON.stringify(jsonObj, null, 2), function(err) {
// 			log.addLog('ADMIN', 'access.data', 'extractMarkdowns -> write_json_to_file', err == null, 'Created ' + filename + ' at ' + path, '/extract_markdowns');
// 			if (err)
// 				return;
// 		});
// 	}

// 	r = await SpeechDB.extractMarkdowns(write_json_to_file);
// 	res.send(r);
// });

app.get('/persons', (req, res) => {
	SpeakersDB.getAllSpeakers()
	.then(result => {
		log.addLog(req.body.username, 'access.persons', 'RecordsDB.getAllSpeakers', true, result, '/persons');
		res.send(result);
	})
	.catch(err => {
		log.addLog(req.body.username, 'access.persons', 'RecordsDB.getAllSpeakers', false, err, '/persons');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	})
});

app.get('/rec', (req, res) => {
	RecordsDB.getAllRecords()
    .then(result => {
        log.addLog(req.body.username, 'access.records', 'RecordsDB.getAllRecords', true, result, '/records');
		res.send(result);
	})
	.catch(err => {
		log.addLog(req.body.username, 'access.records', 'RecordsDB.getAllRecords', true, result, '/records');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	})
});

app.post('/add_log', async (req, res) => {
	log.addLog(req.body.username, 'FRONT', req.body.logOf, req.body.completed, req.body.result, req.body.logFrom);
	res.sendStatus(200);
});

app.post('/markups', async (req, res) => {
	let username = req.body.username;
	let markups = [];
	let _completed = true;

	try {
		result = await MarkupsDB.getMarkups(username);
		CheckOperationResult(result);
		log.addLog(username, 'access.markups', '', true, result, '/markups');
		res.status(200).send({ status: true, output: result.output });
	} catch (err) {
		log.addLog(username, 'access.markups', '', false, err, '/markups');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	}
});

app.post('/add_record', (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		let personID = fields.text;
		let oldpath = files.filetoupload.path;
		let newpath = cfg.records_dir + files.filetoupload.name;
		let recordName = files.filetoupload.name;
		try {
			fs.rename(oldpath, newpath, function (err) {
				if (err) throw err; // TODO
			});

			SpeakersDB.findSpeakerByID(personID)
			.then(result => {
				const personNodeID = result.nodeID;
				return SpeechDB.addRecord({recname: recordName, tags: null}, personNodeID);
			})
			.then(result => {
				log.addLog(req.body.username, 'upload.file', 'SpeechDB.addRecord', result.completed, result.output, '/add_record');
				CheckOperationResult(result);
				return RecordsDB.addRecord(files.filetoupload.name, newpath, personID);
			})
			.then(result => {
				log.addLog(req.body.username, 'upload.file', 'RecordsDB.addRecord', result.completed, result.output, '/add_record');
				if (result.completed) {
					res.redirect('/');
				} else {
					throw result.output;
				}
			})
			.catch(err => { throw err; })
		} catch (err) {
			log.addLog(req.body.username, 'upload.file', '', false, err, '/add_record');
			err.msg == 'ECONNREFUSED' ?
				res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
				res.status(500).send({ service: err.service, error: err });
		};
	})
});

app.post('/add_person', async (req, res) => {
	console.log("req.body:\n", req.body);
	const url = cfg.graph_service_uri + '/add_person';
	const result = await axios({
		method: req.method,
		url: url,
		data: req.body
	});
	console.log("result:\n", result);
	res.send({status: true});

	SpeechDB.addPerson(req.body.person)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'SpeechDB.addPerson', result.completed, result.output, '/add_person');
		CheckOperationResult(result);

		const nodeID = result.output[0].id;
		SpeakersDB.addSpeaker(req.body.pseudonym, nodeID)
		.then(result => {
			log.addLog(req.body.username, 'query.add', 'SpeakersDB.addSpeaker', result.completed, result.output, '/add_person');
			CheckOperationResult(result);
			res.send({ status: true, msg: 'Person was added' });
		})
		.catch(err => {
			throw err;
		})
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.add', '', false, err, '/add_person');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	})
});

/*
-- Версия без сервиса
app.post('/add_person', (req, res) => {
	SpeechDB.addPerson(req.body.person)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'SpeechDB.addPerson', result.completed, result.output, '/add_person');
		CheckOperationResult(result);

		const nodeID = result.output[0].id;
		SpeakersDB.addSpeaker(req.body.pseudonym, nodeID)
		.then(result => {
			log.addLog(req.body.username, 'query.add', 'SpeakersDB.addSpeaker', result.completed, result.output, '/add_person');
			CheckOperationResult(result);
			res.send({ status: true, msg: 'Person was added' });
		})
		.catch(err => {
			throw err;
		})
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.add', '', false, err, '/add_person');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	})
});
*/

app.post('/update_data', async (req, res) => {
		/* SAVING DATA TO THE FILE */
		let date = new Date();
		let now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
		let path = cfg.phonemes_dir;
		let filename = req.body.username + '_' + req.body.recordname.split('.').slice(0, -1).join('.') + '_' + now + '.json';
		fs.writeFile(path + filename, JSON.stringify({recordname: req.body.recordname, phonemes: req.body.phonemes, words: req.body.words, sentences: req.body.sentences}, null, 2), function(err) {
			result = err == null ? 'Created ' + filename + ' at ' + path : 'File ' + filename + ' was not created';
		    log.addLog('ADMIN', 'access.data', 'extractMarkdowns -> write_json_to_file', err == null, result, '/update_data');
		});

		const username = req.body.username;
		const recordname = req.body.recordname;

		log.addLog(username, 'upload', 'С фронта прилетело это', true, req.body, '/update_data');

		try {
			var result = await MarkupsDB.getMarkup(username, recordname);
			CheckOperationResult(result);
			const existingMarkup = result.output;
			/* CHECKING IF MARKUP IS ALREADY EXISTS */
			if (existingMarkup == null) {
				result = await MarkupsDB.addMarkup(req.body);
				CheckOperationResult(result);
			} else {
				result = await MarkupsDB.updateMarkup(req.body);
				CheckOperationResult(result);
			}

			log.addLog(username, 'upload', '', true, result, '/update_data');
			res.send({ status: true, msg: 'Data was upadated' });
		} catch (err) {
			log.addLog(username, 'upload', '', false, err, '/update_data');
			err.msg == 'ECONNREFUSED' ?
				res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
				res.status(500).send({ service: err.service, error: err });
		}
});

app.post('/get_data', async (req, res) => {
	try {
		let result = await MarkupsDB.getMarkup(req.body.username, req.body.recordname);
		log.addLog(req.body.username, 'access.markup', 'getMarkup', result.completed, result.output, '/get_data');
		CheckOperationResult(result);
		res.send(result);
	} catch (err) {
		log.addLog(req.body.username, 'access.markup', 'getMarkup', false, result.output, '/get_data');
		err.msg == 'ECONNREFUSED' ?
			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
			res.status(500).send({ service: err.service, error: err });
	}
});

// app.post('/remove_person', (req, res) => {
// 	const personNodeID = result.nodeID;
// 	const id = result._id;

// 	SpeakersDB.findSpeakerByName(req.body.name)
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.delete', 'SpeakersDB.findSpeakerByName', result.completed, result.output, '/delete_person');
// 		CheckOperationResult(result);
// 		return SpeechDB.deletePerson(personNodeID)
// 	})
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deletePerson', result.completed, result.output, '/delete_person');
// 		CheckOperationResult(result);
// 		return SpeakersDB.deleteSpeakerByID(id)
// 	})
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.delete', 'SpeakersDB.deleteSpeakerByID', result.completed, result.output, '/delete_person');
// 		CheckOperationResult(result);
// 		res.send({ status: true, msg: 'Person was successfully deleted!'})
// 	})
// 	.catch(err => {
// 		log.addLog(req.body.username, 'query.delete', '', false, err, '/delete_person');
// 		err.msg == 'ECONNREFUSED' ?
// 			res.status(500).send({ service: err.service, message: "Connection refused", error: err }) :
// 			res.status(500).send({ service: err.service, error: err });
// 	});
// });

// app.post('/remove_data', (req, res) => {
// 	var status = 0;

// 	/* new part */
// 	promises = [];

// 	promises.push(SpeechDB.deleteMarkup(req.body.username, req.body.record));
// 	promises.push(SpeechDB.deleteWords(req.body.username, req.body.record));
// 	promises.push(SpeechDB.deleteSentences(req.body.username, req.body.record));

// 	Promise.all(promises)
// 	.then(results => {
// 		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', results[0].completed, results[0].output, '/remove_data');
// 		if (results[0].completed == false) {
// 			status |= 1;
// 		}

// 		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteWords', results[1].completed, results[1].output, '/remove_data');
// 		if (results[1].completed == false) {
// 			status |= 1 << 1;
// 		}

// 		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteSentences', results[2].completed, results[2].output, '/remove_data');
// 		if (results[2].completed == false) {
// 			status |= 1 << 2;
// 		}

// 		if (status) {
// 			msg = 'Markups of types was not removed: ';
// 			if (status & 1) { msg += 'phonemes '; }
// 			if (status & 1 << 1) { msg += 'words '; }
// 			if (status & 1 << 2) { msg += 'sentences '; }
// 		} else {
// 			msg = 'Markups was successfully deleted!';
// 		}

// 		log.addLog(req.body.username, 'query.delete', 'DELETE RESULT FOR "' + req.body.record + '"', true, msg + '!\nStatus: ' + (status).toString(2), '/remove_data');

// 		res.send({ status: true, msg: msg });
// 	})
// 	.catch(err => {
// 		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_data');
// 		res.send({ status: false, msg: err });
// 	});
// });

// app.post('/remove_markup', (req, res) => {
// 	SpeechDB.deleteMarkup(req.body.username, req.body.record)
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', result.completed, result.output, '/remove_markup');
// 		if (!result.completed) {
// 			res.send({ status: false, msg: result.output });
// 			return;
// 		}
// 		res.send({ status: true, msg: 'Markup was successfully deleted!'});
// 	})
// 	.catch(err => {
// 		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_markup');
// 	});
// });

function proxyRequest(method, route, url, serviceName="") {

	async function _proxyRequest(url, req, res) {

		const result = await axios({
			method: req.method,
			url: url,
			data: req.body
		});
		return result;

	};

	async function obtainResult(req, res) {

		_proxyRequest(url, req, res)
		.then(result => {
			log.addLog(req.body.username, 'proxyRequest', '', result.status, result, req.route.path);
			console.log("RES: ", result)
			res.send(result.data);
		})
		.catch(error => {
			console.log("ERROR: ", error.response)
			log.addLog(req.body.username, 'proxyRequest', '', false, error, req.headers.referer);
			res.status(error.response.status).json(error.response.data);
		});
	};

	if (method == 'POST') {
		app.post(route, obtainResult);
	} else if (method == 'GET') {
		app.get(route, obtainResult);
	} else {
		throw Error("Given method was not found");
	}
}

/* AUTHENTICATION AND ACCOUNT ACCESS */
proxyRequest('POST', '/signin', cfg.auth_service_uri + '/signin', "authService");
proxyRequest('POST', '/signup', cfg.auth_service_uri + '/signup', "authService");
proxyRequest('POST', '/profile', cfg.auth_service_uri + '/profile', "authService");

// const CB = require("./CB.js");
// const cb = new CB(cfg.auth_service_uri);
// app.post('/signin', cb.fetch);

app.use('/', (req, res) => {
	res.status(404).send('<h1>404 Error</h1>')
})
