/* 
	Cypher queries for speech database. Each query
	returns nodes which were created, updated or 
	deleted (in this case node with only id is returned).
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
	create (person)-[:LIVES_IN]->(city)
	merge (city)-[:LOCATED_IN]->(country)
	`;

	if (person.disorders != null) { 
		person.disorders.forEach((disorder, i) => {
			text += `merge (dis${i}: Disorder {name:'${disorder}'})
						create (person)-[:HAS]->(dis${i})\n`;
		});
		text += `\n`;
	};

	text += `return person`;

	return notabs(text);
}

exports.addRecord = function (record, person_id) {
	let text = `\
	match (person)
	where ID(person) = ${person_id}
	merge (rec:Record {name:'${record.recname}'})
	create (rec)-[:SPOKEN_BY]->(person)
	return rec`;

	return notabs(text);
}

exports.addMarkup = function (username, record_name, phonemes) {
	let text = `\
	match (record: Record {name: '${record_name}'})
	create (markup: Markup {username: '${username}'})
	create (markup)-[:MARKED_ON]->(record)`;

	let returnPh = `return `;
	phonemes.forEach((phoneme, i) => {
		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:'${phoneme.start}',
					end:'${phoneme.end}', language:'${phoneme.language}', dialect:'${phoneme.dialect}'})
				create (ph${i})-[:CONTAINED_IN]->(markup)`;

		if (i < phonemes.length - 1) {
			returnPh += `ph${i}, `;
		} else {
			returnPh += `ph${i}`;
		}

	});
	text += `\n` + returnPh;

	return notabs(text);
}

exports.getMarkups = function (username) {
	let text = `
	match (markup:Markup {username: '${username}'})
	match (rec:Record)
	match (markup)-[:MARKED_ON]->(rec)
	return rec
	`;

	return notabs(text);
};

exports.getMarkup = function (username, record_name) {
	let text = `
	match (markup:Markup {username: '${username}'})
	match (rec:Record {name: '${record_name}'})
	match (markup)-[:MARKED_ON]->(rec)
	match (ph:Phoneme)-[:CONTAINED_IN]->(markup)
	return ph
	`;

	return notabs(text);
};

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
	return person
	`;

	return notabs(text);
};

exports.changePhoneme = function (phoneme, id) {
	let text = `\
	match (n)\nwhere ID(n) = ${id}
	set n = {notation:'${phoneme.notation}', start:'${phoneme.start}',
		end:'${phoneme.end}', language:'${phoneme.language}', 
		dialect:'${phoneme.dialect}'}
	return n
	`;

	return notabs(text);
}

exports.deletePerson = function (id) {
	let text = `
	match (person: Person)
	where ID(person) = ${id}
	match (person)-[c0:HAS]->()
	match (person)-[c1:LIVES_IN]->()
	delete c0, c1
	delete person
	return person
	`;

	return notabs(text);
}

exports.deleteRecord = function (record_name) {
	let text = `
	match (record: Record {name:'${record_recname}'})
	delete record
	return record
	`;

	return notabs(text);
}

exports.deleteMarkup = function (username, record_name) {
	let text = `
	match (markup: Markup {username: '${username}'})-[c0:MARKED_ON]->(record: Record {name: '${record_name}'})
	match (ph:Phoneme)-[c1:CONTAINED_IN]->(markup)
	delete c1, ph
	delete c0, markup
	return markup
	`;

	return notabs(text);
}

exports.deletePhoneme = function (id) {
	let text =`
	match (phoneme: Phoneme)
	where ID(phoneme) = ${id}
	delete phoneme
	return phoneme
	`;
}

// exports.addRecordPersonPhonemes = function (record, personID, phonemes) {
// 	// let text = `\

// 	// merge (rec:Record {name:'${record.recname}'})
// 	// create (person: Person {fullname:'${person.fullName}', age:'${person.age}', 
// 	// 	sex:'${person.sex}', nativeLanguage:'${person.nativeLanguage}'})
// 	// merge (country: Country {name:'${person.country}'})
// 	// merge (city: City {name:'${person.city}'})
// 	// create (rec)-[:SPOKEN_BY]->(person)
// 	// create (person)-[:LIVES_IN]->(city)
// 	// merge (city)-[:LOCATED_IN]->(country)`;
// 	let text = `\
	
// 	match (person: Person)
// 	where ID(person) = ${personID}
// 	merge (rec:Record {name:'${record.recname}'})`;
// 	// merge (country: Country {name:'${person.country}'})
// 	// merge (city: City {name:'${person.city}'})
// 	// create (rec)-[:SPOKEN_BY]->(person)
// 	// create (person)-[:LIVES_IN]->(city)
// 	// merge (city)-[:LOCATED_IN]->(country)`;
	
// 	let returnPh = ``;
// 	phonemes.forEach((phoneme, i) => {
// 		text += `create (ph${i}: Phoneme {notation:'${phoneme.notation}', start:'${phoneme.start}',
// 					end:'${phoneme.end}', language:'${phoneme.language}', dialect:'${phoneme.dialect}'})
// 				create (ph${i})-[:CONTAINED_IN]->(rec)`;
// 		returnPh += `, ph${i}`;
// 	});
// 	text += `\n return person `+ returnPh;

// 	return notabs(text);
// };
