var cfg = require('./cfg');

var mongoose = require('mongoose');

var markupSchema = new mongoose.Schema({
	username: String,
	recordname: String,
	phonemes: [{ _id: Number, start: Number, end: Number, language: String, dialect: String, notation: String, stress: String }],
	words: [{ _id: Number, start: Number, end: Number, value: String}],
	sentences: [{ _id: Number, start: Number, end: Number, value: String}]
});

async function addMarkup(markup) {
	try {
		var connection = await mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);

		var doc = new MarkupModel(markup);
		await doc.save();
		return { completed: true, output: "Markup was sucessfully added!" };
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
}

async function updateMarkup(markup) {
	try {
		var connection = await mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
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
		return { completed: true, output: markup, msg: 'It is the initial data' };
		// return { completed: true, output: "Markup was sucessfully updated!" };
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
}

async function getMarkup(username, recordname) {
	try {
		var connection = await mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);
		var markup = await MarkupModel.findOne({ username: username, recordname: recordname });
		if (markup == null) {
			return { completed: true, output: markup, msg: 'Markup was not found' };
		} else {
			return { completed: true, output: markup };
		}
	} catch (err) {
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
}

async function getMarkups(username) {
	try {
		console.log("getMarkups!")
		var connection = await mongoose.createConnection(cfg.markups_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		var MarkupModel = connection.model('Markup', markupSchema);
		var markups = await MarkupModel.aggregate([
			{ $match: { username: username } },	
			{ $project: { "name": "$recordname", _id: 0 } }	
			], (err, result) => {
				if (err) {
					console.log("err 88!")
					throw err;
				} else {
					console.log("res 91!")
					return result;
				}
			});

		if (markups.length == 0) {
			console.log("res 97!")
			return { completed: true, output: markups, msg: 'Markups was not found' };
		} else {
			console.log("res 100!")
			return { completed: true, output: markups };
		}
	} catch (err) {
		console.log("err 104!")
		var msg = null;
		if (err.reason.name == 'MongoNetworkError') msg = 'ECONNREFUSED';
		return { completed: false, output: err, msg: msg };
	} finally {
		if (connection !== undefined)
			connection.close();
	}
}

exports.addMarkup = addMarkup;
exports.updateMarkup = updateMarkup;
exports.getMarkup = getMarkup;
exports.getMarkups = getMarkups;