exports.Record = function (name, tags) {
	return {
		name: name,
		tags: tags
	};
}

exports.Person = function (fullname, age, sex, native_lang, city, country,
		accent=false, disorders=null) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		return {
			fullName: fullname,
			age: age,
			sex: sex,
			nativeLanguage: native_lang,
			city: city,
			country: country,
			accent: accent,
			disorders: disorders
		}
	};

exports.Phoneme = function(notation, start, end, language, dialect=null) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		return {
			notation: notation,
			start: start,
			end: end,
			language: language,
			dialect: dialect
		}
	};