/* 	Cypher queries for speech database.
	Each query returns nodes which were created, updated or deleted.
*/

function notabs(string) {
	return string.replace(/\t*/g, '');
}

exports.addPerson = function (person) {
	let text = `\
	merge (person: Person {fullname:'${person.fullName}', age:'${person.age}', 
		sex:'${person.sex}', nativeLanguage:'${person.nativeLanguage}'})
	merge (country: Country {name:'${person.country}'})
	merge (city: City {name:'${person.city}'})
	create (rec)-[:SPOKEN_BY]->(person)
	create (person)-[:LIVES_IN]->(city)
	merge (city)-[:LOCATED_IN]->(country)
	return person`;

	if (person.disorders != null) { 
		person.disorders.forEach((disorder, i) => {
			text += `merge (dis${i}: Disorder {name:'${disorder}'})
						create (person)-[:HAS]->(dis${i})\n`;
		});
		text += `\n`;
	};

	return notabs(text);
};

exports.addRecord = function (record, person_id) {
	let text = `\
	match (person)
	where ID(person) = ${person_id}
	merge (rec:Record {name:'${record.recname}'})
	return rec`;

	return notabs(text);
}

exports.addPhonemes = function (record_id, phonemes) {
	let text = `\
	match (record)
	where ID(record) = ${record_id}`;

	let returnPh = ``;
	phonemes.forEach((phoneme, i) => {
		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:'${phoneme.start}',
					end:'${phoneme.end}', language:'${phoneme.language}', dialect:'${phoneme.dialect}'})
				create (ph${i})-[:CONTAINED_IN]->(rec)`;
		returnPh += `, ph${i}`;
	});
	text += `\n` + returnPh;

	return notabs(text);
}

exports.changePerson = function (person, id) {
	let text = `\
	match (person)
	where ID(person) = ${id}
	match (person)-[lives_in]-(city0:City)
	match (city0)-[located_in]-(country0:Country)
	delete lives_in, located_in
	merge (city1:City {name: '${person.city}'})
	merge (country1:Country {name:'${person.country}'})
	merge (person)-[:LIVES_IN]->(city1)
	merge (city1)-[:LOCATED_IN]->(country1)
	set person = {fullname: '${person.fullName}', nativeLanguage:'${person.nativeLanguage}'}
	return person`;

	return notabs(text);
};

exports.changePhoneme = function (phoneme, id) {
	let text = `\
	match (n)\nwhere ID(n) = ${id}
	set n = {notation:'${phoneme.notation}', start:'${phoneme.start}',
		end:'${phoneme.end}', language:'${phoneme.language}', 
		dialect:'${phoneme.dialect}'}
	return n`;

	return notabs(text);
};

exports.addRecordPersonPhonemes = function (record, person, phonemes) {
	let text = `\
	merge (rec:Record {name:'${record.recname}'})
	create (person: Person {fullname:'${person.fullName}', age:'${person.age}', 
		sex:'${person.sex}', nativeLanguage:'${person.nativeLanguage}'})
	merge (country: Country {name:'${person.country}'})
	merge (city: City {name:'${person.city}'})
	create (rec)-[:SPOKEN_BY]->(person)
	create (person)-[:LIVES_IN]->(city)
	merge (city)-[:LOCATED_IN]->(country)`;

	if (person.disorders != null) { 
		person.disorders.forEach((disorder, i) => {
			text += `merge (dis${i}: Disorder {name:'${disorder}'})
						create (person)-[:HAS]->(dis${i})\n`;
		});
		text += `\n`;
	};
	
	let returnPh = ``;
	phonemes.forEach((phoneme, i) => {
		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:'${phoneme.start}',
					end:'${phoneme.end}', language:'${phoneme.language}', dialect:'${phoneme.dialect}'})
				create (ph${i})-[:CONTAINED_IN]->(rec)`;
		returnPh += `, ph${i}`;
	});
	text += `\n return person `+ returnPh;

	return notabs(text);
};
