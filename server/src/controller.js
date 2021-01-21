let cfg = require('./cfg');
let SpeechDB = require("./speechDB.js");
let RecordsDB = require("./recordsDB.js");
let SpeakersDB = require("./speakersDB.js");
let MarkupsDB = require("./markupsDB.js");

const CB = require("./CB.js");
const CB_SpeechDB = new CB(cfg.graph_service_uri);

// let userAuth = require("./userAuth.js");
let log = require("./log.js");
let formidable = require('formidable');
let fs = require('fs');

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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

/* УДАЛИТЬ НАХРЕН ПОТОМ */
const jwt = require('jsonwebtoken');
var storage = {};
// var storage = {
	// "testService": {
		// token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFNlcnZpY2UiLCJpZCI6IjYwMDk4ZmQ2MDJhZDk0MzIyNGU4ZTFiOCIsImV4cCI6MTYxMTIzOTM4OCwiaWF0IjoxNjExMjM5MzgyfQ.PM54uQO6zCdvJK88f_rfR4lsF-icTUBBv-jdjd_F6t59zNDRcR4HRcLwpaNGIQlgpiL17cncwMe-_Z-0ivon4sDlw7kzdLK6E_JiyWteuwuWu5jKKZFc2IqP8Ym7A8gYs_3iTzHsqzR6TY5Y5lrraT5K7R1iDjkCPraI22kE18w",
		// refreshToken: "fMPZG1EI/FpkA/sDm+64uSufP+bORjjxkFZiP8oMUXI="
	// }
// }
const publicKEY  = fs.readFileSync(__dirname + '/public.key');

var _username = "test@test.test";
var _password = "123456";

function refreshToken(serviceName) {
	const data = { refreshToken: storage[serviceName].refreshToken };
	return axios({ method: 'POST', url: cfg.auth_service_uri + '/refresh', data: data })
	.then(result => {
		storage[serviceName] = { token: result.data.token, refreshToken: result.data.refreshToken }
		console.log("\x1b[35mrefreshToken\x1b[0m");
		console.log(`service name: \x1b[36m${serviceName}\x1b[0m`);
		console.log(`token: \x1b[32m${result.data.token}\x1b[0m`);
		console.log(`refreshToken: \x1b[33m${result.data.refreshToken}\x1b[0m`);
		return result.data.token;
	})
	.catch(error => {
		console.log("\x1b[31mRefresh token error\x1b[0m");
		return getNewToken(serviceName);
	})
}

async function getNewToken(serviceName) {
	try {
		const data = { user: { username: _username, password: _password}, client: { name: serviceName } };
		var result = await axios({ method: 'POST', url: cfg.auth_service_uri + '/oauth', data: data })
		storage[serviceName] = { token: result.data.token, refreshToken: result.data.refreshToken };
		console.log("\x1b[35mgetNewToken\x1b[0m");
		console.log(`service name: \x1b[36m${serviceName}\x1b[0m`);
		console.log(`token: \x1b[32m${result.data.token}\x1b[0m`);
		console.log(`refreshToken: \x1b[33m${result.data.refreshToken}\x1b[0m`);
		return result.data.token;
	} catch (error) {
		throw error;
	}
}

function isTokenExpired(serviceName) {
	try {
		const token = storage[serviceName].token;
		const tokenJSON = jwt.verify(token, publicKEY);
	} catch (_) {
		return true;
	}
	return false;
}

async function getToken(serviceName) {
	try {
		if (storage[serviceName] == undefined) {
			return getNewToken(serviceName)
			.then(result => {
				return result;
			})
			.catch(error => {
				throw error;
			})
			// console.log("getToken (1) token:\n", token);
			// return token;
		}
		var token = storage[serviceName].token;
		if (isTokenExpired(serviceName) == true) {
			token = refreshToken(serviceName);
		}
		return token;
	} catch (err) {
		console.log("\x1b[31mGet token error\x1b[0m\n", err);
	}
}

// getToken("testService")
// .then(token => {
// 	console.log("ToKeN:\n", token);
// 	const tokenJSON = jwt.verify(token, publicKEY);
// 	console.log(tokenJSON);
// })
// .catch(err => {
// 	console.log(err);
// })

/* УДАЛИТЬ НАХРЕН ПОТОМ */

// getToken("testService");


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

				// const url = cfg.graph_service_uri + '/add_person';
				// return axios({ method: req.method, url: url, data: req.body })
				return CB_SpeechDB.fetch(req)
			})
			.then(response => {
				const result = response.data;
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
	CB_SpeechDB.fetch(req)
	.then(response => {
		const result = response.data;
		log.addLog(req.body.username, 'query.add', 'CB_SpeechDB /addPerson', result.completed, result, '/add_person');
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


function proxyRequest(method, route, url, serviceName="", useToken = false) {

	async function _proxyRequest(url, req, res) {
		// console.log("req.body: ", req.body);
		// console.log("req:", req);
		const request = { method: req.method, url: url, data: req.body };
		if (useToken) {
			await getToken(serviceName);
			const token = await getToken(serviceName);
			request.headers = { "Authorization": "Bearer " + token }
			// request.headers = { "Authorization": token }
			// console.log("headers: ", request.headers);
		}
		return await axios(request);
	};

	async function obtainResult(req, res) {
		_proxyRequest(url, req, res)
		.then(result => {
			// console.log("RESULT:\n", result);
			log.addLog(req.body.username, 'proxyRequest', '', result.status, result, req.route.path);
			/* УДАЛИТЬ НАХРЕН ПОТОМ */
			if (route == '/signin') {
				_username = req.body.username;
				_password = req.body.password;
			}
			/* УДАЛИТЬ НАХРЕН ПОТОМ */
			res.send(result.data);
		})
		.catch(error => {
			console.log(error);
			log.addLog(req.body.username, 'proxyRequest', '', false, error, req.headers.referer);
			res.status(error.response.status).json(error.response.data);
		});
	};
	if (method == 'POST') { app.post(route, obtainResult); } 
	else if (method == 'GET') { app.get(route, obtainResult); } 
	else { throw Error("Given method was not found"); }
}

/* AUTHENTICATION AND ACCOUNT ACCESS */
proxyRequest('POST', '/signin', cfg.auth_service_uri + '/signin', "authService");
proxyRequest('POST', '/signup', cfg.auth_service_uri + '/signup', "authService");
proxyRequest('POST', '/profile', cfg.auth_service_uri + '/profile', "testService", true);

/*
const CB = require("./CB.js");
// const cb = new CB(cfg.auth_service_uri);
const cb = new CB(cfg.graph_service_uri);
// app.post('/signin', cb.fetch);
*/

app.use('/', (req, res) => {
	res.status(404).send('<h1>404 Error</h1>')
})
