let entity = require("./entity.js"); /* only for debug */
let userAuth = require("./userAuth.js");
let graphDB = require("./graphDB.js");
let log = require("./log.js");

const express = require('express');
const app = express();

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

async function userExist(username, password)
{
	let user = await userAuth.getUser(username);
	if (user === null)
		return false;
	if (user.password !== password)
		return false;
	return user;
}

app.post('/signin', (req, res) => {
    let username = req.body.username,
        password = req.body.password;

    userExist(username, password)
    .then(result => {
    	if (result) {
    		log.addLog(req.body.username, 'access.signin', null, true, JSON.stringify(result), '/signin');
    		res.send(result);
    	}
    	else {
    		log.addLog(req.body.username, 'access.signin', null, true, JSON.stringify(result), '/signin');
    		res.send(false);
    	}
    });
});

app.post('/signup', (req, res) => {
    let username = req.body.username,
        password = req.body.password,
        name = req.body.name,
        surname = req.body.surname;
    // добавить проверку того, что юзер не существует
    userAuth.addUser(username, password, name, surname);
    // log.addLog(req.body.username, 'access.signup', null, true, JSON.stringify(result), '/signup');
    res.send(true);
});

app.post('/person', (req, res) => {
    let username = req.body.username,
        password = req.body.password;
        
    userExist(username, password)
    .then(result => {
    	if (result) {
    		log.addLog(req.body.username, 'accessfo.info', null, true, JSON.stringify(result), '/person');
    		res.send(result);
    	}
    	else {
    		log.addLog(req.body.username, 'info.person', null, false, JSON.stringify(result), '/person');
    		res.send(false);
    	}
    });
});

app.post('/add_data', (req, res) => {
	// убрать record, брать данные из res
	let record = entity.Record('/testFileName.wav', null);
	let result = graphDB.addRecordPersonPhonemes(req.body.username, record, req.body.person, req.body.sounds);
	log.addLog(req.body.username, result.type, result.text, result.completed, result.res, result.output,
				'/add_data', 'graphDB.addRecordPersonPhonemes');
	if (result.completed) {
		res.send("Data was successfully loaded!");
	}
	else {
		res.send("Data WAS NOT loaded!");
	}
});

app.post('/change_person', (req, res) => {
	// let person = entity.Person('James', 'English', 'New York', 'USA');
	let result = graphDB.changePerson(req.body.username, req.body.person, req.body.id);
	log.addLog(req.body.username, result.type, result.text, result.completed, result.res, result.output,
				'/change_person', 'graphDB.changePerson');
	if (result.completed) {
		res.send("Person was successfully changed!");
	}
	else {
		res.send("Person WAS NOT changed!");
	}
});

app.post('/change_phoneme', (req, res) => {
	// let phoneme = entity.Phoneme('a', '0.123', '0.456', 'german');
	let result = graphDB.changePhoneme(req.body.username, req.body.phoneme, req.body.id);
	log.addLog(req.body.username, result.type, result.text, result.completed, result.res, result.output,
				'/change_phoneme', 'graphDB.changePhoneme');
	if (result.completed) {
		res.send("Phoneme was successfully changed!");
	}
	else {
		res.send("Phoneme WAS NOT changed!");
	}
});

// app.get('/get_data', (req, res) => {
	/* smth */
// });
