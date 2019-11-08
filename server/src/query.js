exports.changePerson = function (person, id) {
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

exports.changePhoneme = function (phoneme, id) {
	let text = `match (n)\nwhere ID(n) = ${id}\n`+
			`set n = {notation:'${phoneme.notation}', start:'${phoneme.start}',\n\t`+
			`end:'${phoneme.end}', language:'${phoneme.language}', `+
			`dialect:'${phoneme.dialect}'}`

	return text;
};

exports.addData = function (record, person, phonemes) {
	console.log(person.fullName);
	let text = `create (rec:Record {description:'${record.name}'})\n`+
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
