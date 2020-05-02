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

exports.addSentences = function (username, record_name, sentences) {
	let text = `\
	match (record: Record {name: '${record_name}'})
	create (sMarkup: SentenceMarkup {username: '${username}'})
	create (sMarkup)-[:MARKED_ON]->(record)`;
	let returnSent = `return `;
	sentences.forEach((sentence, i) => {
		text += `create (sent${i}: Sentence {value:'${sentence.value}', start:'${sentence.start}', end:'${sentence.end}'})
				create (sent${i})-[:CONTAINED_IN]->(sMarkup)`;

		if (i < sentences.length - 1) {
			returnSent += `sent${i}, `;
		} else {
			returnSent += `sent${i}`;
		}
	});
	text += `\n` + returnSent;
	return notabs(text);
}

exports.addWords = function (username, record_name, words) {
	let text = `\
	match (record: Record {name: '${record_name}'})
	create (wMarkup: WordMarkup {username: '${username}'})
	create (wMarkup)-[:MARKED_ON]->(record)`;
	let returnWord = `return `;
	words.forEach((word, i) => {
		text += `create (word${i}: Word {value:'${word.value}', start:'${word.start}', end:'${word.end}'})
				create (word${i})-[:CONTAINED_IN]->(wMarkup)`;

		if (i < words.length - 1) {
			returnWord += `word${i}, `;
		} else {
			returnWord += `word${i}`;
		}
	});
	text += `\n` + returnWord;
	return notabs(text);
};

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

exports.getSentenceMarkups = function (username) {
	let text = `
	match (sMarkup:SentenceMarkup {username: '${username}'})
	match (rec:Record)
	match (sMarkup)-[:MARKED_ON]->(rec)
	return rec
	`;

	return notabs(text);
};

exports.getSentenceMarkup = function (username, record_name) {
	let text = `
	match (sMarkup:SentenceMarkup {username: '${username}'})
	match (rec:Record {name: '${record_name}'})
	match (sMarkup)-[:MARKED_ON]->(rec)
	match (sent:Sentence)-[:CONTAINED_IN]->(sMarkup)
	return sent
	`;

	return notabs(text);
};

exports.getWordMarkups = function (username) {
	let text = `
	match (wMarkup:WordMarkup {username: '${username}'})
	match (rec:Record)
	match (wMarkup)-[:MARKED_ON]->(rec)
	return rec
	`;

	return notabs(text);
};

exports.getWordMarkup = function (username, record_name) {
	let text = `
	match (wMarkup:WordMarkup {username: '${username}'})
	match (rec:Record {name: '${record_name}'})
	match (wMarkup)-[:MARKED_ON]->(rec)
	match (word:Word)-[:CONTAINED_IN]->(wMarkup)
	return word
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
	match ()-[c]-(person)
	delete c
	delete person
	return person
	`;

	return notabs(text);
}

exports.deleteRecord = function (record_name) {
	let text = `
	match ()-[c]-(record: Record {name:'${record_name}'})
	delete c
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

exports.deleteSentences = function (username, record_name) {
	let text = `
	match (sMarkup: SentenceMarkup {username: '${username}'})-[c0:MARKED_ON]->(record: Record {name: '${record_name}'})
	match (sent:Sentence)-[c1:CONTAINED_IN]->(sMarkup)
	delete c1, sent
	delete c0, sMarkup
	return sMarkup
	`;

	return notabs(text);
}

exports.deleteWords = function (username, record_name) {
	let text = `
	match (wMarkup: WordMarkup {username: '${username}'})-[c0:MARKED_ON]->(record: Record {name: '${record_name}'})
	match (word:Word)-[c1:CONTAINED_IN]->(wMarkup)
	delete c1, word
	delete c0, wMarkup
	return wMarkup
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
