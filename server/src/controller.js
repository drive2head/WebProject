// let entity = require("./entity.js"); /* only for debug */
let SpeechDB = require("./speechDB.js");
let RecordsDB = require("./recordsDB.js");
let SpeakersDB = require("./speakersDB.js");
let NodeStats = require("./nodeStatsDB.js");

let userAuth = require("./userAuth.js");
let log = require("./log.js");
let formidable = require('formidable');
let fs = require('fs');
let cfg = require('./cfg');

const express = require('express');
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('files'))

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

function files() {
	let path = cfg.records_dir;
	fs.readdirSync(path).forEach(file => {
  		console.log(file);
	});
}

app.get('/persons', (req, res) => {
	SpeakersDB.getAllSpeakers()
	.then(result => {
		log.addLog(req.body.username, 'access.persons', 'getAllSpeakers', true, result, '/persons');
		res.send(result);
	})
});

app.get('/records', (req, res) => {
	RecordsDB.getAllRecords()
	.then(result => {
		log.addLog(req.body.username, 'access.records', 'getAllRecords', true, result, '/records');
		res.send(result);
	});
});

app.post('/markups', (req, res) => {
	SpeechDB.getMarkups(req.body.username)
	.then(result => {
		console.log(result);
		log.addLog(req.body.username, 'access.markups', 'getMarkups', result.completed, result.output, '/markups');
		res.send(result);
	})
});

app.post('/add_person', (req, res) => {
	console.log(req.body);
	SpeechDB.addPerson(req.body.person)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'addPerson', result.completed, result.output, '/add_person');
		if (result.completed == false) {
			res.send({ status: false, msg: 'Person was not added' });
			return;
		}

		const nodeID = result.output[0].id;
		SpeakersDB.addSpeaker(req.body.pseudonym, nodeID)
		.then(result => {
			log.addLog(req.body.username, 'query.add', 'addSpeaker', result.completed, result.output, '/add_person');
			if (result.completed == false) {
				res.send({ status: false, msg: 'Person was not added' });
				return;
			}
			res.send({ status: true, msg: 'Person was added' });
		})
		.catch(err => {
			console.log("Error occured:\n", err);
		})
	})
	.catch(err => {
		throw err;
	})
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
				if (err) throw err;
			});

			SpeakersDB.findSpeakerByID(personID)
			.then(result => {
				const personNodeID = result.nodeID;
				return SpeechDB.addRecord({recname: recordName, tags: null}, personNodeID);
			})
			.then(result => {
				log.addLog(req.body.username, 'upload.file', 'SpeechDB.addRecord', result.completed, result.output, '/add_record');
				if (result.completed == false) {
					res.send({ status: false, msg: result.output });
					return;
				}
				return RecordsDB.addRecord(files.filetoupload.name, newpath, personID)
			})
			.then(result => {
				log.addLog(req.body.username, 'upload.file', 'RecordsDB.addRecord', result.completed, result.output, '/add_record');
				if (result.completed) {
					res.redirect('/');
				} else {
					res.send({ status: false, msg: result.output });
				}
			})
			.catch(err => { throw err; })
		} catch (err) {
			log.addLog(req.body.username, 'upload.file', '', false, err, '/add_record');
		};
	})
});

// app.post('/add_record', (req, res) => {
// 	let form = new formidable.IncomingForm();
// 	form.parse(req, function (err, fields, files) {
// 		let personID = fields.text;
// 		let oldpath = files.filetoupload.path;
// 		let newpath = cfg.records_dir + files.filetoupload.name;
// 		let recordName = files.filetoupload.name;
// 		try {
// 			fs.rename(oldpath, newpath, function (err) {
// 				if (err) throw err;
// 			});

// 			SpeakersDB.findSpeakerByID(personID)
// 			.then(result => {
// 				const personNodeID = result.nodeID;
// 				SpeechDB.addRecord({recname: recordName, tags: null}, personNodeID)
// 				.then(result => {
// 					log.addLog(req.body.username, 'upload.file', 'SpeechDB.addRecord', result.completed, result.output, '/add_record');
// 					if (result.completed == false) {
// 						res.send({ status: false, msg: result.output });
// 						return;
// 					}

