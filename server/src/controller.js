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

app.get('/extract_markdowns', async (req, res) => {
	function write_json_to_file(jsonObj) {
		let date = new Date();
		let now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
		let path = cfg.phonemes_dir;
		let filename = jsonObj['username'] + '_' + jsonObj['recordName'].split('.').slice(0, -1).join('.') + '_' + now + '.json';
		fs.writeFile(path + filename, JSON.stringify(jsonObj, null, 2), function(err) {
			log.addLog('ADMIN', 'access.data', 'extractMarkdowns -> write_json_to_file', err == null, 'Created ' + filename + ' at ' + path, '/extract_markdowns');
			if (err)
				return;
		}); 
	}

	r = await SpeechDB.extractMarkdowns(write_json_to_file);
	res.send(r);
});

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
		log.addLog(req.body.username, 'access.records', 'RecordsDB.getAllRecords', true, result, '/records');
		res.send(result);
	});
});

app.post('/markups', (req, res) => {
	let markups = [];
	let _completed = true;

	Promise.all([SpeechDB.getMarkups(req.body.username), SpeechDB.getSentenceMarkups(req.body.username), SpeechDB.getWordMarkups(req.body.username)])
	.then(results => {
		log.addLog(req.body.username, 'access.markups', 'SpeechDB.getMarkups', results[0].completed, results[0].output, '/markups');
		log.addLog(req.body.username, 'access.sentenceMarkups', 'SpeechDB.getSentenceMarkups', results[1].completed, results[1].output, '/markups');
		log.addLog(req.body.username, 'access.wordMarkups', 'SpeechDB.getWordMarkups', results[2].completed, results[2].output, '/markups');
		results.forEach(result => {
			if (result.completed) {
				result.output.forEach((node) => {
					markups.push(node.properties.name);
				})
			} else {
				_completed = false;
			}
		})

		let result = {
			status: _completed,
			output: _completed ? [... new Set(markups)] : null
		}

		res.send(result);
	})
});

