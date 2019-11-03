let entity = require("./entity.js");

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic(user_cfg.login, user_cfg.password));
let session = driver.session();

exports.addPhonemesRecordPerson = (record, person, phonemes) => {
	let queryText = query.addData(recname, req.body.person, req.body.sounds);

	session.run(queryText)
	.then((result) => {
		res.send("Data was successfully added!");
	})
	.catch((err) => {
		console.log('err', err);
	});
};