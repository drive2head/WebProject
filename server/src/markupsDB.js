var cfg = require('./cfg');

var mongoose = require('mongoose');

var markupSchema = new mongoose.Schema({
	username: String,
	recordname: String,
	phonemes: [{ _id: Number, start: Number, end: Number, language: String, dialect: String, notation: String }],
	words: [{ _id: Number, start: Number, end: Number, value: String}],
	sentences: [{ _id: Number, start: Number, end: Number, value: String}]
});

async function addMarkup(markup) {
	try {
		var connection = mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);

		var doc = new MarkupModel(markup);
		await doc.save();
		return { completed: true, output: "Markup was sucessfully added!" };
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		connection.close();
	}
}

async function updateMarkup(markup) {
	try {
		var connection = mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);

		var result = await MarkupModel.updateOne(
			{ username: markup.username, recordname: markup.recordname }, 
			{ $set: {
				phonemes: markup.phonemes,
				words: markup.words,
				sentences: markup.sentences } 
			})
		if (result.n == 0) {
			throw new Error('No documents were matched');
		}
		return { completed: true, output: markup, message: "На вход пришли эти данные!" };
		// return { completed: true, output: "Markup was sucessfully updated!" };
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		connection.close();
	}
}

async function getMarkup(username, recordname) {
	try {
		var connection = mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);

		var markup = await MarkupModel.findOne({ username: username });
		return { completed: true, output: markup };
	} catch (err) {
		return { completed: false, output: err };
	} finally {
		connection.close();
	}
}

exports.addMarkup = addMarkup;
exports.updateMarkup = updateMarkup;
exports.getMarkup = getMarkup;