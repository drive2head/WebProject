exports.Speaker = function (fullname, native_lang, city, country,
		accent=false, disorders=null) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		return {
			fullName: fullname,
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