app.post('/add_person', (req, res) => {
	SpeechDB.addPerson(req.body.person)
	.then(result => {
		log.addLog(req.body.username, 'query.add', 'SpeechDB.addPerson', result.completed, result.output, '/add_person');
		if (result.completed == false) {
			res.send({ status: false, msg: 'Person was not added' });
			return;
		}

		const nodeID = result.output[0].id;
		SpeakersDB.addSpeaker(req.body.pseudonym, nodeID)
		.then(result => {
			log.addLog(req.body.username, 'query.add', 'SpeakersDB.addSpeaker', result.completed, result.output, '/add_person');
			if (result.completed == false) {
				res.send({ status: false, msg: 'Person was not added' });
				return;
			}
			res.send({ status: true, msg: 'Person was added' });
		})
		.catch(err => {
			log.addLog(req.body.username, 'query.add', '', false, err, '/add_person');
		})
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.add', '', false, err, '/add_person');
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
				return RecordsDB.addRecord(files.filetoupload.name, newpath, personID);
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

app.post('/update_data', (req, res) => {
		var status = 0;

		/* SAVING DATA TO THE FILE */
		let date = new Date();
		let now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
		let path = cfg.phonemes_dir;
		let filename = req.body.username + '_' + req.body.record.split('.').slice(0, -1).join('.') + '_' + now + '.json';
		fs.writeFile(path + filename, JSON.stringify({record: req.body.record, phonemes: req.body.phonemes, words: req.body.words, sentences: req.body.sentences}, null, 2), function(err) {
			result = err == null ? 'Created ' + filename + ' at ' + path : 'File ' + filename + ' was not created';
		    log.addLog('ADMIN', 'access.data', 'extractMarkdowns -> write_json_to_file', err == null, result, '/add_data');
		});

		/* DELETING PREVIOUS MARKUPS */
		deletion_promises = [];

		deletion_promises.push(SpeechDB.deleteMarkup(req.body.username, req.body.record));
		deletion_promises.push(SpeechDB.deleteWords(req.body.username, req.body.record));
		deletion_promises.push(SpeechDB.deleteSentences(req.body.username, req.body.record));

		Promise.all(deletion_promises)
		.then(results => {
			log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', results[0].completed, results[0].output, '/update_data');
			if (results[0].completed == false) {
				status |= 1;
			}

			log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteWords', results[1].completed, results[1].output, '/update_data');
			if (results[1].completed == false) {
				status |= 1 << 1;
			}

			log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteSentences', results[2].completed, results[2].output, '/update_data');
			if (results[2].completed == false) {
				status |= 1 << 2;
			}

			if (status) {
				msg = 'Markups of types was not removed: ';
				if (status & 1) { msg += 'phonemes '; }
				if (status & 1 << 1) { msg += 'words '; }
				if (status & 1 << 2) { msg += 'sentences '; }
			} else {
				msg = 'Markups was successfully deleted!';
			}

			log.addLog(req.body.username, 'query.delete', 'DELETE RESULT', true, msg + '!\nStatus: ' + (status).toString(2), '/update_data');

			/* UPLOADING NEW DATA INSTEAD OF OLD DELETED ONE  */
			status = 0;
			promises = [];
		
			promises.push(req.body.phonemes.length ? SpeechDB.addMarkup(req.body.username, req.body.record, req.body.phonemes) : null);
			promises.push(req.body.words.length ? SpeechDB.addWords(req.body.username, req.body.record, req.body.words) : null);
			promises.push(req.body.sentences.length ? SpeechDB.addSentences(req.body.username, req.body.record, req.body.sentences) : null);

			Promise.all(promises)
			.then(results => {
				if (results[0] != null) {
					log.addLog(req.body.username, 'query.add', 'SpeechDB.addMarkup', results[0].completed, results[0].output, '/update_data');
					if (results[0].completed == false) {
						status |= 1;
					}
				}
				if (results[1] != null) {
					log.addLog(req.body.username, 'query.add', 'SpeechDB.addWords', results[1].completed, results[1].output, '/update_data');
					if (results[1].completed == false) {
						status |= 1 << 1;
					}
				}
				if (results[2] != null) {
					log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', results[2].completed, results[2].output, '/update_data');
					if (results[2].completed == false) {
						status |= 1 << 2;
					}
				}

				// console.log('Status: ' + (status).toString(2));

				log.addLog(req.body.username, 'query.add', 'LOAD RESULT', status == 0, 'Status: ' + (status).toString(2), '/update_data');

				if (status) {
					msg = 'Data was not uploaded: ';
					if (status & 1) { msg += 'phonemes '; }
					if (status & 1 << 1) { msg += 'words '; }
					if (status & 1 << 2) { msg += 'sentences '; }
				} else {
					msg = 'Data was uploaded!';
				}

				// console.log('Msg:', msg);

				res.send({ status: status == 0, msg: msg });
			})
			.catch(err => {
				log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', false, err, '/update_data');
				res.send({ status: false, msg: err });
			});
		})
		.catch(err => {
			log.addLog(req.body.username, 'query.delete', '', false, err, '/update_data');
			res.send({ status: false, msg: err });
		});

		// promises = [];
		
		// promises.push(req.body.phonemes.length ? SpeechDB.addMarkup(req.body.username, req.body.record, req.body.phonemes) : null);
		// promises.push(req.body.words.length ? SpeechDB.addWords(req.body.username, req.body.record, req.body.words) : null);
		// promises.push(req.body.sentences.length ? SpeechDB.addSentences(req.body.username, req.body.record, req.body.sentences) : null);

		// console.log("PROMISES: ", promises);

		// Promise.all(promises)
		// .then(results => {
		// 	// console.log("RESULTS:\n", results);
		// 	if (results[0] != null) {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addMarkup', results[0].completed, results[0].output, '/add_data');
		// 		if (results[0].completed == false) {
		// 			status |= 1;
		// 		}
		// 	}
		// 	if (results[1] != null) {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addWords', results[1].completed, results[1].output, '/add_data');
		// 		if (results[1].completed == false) {
		// 			status |= 1 << 1;
		// 		}
		// 	}
		// 	if (results[2] != null) {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', results[2].completed, results[2].output, '/add_data');
		// 		if (results[2].completed == false) {
		// 			status |= 1 << 2;
		// 		}
		// 	}

		// 	// console.log('Status: ' + (status).toString(2));

		// 	log.addLog(req.body.username, 'query.add', 'LOAD RESULT', status == 0, 'Status: ' + (status).toString(2), '/add_data');

		// 	if (status) {
		// 		msg = 'Data was not uploaded: ';
		// 		if (status & 1) { msg += 'phonemes '; }
		// 		if (status & 1 << 1) { msg += 'words '; }
		// 		if (status & 1 << 2) { msg += 'sentences '; }
		// 	} else {
		// 		msg = 'Data was uploaded!';
		// 	}

		// 	// console.log('Msg:', msg);

		// 	res.send({ status: status == 0, msg: msg });
		// })
		// .catch(err => {
		// 	log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', false, err, '/add_data');
		// 	res.send({ status: false, msg: err });
		// });
});

app.post('/add_data', (req, res) => {
		var status = 0;

		let date = new Date();
		let now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
		let path = cfg.phonemes_dir;
		let filename = req.body.username + '_' + req.body.record.split('.').slice(0, -1).join('.') + '_' + now + '.json';
		fs.writeFile(path + filename, JSON.stringify({record: req.body.record, phonemes: req.body.phonemes, words: req.body.words, sentences: req.body.sentences}, null, 2), function(err) {
			result = err == null ? 'Created ' + filename + ' at ' + path : 'File ' + filename + ' was not created';
		    log.addLog('ADMIN', 'access.data', 'extractMarkdowns -> write_json_to_file', err == null, result, '/add_data');
		});

		// console.log("REQ BODY:",
		// 	"\n- phonemes:\n", req.body.phonemes,
		// 	"\n- words:\n", req.body.words,
		// 	"\n- sentences:\n", req.body.sentences
		// 	);

		promises = [];
		
		promises.push(req.body.phonemes.length ? SpeechDB.addMarkup(req.body.username, req.body.record, req.body.phonemes) : null);
		promises.push(req.body.words.length ? SpeechDB.addWords(req.body.username, req.body.record, req.body.words) : null);
		promises.push(req.body.sentences.length ? SpeechDB.addSentences(req.body.username, req.body.record, req.body.sentences) : null);

		// console.log("PROMISES: ", promises);

		Promise.all(promises)
		.then(results => {
			// console.log("RESULTS:\n", results);
			if (results[0] != null) {
				log.addLog(req.body.username, 'query.add', 'SpeechDB.addMarkup', results[0].completed, results[0].output, '/add_data');
				if (results[0].completed == false) {
					status |= 1;
				}
			}
			if (results[1] != null) {
				log.addLog(req.body.username, 'query.add', 'SpeechDB.addWords', results[1].completed, results[1].output, '/add_data');
				if (results[1].completed == false) {
					status |= 1 << 1;
				}
			}
			if (results[2] != null) {
				log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', results[2].completed, results[2].output, '/add_data');
				if (results[2].completed == false) {
					status |= 1 << 2;
				}
			}

			// console.log('Status: ' + (status).toString(2));

			log.addLog(req.body.username, 'query.add', 'LOAD RESULT', status == 0, 'Status: ' + (status).toString(2), '/add_data');

			if (status) {
				msg = 'Data was not uploaded: ';
				if (status & 1) { msg += 'phonemes '; }
				if (status & 1 << 1) { msg += 'words '; }
				if (status & 1 << 2) { msg += 'sentences '; }
			} else {
				msg = 'Data was uploaded!';
			}

			// console.log('Msg:', msg);

			res.send({ status: status == 0, msg: msg });
		})
		.catch(err => {
			log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', false, err, '/add_data');
			res.send({ status: false, msg: err });
		});

		// if (req.body.phonemes.length) {
		// 	SpeechDB.addMarkup(req.body.username, req.body.record, req.body.phonemes)
		// 	.then(result => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addMarkup', result.completed, result.output, '/add_data');
				// if (result.completed == false) {
					// status |= 1;
				// }
		// 	})
		// 	.catch(err => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addMarkup', false, err, '/add_data');
		// 	})
		// }

		// if (req.body.words.length) {
		// 	SpeechDB.addWords(req.body.username, req.body.record, req.body.words)
		// 	.then(result => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addWords', result.completed, result.output, '/add_data');
				// if (result.completed == false) {
				// 	status |= 1 << 1;
				// }
		// 	})
		// 	.catch(err => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addWords', false, err, '/add_data'); 
		// 	})
		// }

		// if (req.body.sentences.length) {
		// 	SpeechDB.addSentences(req.body.username, req.body.record, req.body.sentences)
		// 	.then(result => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', result.completed, result.output, '/add_data');
				// if (result.completed == false) {
				// 	status |= 1 << 2;
				// }
		// 	})
		// 	.catch(err => {
		// 		log.addLog(req.body.username, 'query.add', 'SpeechDB.addSentences', false, err, '/add_data'); 
		// 	})
		// }

		// if (status) {
		// 	msg = 'Data was not uploaded: ';
		// 	if (status & 1) { msg += 'phonemes '; }
		// 	if (status & 1 << 1) { msg += 'words '; }
		// 	if (status & 1 << 2) { msg += 'sentences '; }
		// 	log.addLog(req.body.username, 'query.add', '', false, msg, '/add_data');
		// 	res.send({ status: false, msg: msg });
		// } else {
		// 	log.addLog(req.body.username, 'query.add', 'LOAD RESULT', true, 'Status: ' + status, '/add_data');
		// 	res.send({ status: true, msg: 'Data was uploaded!' });
		// }
});

app.post('/get_data', (req, res) => {
	SpeechDB.getMarkup(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'access.markup', 'getMarkup', result.completed, result.output, '/get_data');
		if (result.completed) {
			res.send(result);
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/get_data_sentences', (req, res) => {
	SpeechDB.getSentenceMarkup(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'access.markup', 'getMarkupSenetnces', result.completed, result.output, '/get_data_sentences');
		if (result.completed) {
			res.send(result);
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/get_data_words', (req, res) => {
	SpeechDB.getWordMarkup(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'access.markup', 'getMarkupWords', result.completed, result.output, '/get_data_words');
		if (result.completed) {
			res.send(result);
		}
		else {
			res.send("Data WAS NOT loaded!");
		}
	});
});

app.post('/remove_person', (req, res) => {
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
		log.addLog(req.body.username, 'query.delete', '', false, err, '/delete_person');
	});
});

app.post('/remove_data', (req, res) => {
	var status = 0;

	/* new part */
	promises = [];

	promises.push(SpeechDB.deleteMarkup(req.body.username, req.body.record));
	promises.push(SpeechDB.deleteWords(req.body.username, req.body.record));
	promises.push(SpeechDB.deleteSentences(req.body.username, req.body.record));

	Promise.all(promises)
	.then(results => {
		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', results[0].completed, results[0].output, '/remove_data');
		if (results[0].completed == false) {
			status |= 1;
		}

		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteWords', results[1].completed, results[1].output, '/remove_data');
		if (results[1].completed == false) {
			status |= 1 << 1;
		}

		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteSentences', results[2].completed, results[2].output, '/remove_data');
		if (results[2].completed == false) {
			status |= 1 << 2;
		}

		if (status) {
			msg = 'Markups of types was not removed: ';
			if (status & 1) { msg += 'phonemes '; }
			if (status & 1 << 1) { msg += 'words '; }
			if (status & 1 << 2) { msg += 'sentences '; }
		} else {
			msg = 'Markups was successfully deleted!';
		}

		log.addLog(req.body.username, 'query.delete', 'DELETE RESULT', true, msg + '!\nStatus: ' + (status).toString(2), '/remove_data');

		res.send({ status: true, msg: msg });
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_data');
		res.send({ status: false, msg: err });
	});
	
	/* end of new part */

	// SpeechDB.deleteMarkup(req.body.username, req.body.record)
	// .then(result => {
		// log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', result.completed, result.output, '/remove_data');
		// if (result.completed == false) {
		// 	status |= 1;
		// }
	// })
	// .catch(err => {
	// 	log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_data');
	// });

	// SpeechDB.deleteWords(req.body.username, req.body.record)
	// .then(result => {
		// log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteWords', result.completed, result.output, '/remove_data');
		// if (result.completed == false) {
		// 	status |= 1 << 1;
		// }
	// })
	// .catch(err => {
	// 	log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_data');
	// });

	// SpeechDB.deleteSentences(req.body.username, req.body.record)
	// .then(result => {
		// log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteSentences', result.completed, result.output, '/remove_data');
		// if (result.completed == false) {
		// 	status |= 1 << 2;
		// }
	// })
	// .catch(err => {
	// 	log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_data');
	// });

	// if (status) {
	// 	msg = 'Data was not removed: ';
	// 	if (status & 1) { msg += 'phonemes '; }
	// 	if (status & 1 << 1) { msg += 'words '; }
	// 	if (status & 1 << 2) { msg += 'sentences '; }
	// 	log.addLog(req.body.username, 'query.delete', '', false, msg, '/remove_data');
	// 	res.send({ status: false, msg: msg });
	// } else {
	// 	res.send({ status: true, msg: 'Markups was successfully deleted!'});
	// }
});

app.post('/remove_markup', (req, res) => {
	SpeechDB.deleteMarkup(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteMarkup', result.completed, result.output, '/remove_markup');
		if (result.completed == false) {
			res.send({ status: false, msg: result.output });
			return;
		}
		res.send({ status: true, msg: 'Markup was successfully deleted!'});
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_markup');
	});
});

app.post('/remove_sentence_markup', (req, res) => {
	SpeechDB.deleteSentences(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteSentences', result.completed, result.output, '/remove_sentences_markup');
		if (result.completed == false) {
			res.send({ status: false, msg: result.output });
			return;
		}
		res.send({ status: true, msg: 'Sentence markup was successfully deleted!'});
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_sentences_markup');
	});
});

app.post('/remove_word_markup', (req, res) => {
	SpeechDB.deleteWords(req.body.username, req.body.record)
	.then(result => {
		log.addLog(req.body.username, 'query.delete', 'SpeechDB.deleteWords', result.completed, result.output, '/remove_words_markup');
		if (result.completed == false) {
			res.send({ status: false, msg: result.output });
			return;
		}
		res.send({ status: true, msg: 'Word markup was successfully deleted!'});
	})
	.catch(err => {
		log.addLog(req.body.username, 'query.delete', '', false, err, '/remove_words_markup');
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
