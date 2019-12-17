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

app.post('/add_person', (req, res) => {
	SpeechDB.addPerson(req.body.person)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'addPerson', result.completed, result.output, '/add_person');
		if (result.completed == false)
			res.send({ status: false, msg: 'Person was not added' });

		const nodeID = result.output[0].id;
		SpeakersDB.addSpeaker(req.body.pseudonym, nodeID)
		.then(result => {
			log.addLog(req.body.username, 'query.add', 'addSpeaker', result.completed, result.output, '/add_person');
			if (result.completed == false)
				res.send({ status: false, msg: 'Person was not added' });
			res.send({ status: true, msg: 'Person was added' });
		})
	})
	.catch(err => {
		throw err;
	})
});

app.get('/persons', (req, res) => {
	SpeakersDB.getAllSpeakers()
	.then(result => {
		log.addLog(req.body.username, 'access.persons', 'getAllSpeakers', true, result, '/persons');
		console.log(result);
		res.send(result);
	})
});

app.post('/records', (req, res) => {
	RecordsDB.getAllRecords()
	.then(result => {
		log.addLog(req.body.username, 'access.records', 'getAllRecords', true, result, '/records');
		res.send(result);
	});
});

function files() {
	let path = cfg.records_dir;
	console.log(path);
	fs.readdirSync(path).forEach(file => {
  		console.log(file);
	});
}

app.post('/add_record', (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		let dictor = fields.text;
		let oldpath = files.filetoupload.path;
		let newpath = cfg.records_dir + files.filetoupload.name;
		try {
			fs.rename(oldpath, newpath, function (err) {
				if (err) throw err;
			});
			RecordsDB.addRecord(files.filetoupload.name, newpath, req.body.personID)
			.then(result => {
				log.addLog(req.body.username, 'upload.file', 'addRecord', result.completed, result.output, '/add_record');
				if (result.completed) {
					res.send({ status: true, msg: 'Record was successfully uploaded!' });
				} else {
					res.send({ status: false, msg: result.output });
				}
			})
			.catch(err => {
				throw err;
			})
		} catch (err) {
			console.log(err);
		}
	});
});

app.post('/signin', (req, res) => {
	let username = req.body.username,
		password = req.body.password;

	userAuth.verifyUser(username, password)
	.then(result => {
		console.log('(/signin) verifyUser:', result);
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
		
	console.log("(/person) username:", username);
	userAuth.getUser(username)
	.then(result => {
		console.log("(/person) result:", result);
		const completed = Boolean(result);
		log.addLog(req.body.username, 'access.profile', 'getUser', completed, result, '/profile');
		res.send(result);
	});
});

app.post('/add_data', (req, res) => {
	SpeechDB.addRecordPersonPhonemes(req.body.record, req.body.person, req.body.phonemes)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'addRecordPersonPhonemes', result.completed, result.output, '/add_data');
		if (result.completed) {
			result.output.forEach((node) => {
				const recordID = node.id;
				NodeStats.updateNodeInfo(recordID, node.id, node.label, req.body.username);
			});
			res.send("Data was successfully loaded!");
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/change_person', (req, res) => {
	// let person = entity.Person('James', 'English', 'New York', 'USA');
	let result = SpeechDB.changePerson(req.body.person, req.body.id)
	.then(result => {
		log.addLog(req.body.username, 'query.change', 'changePerson', result.completed, result.output, '/change_person');
		if (result.completed) {
			res.send("Person was successfully changed!");
		}
		else {
			res.send("Person WAS NOT changed!");
		}
	});
});

app.post('/change_phoneme', (req, res) => {
	// let phoneme = entity.Phoneme('a', '0.123', '0.456', 'german');
	let result = SpeechDB.changePhoneme(req.body.phoneme, req.body.id)
	.then(result => {
		log.addLog(req.body.username, 'query.change', 'changePhoneme', result.completed, result.output, '/change_phoneme');
		if (result.completed) {
			res.send("Phoneme was successfully changed!");
		}
		else {
			res.send("Phoneme WAS NOT changed!");
		};
	});
});

// app.get('/get_data', (req, res) => {
	/* smth */
// });
