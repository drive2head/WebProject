let query = require("./query.js");
let entity = require("./entity.js");
let userAuth = require("./userAuth.js");
let user_cfg = require("./settings.js");

const express = require('express');
const app = express();

/*
TODO:
1. Вынести запросы и сессии в отдельный модуль
*/

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic(user_cfg.login, user_cfg.password));
let session = driver.session();

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

// let Users = [];
// Users.push({'name':'Videot4pe', 'pass':'tape123'});
// Users.push({'name':'123', 'pass': '123'});

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
	let recname = '/testFileName.wav';
	let queryText = query.addData(recname, req.body.person, req.body.sounds);

	session.run(queryText)
	.then((result) => {
		res.send("Data was successfully added!");
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.post('/change_person', (req, res) => {
	// let person = entity.Person('James', 'English', 'New York', 'USA');
	// let queryText = changePersonQuery(person, 256);
	let queryText = query.changePerson(req.body.person, req.body.id);

	session.run(queryText)
	.then((result) => {
		res.send("Person was successfully changed!");
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.post('/change_phoneme', (req, res) => {
	// let phoneme = entity.Phoneme('a', '0.123', '0.456', 'german');
	// let queryText = changePhonemeQuery(phoneme, 252);
	let queryText = query.changePerson(req.body.phoneme, req.body.id);

	session.run(queryText)
	.then((result) => {
		res.send("Phoneme was successfully changed!");
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.get('/get_data', (req, res) => {
	res.send("Nothing has happend, prekin'?")
});

session.close();
driver.close();