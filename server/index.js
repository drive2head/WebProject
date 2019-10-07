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

function getDataQuery_text(recname, person, phonemes) {
	let text = `create (rec:Record {description:'${recname}'})\n`+
	`create (person: Person {fullname:'${person.fullName}',\n\t`+
		`nativeLanguage:'${person.nativeLanguage}', accent:${person.accent}})\n`+
	`merge (country: Country {name:'${person.country}'})\n`+
	`merge (city: City {name:'${person.city}'})\n`+
	`create (rec)-[:SPOKEN_BY]->(person)\n`+
	`create (person)-[:LIVES_IN]->(city)\n`+
	`merge (city)-[:LOCATED_IN]->(country)\n\n`

	// для каждого нарушения речи
	if (person.disorders != null) { 
		person.disorders.forEach((disorder, i) => {
			text += `merge (dis${i}: Disorder {name:'${disorder}'})\n`+
					`create (person)-[:HAS]->(dis${i})\n`
		});
	};
	// для каждой фонемы
	phonemes.forEach((phoneme, i) => {
		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:time('${phoneme.start}'),\n\t`+
				`end:time('${phoneme.end}'), language:'${phoneme.language}', dialect:'${phoneme.dialect}'})\n`+
				`create (ph${i})-[:CONTAINED_IN]->(rec)`
	});

	return text;
};

app.post('/add_speaker', (req, res) => {
	let recname = '/testFileName.wav';
	let person1 = new entity.Speaker('Alexandr Testovich', 'RU', 'Moscow', 'Russia', false, ['Д1', 'Д2']);
	let phoneme1 = new entity.Phoneme('a', '00:00:01.234', '00:00:02.345', 'RU', 'None')
	let phoneme2 = new entity.Phoneme('б', '00:00:04.321', '00:00:05.432', 'RU', 'None')
	let queryText = getDataQuery_text(recname, person1, [phoneme1, phoneme2]);
	console.log("Trying to process the query...");
	console.log("\n~ ~ ~ ~ ~ ~ ~")
	console.log(queryText);
	console.log("~ ~ ~ ~ ~ ~ ~\n")
	session.run(queryText)
	.then((result) => {
		res.send("Data was successfully added!");
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
console.log("end");