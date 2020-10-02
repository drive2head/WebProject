var cfg = require('./cfg');

var mongoose = require('mongoose');

var markdownSchema = new mongoose.Schema({
	username: String,
	recordname: String,
	phonemes: [{ _id: Number, start: Number, end: Number, language: String, dialect: String, notation: String }],
	words: [{ _id: Number, start: Number, end: Number, value: String}],
	sentences: [{ _id: Number, start: Number, end: Number, value: String}]
});

async function addMarkdown(markdown) {
	try {
		var connection = mongoose.createConnection(cfg.markdowns_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkdownModel = connection.model('Markdown', markdownSchema);

		var doc = new MarkdownModel(markdown);
		await doc.save();
		return { completed: true, output: "Markdown was sucessfully added!" };
	} catch (err) {
		return { completed: false, output: err.message };
	} finally {
		connection.close();
	}
}

async function updateMarkdown(markdown) {
	try {
		var connection = mongoose.createConnection(cfg.markdowns_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkdownModel = connection.model('Markdown', markdownSchema);

		var result = await MarkdownModel.updateOne(
			{ username: markdown.username, recordname: markdown.recordname }, 
			{ $set: {
				phonemes: markdown.phonemes,
				words: markdown.words,
				sentences: markdown.sentences } 
			})
		if (result.n == 0) {
			throw new Error('No documents were matched');
		}
		return { completed: true, output: "Markdown was sucessfully updated!" };
	} catch (err) {
		return { completed: false, output: err.message };
	} finally {
		connection.close();
	}
}

async function getMarkdown(username, recordname) {
	try {
		var connection = mongoose.createConnection(cfg.markdowns_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkdownModel = connection.model('Markdown', markdownSchema);
		
		var markdown = await MarkdownModel().findOne({ username: username, recordname: recordname });
		return { completed: true, output: markdown };
	} catch (err) {
		return { completed: false, output: err.message };
	} finally {
		connection.close();
	}
}

exports.addMarkdown = addMarkdown;
exports.updateMarkdown = updateMarkdown;
exports.getMarkdown = getMarkdown;