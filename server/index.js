var entity = require("./entity.js")
var user_cfg = require("./user_cfg.js")

const express = require('express');
const app = express();

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic(user_cfg.login, user_cfg.password));
var session = driver.session();

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Port: ${port}`));

/*
match (p:Person {fullname:'Alexandr Testovich'})
match (rec:Record)-[p_rel_rec]-(p)
match (ph:Phoneme)-[ph_rel_rec]-(rec)
match (dis:Disorder)-[dis_rel_p]-(p)
match (p)-[p_rel_city]-(city:City)
delete p, rec, ph, p_rel_rec, ph_rel_rec, dis_rel_p, p_rel_city
*/

/*
MATCH (rec:Record {description:"/Users/demo/Desktop/Coursework Databases/voice1.wav"})
MATCH (ph)-[CONTAINED_IN]-(rec)
MATCH (rec)-[:SPOKEN_BY]-(person)
MATCH (person)-[:LIVES_IN]-(city)-[:LOCATED_IN]-(country)
RETURN rec, person, city, country, 
collect(ph {ph, id: ID(ph)}) as phonemes
*/

function changePersonQuery(person, id) {
	let text = `match (person)\n`+
	`where ID(person) = ${id}\n`+
	`match (person)-[lives_in]-(city0:City)\n`+
	`match (city0)-[located_in]-(country0:Country)\n`+
	`delete lives_in, located_in\n`+
	`merge (city1:City {name: '${person.city}'})\n`+
	`merge (country1:Country {name:'${person.country}'})\n`+
	`merge (person)-[:LIVES_IN]->(city1)\n`+
	`merge (city1)-[:LOCATED_IN]->(country1)\n`+
	`set person = {fullname: '${person.fullName}', nativeLanguage:'${person.nativeLanguage}\n\t',\n\t`+
	`accent:${person.accent}}`

	return text;
};

function changePhonemeQuery(phoneme, id) {
	let text = `match (n)\nwhere ID(n) = ${id}\n`+
			`set n = {notation:'${phoneme.notation}', start:'${phoneme.start}',\n\t`+
			`end:'${phoneme.end}', language:'${phoneme.language}', `+
			`dialect:'${phoneme.dialect}'}`

	return text;
};

function addDataQuery(recname, person, phonemes) {
	console.log(person.fullName);
	let text = `create (rec:Record {description:'${recname}'})\n`+
	`create (person: Person {fullname:'${person.fullName}',\n\t`+
		`nativeLanguage:'${person.nativeLanguage}', accent:'${person.accent}'})\n`+
	`merge (country: Country {name:'${person.country}'})\n`+
	`merge (city: City {name:'${person.city}'})\n`+
	`create (rec)-[:SPOKEN_BY]->(person)\n`+
	`create (person)-[:LIVES_IN]->(city)\n`+
	`merge (city)-[:LOCATED_IN]->(country)\n\n`

	// для каждого нарушения речи
	// if (person.disorders != null) { 
	// 	person.disorders.forEach((disorder, i) => {
	// 		text += `merge (dis${i}: Disorder {name:'${disorder}'})\n`+
	// 				`create (person)-[:HAS]->(dis${i})\n`
	// 	});
	// };
	
	// для каждой фонемы
	phonemes.forEach((phoneme, i) => {
		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:'${phoneme.start}',\n\t`+
				`end:'${phoneme.end}', language:'${phoneme.language}', dialect:'${phoneme.dialect}'})\n`+
				`create (ph${i})-[:CONTAINED_IN]->(rec)`
	});

	return text;
};

app.post('/add_data', (req, res) => {
	let recname = '/testFileName.wav';
	let queryText = addDataQuery(recname, req.body.person, req.body.sounds);

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
	let queryText = changePersonQuery(req.body.person, req.body.id);

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
	let queryText = changePersonQuery(req.body.phoneme, req.body.id);

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