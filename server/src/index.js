let entity = require("./entity.js"); /* only for debug */
let userAuth = require("./userAuth.js");
let graphDB = require("./graphDB.js");

const express = require('express');
const app = express();

/*
TODO:
1. Вынести запросы и сессии в отдельный модуль
*/

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

async function userExist(username, password)
{
	let user = await userAuth.checkUser(username);
	if (user === null)
		return false;
	if (user.pass !== password)
		return false;
	return true;
}

app.post('/login', (req, res) => {
    let username = req.body.username,
        password = req.body.password;

    userExist(username, password)
    .then(result => {
    	if (result)
    		res.send(true);
    	else
    		res.send(false);
    });
});

app.post('/add_data', (req, res) => {
	let record = entity.Record('/testFileName.wav', null);
	let result = graphDB.addPhonemesRecordPerson(record, req.body.person, req.body.sounds);
	if (result) {
		res.send("Data was successfully loaded!");
	}
	else {
		res.send("Data WAS NOT loaded!");
	}
});

app.post('/change_person', (req, res) => {
	// let person = entity.Person('James', 'English', 'New York', 'USA');
	let result = graphDB.changePerson(req.body.person, req.body.id);
	if (result) {
		res.send("Person was successfully changed!");
	}
	else {
		res.send("Person WAS NOT changed!");
	}
});

app.post('/change_phoneme', (req, res) => {
	// let phoneme = entity.Phoneme('a', '0.123', '0.456', 'german');
	let result = graphDB.changePhoneme(req.body.phoneme, req.body.id);
	if (result) {
		res.send("Phoneme was successfully changed!");
	}
	else {
		res.send("Phoneme WAS NOT changed!");
	}
});

// app.get('/get_data', (req, res) => {
	/* smth */
// });
