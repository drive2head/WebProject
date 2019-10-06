var entity = require("./entity.js")

const express = require('express');
const app = express();

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic("editor", "editor"));
var session = driver.session();

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port: ${port}`));

/*
MATCH (rec:Record {description:"/Users/demo/Desktop/Coursework Databases/voice1.wav"})
MATCH (ph)-[CONTAINED_IN]-(rec)
MATCH (rec)-[:SPOKEN_BY]-(person)
MATCH (person)-[:LIVES_IN]-(city)-[:LOCATED_IN]-(country)
RETURN rec, person, city, country, 
collect(ph {ph, id: ID(ph)}) as phonemes
*/

function getDataQuery_text(recname, person) {
	let text = `create (rec:Record {description:'${recname}'})\n`+
	`create (person: Person {fullname:'${person.fullName}',\n\t`+
		`nativeLanguage:'${person.nativeLanguage}', accent:${person.accent}})\n`+
	`merge (country: Country {name:'${person.country}'})\n`+
	`merge (city: City {name:'${person.city}'})\n`+
	`create (rec)-[:SPOKEN_BY]->(person)\n`+
	`create (person)-[:LIVES_IN]->(city)\n`+
	`merge (city)-[:LOCATED_IN]->(country)\n`

	// для каждого нарушения речи 
	// "merge (dis{n}: Disorder {{name:'{name}'}})\n"+
	// "create (person)-[:HAS]->(dis{n})\n"+

	// для каждой фонемы
	// "create (ph{n}: Phoneme {{notation:'{notation}', start:time('{start}'), end:time('{end}'),\n\t"+
		// "language:'{language}', dialect:'{dialect}'}})\n"+

	// "create (ph{n})-[:CONTAINED_IN]->(rec)"

	// console.log(text);
	return text;
};

app.post('/add_speaker', (req, res) => {
	let recname = '/testFileName.wav';
	let person1 = new entity.Speaker('Alexandr Testovich', 'RU', 'Moscow', 'Russia', false, null);
	let queryText = getDataQuery_text(recname, person1);
	console.log("Trying to process the query...");
	console.log(queryText);
	session.run(queryText)
	.then((result) => {
		res.send("Data was successfully added!");
	})
	.catch((err) => {
		console.log('err', err);
	});
});

app.get('/get_data', (req, res) => {
	// console.log(req.body.recname);
	// res.send("got it!")
	// let description = req.body.recname;
	// console.log(description);
	// let result = session.run(
		// 'MATCH (rec:Record {description:{d}}) ' +
		// 'RETURN rec', {d: description});
	
	// result.then((result) => {
		// result.records.forEach((record) => {
			// console.log(record.keys);
			// let node = record[0];
			// console.log(node)
			// console.log(record.get('rec')['description']);
		// });
	// })
	// .catch(function (error) {
		// console.log(error)
	// });
	res.send("Nothing has happend, prekin'?")
});

session.close();
driver.close();
console.log("end");