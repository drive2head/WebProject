/**
    * Функция возвращает объект "диктор".
    * @param {string} fullname имя диктора.
    * @param {int} age возраст диктора.
    * @param {string} sex пол диктора.
    * @param {strung} native_lang родной язык диктора.
    * @param {string} city город диктора.
    * @param {string} country страна диктора.
    * @param {list} disorders дефекты речи диктора.
    * @returns {object} объект "диктор".
*/
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
/**
    * Функция добавляет объект "фонема".
    * @param {string} notation значение фонемы.
    * @param {float} start время начала фонемы.
    * @param {float} end время окончания фонемы.
    * @param {string} language язык фонемы.
	* @param {string} dialect диалект фонемы.
    * @returns {object} объект "фонема".
*/
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
/**
    * Функция добавляет объект "слово".
    * @param {string} value значение слова.
    * @param {float} start время начала слова.
    * @param {float} end время окончания фонемы.
    * @returns {object} объект "слово".
*/
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
/**
    * Функция добавляет объект "предложение".
    * @param {string} value значение предложения.
    * @param {float} start время начала предложения.
    * @param {float} end время окончания предложения.
    * @returns {object} объект "предложение".
*/
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