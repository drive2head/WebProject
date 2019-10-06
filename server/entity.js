exports.Speaker = function (fullname, native_lang, city, country,
		accent=false, disorders=null) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		this.fullName = fullname;
		this.nativeLanguage = native_lang;
		this.city = city;
		this.country = country;
		this.accent = accent;
		this.disorders = disorders;
	};

exports.Phoneme = function(notation, start, end, lang, dialect=null) {
		/*
			Здесь должна быть проверка значений на ошибки
		*/
		this.notation = notation;
		this.start = start;
		this.end = end;
		this.language = language;
		this.dialect = dialect;
	};