// 					RecordsDB.addRecord(files.filetoupload.name, newpath, personID)
// 					.then(result => {
// 						log.addLog(req.body.username, 'upload.file', 'RecordsDB.addRecord', result.completed, result.output, '/add_record');
// 						if (result.completed) {
// 							res.redirect('/');
// 						} else {
// 							res.send({ status: false, msg: result.output });
// 						}
// 					})
// 					.catch(err => { throw err; })
// 				})
// 				.catch(err => { throw err; })
// 			})
// 		} catch (err) {
// 			log.addLog(req.body.username, 'upload.file', '', false, err, '/add_record');
// 		};
// 	})
// });

app.post('/add_data', (req, res) => {
	SpeechDB.addMarkup(req.body.username, req.body.record, req.body.phonemes)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'addMarkup', result.completed, result.output, '/add_data');
		if (result.completed) {
			// result.output.forEach((node) => {
				// const recordID = node.id;
				// NodeStats.updateNodeInfo(recordID, node.id, node.label, req.body.username);
			// });
			res.send("Data was successfully loaded!");
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/get_data', (req, res) => {
	console.log(req.body.username, req.body.record);
	SpeechDB.getMarkup(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'access.markup', 'getMarkup', result.completed, result.output, '/add_data');
		if (result.completed) {
			res.send(result);
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/delete_person', (req, res) => {
	const personNodeID = result.nodeID;
	const id = result._id;

	SpeakersDB.findSpeakerByName(req.body.name)
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeakersDB.findSpeakerByName', result.completed, result.output, '/delete_person');
		if (!result) {
			res.send({ status: false, msg: 'Person was not found' });
			return;
		}
		return SpeechDB.deletePerson(personNodeID)
	})
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deletePerson', result.completed, result.output, '/delete_person');
		if (!result.completed) {
			res.send({ status: false, msg: result.output });
			return;
		}

		return SpeakersDB.deleteSpeakerByID(id)
	})
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeakersDB.deleteSpeakerByID', result.completed, result.output, '/delete_person');
		if (!result.completed) {
			res.send({ status: false, msg: result.output });
		} else {
			res.send({ status: true, msg: 'Person was successfully deleted!'})
		}
	})
	.catch(err => {
		console.log("Error occured:\n", err);
	});
});

/* AUTHENTICATION AND ACCOUNT ACCESS */
app.post('/signin', (req, res) => {
	let username = req.body.username,
		password = req.body.password;

	userAuth.verifyUser(username, password)
	.then(result => {
		log.addLog(req.body.username, 'access.signin', 'userExist', result.completed, result.output, '/signin');
		res.send({ status: result.completed, msg: result.output });
	});
});

app.post('/signup', (req, res) => {
	let username = req.body.username,
		password = req.body.password,
		name = req.body.name,
		surname = req.body.surname;

	userAuth.addUser(username, password, name, surname)
	.then(result => {
		log.addLog(req.body.username, 'access.signup', 'addUser', result.completed, result.output, '/signup');
		if (result.completed) {
			res.send({ status: true, msg: 'User was successfully created!' });
		} else {
			res.send({ status: false, msg: result.output });
		}
	})
});

app.post('/profile', (req, res) => {
	let username = req.body.username,
		password = req.body.password;
		
	userAuth.getUser(username)
	.then(result => {
		const completed = Boolean(result);
		log.addLog(req.body.username, 'access.profile', 'getUser', completed, result, '/profile');
		res.send(result);
	});
});

// app.post('/change_person', (req, res) => {
// 	// let person = entity.Person('James', 'English', 'New York', 'USA');
// 	let result = SpeechDB.changePerson(req.body.person, req.body.id)
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.change', 'changePerson', result.completed, result.output, '/change_person');
// 		if (result.completed) {
// 			res.send("Person was successfully changed!");
// 		}
// 		else {
// 			res.send("Person WAS NOT changed!");
// 		}
// 	});
// });

// app.post('/change_phoneme', (req, res) => {
// 	// let phoneme = entity.Phoneme('a', '0.123', '0.456', 'german');
// 	let result = SpeechDB.changePhoneme(req.body.phoneme, req.body.id)
// 	.then(result => {
// 		log.addLog(req.body.username, 'query.change', 'changePhoneme', result.completed, result.output, '/change_phoneme');
// 		if (result.completed) {
// 			res.send("Phoneme was successfully changed!");
// 		}
// 		else {
// 			res.send("Phoneme WAS NOT changed!");
// 		};
// 	});
// });
