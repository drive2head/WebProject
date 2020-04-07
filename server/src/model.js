exports.Record = function (recname, tags) {
	return {
		recname: recname,
		tags: tags
	}
}

exports.Person = function (fullname, age, sex, native_lang, city, country, disorders=null) {
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

exports.Word = function(value, start, end) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		return {
			value: value,
			start: start,
			end: end
		}
	};

exports.Sentence = function(value, start, end) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		return {
			value: value,
			start: start,
			end: end
		}
	};