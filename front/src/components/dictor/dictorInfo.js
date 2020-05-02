import React from 'react';
import Select from 'react-select';
import '../../App.css';

class DictorInfo extends React.Component {  
	constructor(props)
	{
		super(props);

		this.countries = [
			{value:" Абхазия ",label:" Абхазия "},
			{value:" Австралия ",label:" Австралия "},
			{value:" Австрия ",label:" Австрия "},
			{value:" Азербайджан ",label:" Азербайджан "},
			{value:" Албания ",label:" Албания "},
			{value:" Алжир ",label:" Алжир "},
			{value:" Андорра ",label:" Андорра "},
			{value:" Антигуа и Барбуда ",label:" Антигуа и Барбуда "},
			{value:" Аргентина ",label:" Аргентина "},
			{value:" Армения ",label:" Армения "},
			{value:" Афганистан ",label:" Афганистан "},
			{value:" Багамские Острова ",label:" Багамские Острова "},
			{value:" Бангладеш ",label:" Бангладеш "},
			{value:" Барбадос ",label:" Барбадос "},
			{value:" Бахрейн ",label:" Бахрейн "},
			{value:" Беларусь ",label:" Беларусь "},
			{value:" Белиз ",label:" Белиз "},
			{value:" Бельгия ",label:" Бельгия "},
			{value:" Бенин ",label:" Бенин "},
			{value:" Болгария ",label:" Болгария "},
			{value:" Боливия ",label:" Боливия "},
			{value:" Босния и Герцеговина ",label:" Босния и Герцеговина "},
			{value:" Ботсвана ",label:" Ботсвана "},
			{value:" Бразилия ",label:" Бразилия "},
			{value:" Бруней ",label:" Бруней "},
			{value:" Буркина Фасо ",label:" Буркина Фасо "},
			{value:" Бурунди ",label:" Бурунди "},
			{value:" Бутан ",label:" Бутан "},
			{value:" Вануату ",label:" Вануату "},
			{value:" Ватикан ",label:" Ватикан "},
			{value:" Великобритания ",label:" Великобритания "},
			{value:" Венгрия ",label:" Венгрия "},
			{value:" Венесуэла ",label:" Венесуэла "},
			{value:" Восточный Тимоp ",label:" Восточный Тимоp "},
			{value:" Вьетнам ",label:" Вьетнам "},
			{value:" Габон ",label:" Габон "},
			{value:" Гаити ",label:" Гаити "},
			{value:" Гайана ",label:" Гайана "},
			{value:" Гамбия ",label:" Гамбия "},
			{value:" Гана ",label:" Гана "},
			{value:" Гватемала ",label:" Гватемала "},
			{value:" Гвинея ",label:" Гвинея "},
			{value:" Гвинея-Бисау ",label:" Гвинея-Бисау "},
			{value:" Германия ",label:" Германия "},
			{value:" Гондурас ",label:" Гондурас "},
			{value:" Гренада ",label:" Гренада "},
			{value:" Греция ",label:" Греция "},
			{value:" Грузия ",label:" Грузия "},
			{value:" Дания ",label:" Дания "},
			{value:" Демократическая Республика Конго ",label:" Демократическая Республика Конго "},
			{value:" Джибути ",label:" Джибути "},
			{value:" Доминиканская Республика ",label:" Доминиканская Республика "},
			{value:" Доминикана ",label:" Доминикана "},
			{value:" Египет ",label:" Египет "},
			{value:" Замбия ",label:" Замбия "},
			{value:" Зимбабве ",label:" Зимбабве "},
			{value:" Израиль ",label:" Израиль "},
			{value:" Индия ",label:" Индия "},
			{value:" Индонезия ",label:" Индонезия "},
			{value:" Иордания ",label:" Иордания "},
			{value:" Ирак ",label:" Ирак "},
			{value:" Иран ",label:" Иран "},
			{value:" Ирландия ",label:" Ирландия "},
			{value:" Исландия ",label:" Исландия "},
			{value:" Испания ",label:" Испания "},
			{value:" Италия ",label:" Италия "},
			{value:" Йемен ",label:" Йемен "},
			{value:" Кабо-Верде ",label:" Кабо-Верде "},
			{value:" Казахстан ",label:" Казахстан "},
			{value:" Камбоджа ",label:" Камбоджа "},
			{value:" Камерун ",label:" Камерун "},
			{value:" Канада ",label:" Канада "},
			{value:" Катар ",label:" Катар "},
			{value:" Кения ",label:" Кения "},
			{value:" Кипр ",label:" Кипр "},
			{value:" Киргизия ",label:" Киргизия "},
			{value:" Кирибати ",label:" Кирибати "},
			{value:" Китай ",label:" Китай "},
			{value:" Колумбия ",label:" Колумбия "},
			{value:" Коморские острова ",label:" Коморские острова "},
			{value:" КНДР ",label:" КНДР "},
			{value:" Коста-Рика ",label:" Коста-Рика "},
			{value:" Кот-д’Ивуар ",label:" Кот-д’Ивуар "},
			{value:" Куба ",label:" Куба "},
			{value:" Кувейт ",label:" Кувейт "},
			{value:" Лаос ",label:" Лаос "},
			{value:" Латвия ",label:" Латвия "},
			{value:" Лесото ",label:" Лесото "},
			{value:" Либерия ",label:" Либерия "},
			{value:" Ливан ",label:" Ливан "},
			{value:" Ливия ",label:" Ливия "},
			{value:" Литва ",label:" Литва "},
			{value:" Лихтенштейн ",label:" Лихтенштейн "},
			{value:" Люксембург ",label:" Люксембург "},
			{value:" Маврикий ",label:" Маврикий "},
			{value:" Мавритания ",label:" Мавритания "},
			{value:" Мадагаскар ",label:" Мадагаскар "},
			{value:" Македония ",label:" Македония "},
			{value:" Малави ",label:" Малави "},
			{value:" Малайзия ",label:" Малайзия "},
			{value:" Мали ",label:" Мали "},
			{value:" Мальдивы ",label:" Мальдивы "},
			{value:" Мальта ",label:" Мальта "},
			{value:" Марокко ",label:" Марокко "},
			{value:" Маршалловы Острова ",label:" Маршалловы Острова "},
			{value:" Мексика ",label:" Мексика "},
			{value:" Микронезия ",label:" Микронезия "},
			{value:" Мозамбик ",label:" Мозамбик "},
			{value:" Молдова ",label:" Молдова "},
			{value:" Монако ",label:" Монако "},
			{value:" Монголия ",label:" Монголия "},
			{value:" Мьянма ",label:" Мьянма "},
			{value:" Намибия ",label:" Намибия "},
			{value:" Науру ",label:" Науру "},
			{value:" Непал ",label:" Непал "},
			{value:" Нигер ",label:" Нигер "},
			{value:" Нигерия ",label:" Нигерия "},
			{value:" Нидерланды ",label:" Нидерланды "},
			{value:" Никарагуа ",label:" Никарагуа "},
			{value:" Новая Зеландия ",label:" Новая Зеландия "},
			{value:" Норвегия ",label:" Норвегия "},
			{value:" ОАЭ ",label:" ОАЭ "},
			{value:" Оман ",label:" Оман "},
			{value:" Пакистан ",label:" Пакистан "},
			{value:" Палау ",label:" Палау "},
			{value:" Панама ",label:" Панама "},
			{value:" Папуа-Новая Гвинея ",label:" Папуа-Новая Гвинея "},
			{value:" Парагвай ",label:" Парагвай "},
			{value:" Перу ",label:" Перу "},
			{value:" Польша ",label:" Польша "},
			{value:" Португалия ",label:" Португалия "},
			{value:" Республика Конго ",label:" Республика Конго "},
			{value:" Республика Корея ",label:" Республика Корея "},
			{value:" Россия ",label:" Россия "},
			{value:" Руанда ",label:" Руанда "},
			{value:" Румыния ",label:" Румыния "},
			{value:" Сальвадор ",label:" Сальвадор "},
			{value:" Самоа ",label:" Самоа "},
			{value:" Сан-Марино ",label:" Сан-Марино "},
			{value:" Сан-Томе и Принсипи ",label:" Сан-Томе и Принсипи "},
			{value:" Саудовская Аравия ",label:" Саудовская Аравия "},
			{value:" Свазиленд ",label:" Свазиленд "},
			{value:" Северные Марианские острова ",label:" Северные Марианские острова "},
			{value:" Сейшелы ",label:" Сейшелы "},
			{value:" Сенегал ",label:" Сенегал "},
			{value:" Сент-Винсент и Гренадины ",label:" Сент-Винсент и Гренадины "},
			{value:" Сент-Китс и Невис ",label:" Сент-Китс и Невис "},
			{value:" Сент-Люсия ",label:" Сент-Люсия "},
			{value:" Сербия ",label:" Сербия "},
			{value:" Сингапур ",label:" Сингапур "},
			{value:" Сирия ",label:" Сирия "},
			{value:" Словакия ",label:" Словакия "},
			{value:" Словения ",label:" Словения "},
			{value:" Соединённые Штаты Америки ",label:" Соединённые Штаты Америки "},
			{value:" Соломоновы Острова ",label:" Соломоновы Острова "},
			{value:" Сомали ",label:" Сомали "},
			{value:" Судан ",label:" Судан "},
			{value:" Сьерра-Леоне ",label:" Сьерра-Леоне "},
			{value:" Таджикистан ",label:" Таджикистан "},
			{value:" Таиланд ",label:" Таиланд "},
			{value:" Танзания ",label:" Танзания "},
			{value:" Того ",label:" Того "},
			{value:" Тонга ",label:" Тонга "},
			{value:" Тринидад и Тобаго ",label:" Тринидад и Тобаго "},
			{value:" Тувалу ",label:" Тувалу "},
			{value:" Тунис ",label:" Тунис "},
			{value:" Туркмения ",label:" Туркмения "},
			{value:" Турция ",label:" Турция "},
			{value:" Уганда ",label:" Уганда "},
			{value:" Узбекистан ",label:" Узбекистан "},
			{value:" Украина ",label:" Украина "},
			{value:" Уругвай ",label:" Уругвай "},
			{value:" Фиджи ",label:" Фиджи "},
			{value:" Филиппины ",label:" Филиппины "},
			{value:" Финляндия ",label:" Финляндия "},
			{value:" Франция ",label:" Франция "},
			{value:" Хорватия ",label:" Хорватия "},
			{value:" Центральноафриканская Республика ",label:" Центральноафриканская Республика "},
			{value:" Чад ",label:" Чад "},
			{value:" Черногория ",label:" Черногория "},
			{value:" Чехия ",label:" Чехия "},
			{value:" Чили ",label:" Чили "},
			{value:" Швейцария ",label:" Швейцария "},
			{value:" Швеция ",label:" Швеция "},
			{value:" Шри-Ланка ",label:" Шри-Ланка "},
			{value:" Эквадор ",label:" Эквадор "},
			{value:" Экваториальная Гвинея ",label:" Экваториальная Гвинея "},
			{value:" Эритрея ",label:" Эритрея "},
			{value:" Эстония ",label:" Эстония "},
			{value:" Эфиопия ",label:" Эфиопия "},
			{value:" Южно-Африканская Республика ",label:" Южно-Африканская Республика "},
			{value:" Южный Судан ",label:" Южный Судан "},
			{value:" Ямайка ",label:" Ямайка "},
			{value:" Япония ",label:" Япония "},
		];

		this.languages = [
	      	{value:" аварский ",label:" аварский "},
			{value:" адыгейский ",label:" адыгейский "},
			{value:" азербайджанский ",label:" азербайджанский "},
			{value:" аккадский ",label:" аккадский "},
			{value:" албанский ",label:" албанский "},
			{value:" алеутский ",label:" алеутский "},
			{value:" алюторский ",label:" алюторский "},
			{value:" английский ",label:" английский "},
			{value:" арабский ",label:" арабский "},
			{value:" арамейский ",label:" арамейский "},
			{value:" армянский ",label:" армянский "},
			{value:" африкаанс ",label:" африкаанс "},
			{value:" ацтекский ",label:" ацтекский "},
			{value:" баскский ",label:" баскский "},
			{value:" башкирский ",label:" башкирский "},
			{value:" белорусский ",label:" белорусский "},
			{value:" болгарский ",label:" болгарский "},
			{value:" бурский ",label:" бурский "},
			{value:" монгольский ",label:" монгольский "},
			{value:" бухарскоеврейский ",label:" бухарскоеврейский "},
			{value:" венгерский ",label:" венгерский "},
			{value:" венетский ",label:" венетский "},
			{value:" вепсский ",label:" вепсский "},
			{value:" водский ",label:" водский "},
			{value:" вотяцкий ",label:" вотяцкий "},
			{value:" вьетнамский ",label:" вьетнамский "},
			{value:" гиляцкий ",label:" гиляцкий "},
			{value:" голландский ",label:" голландский "},
			{value:" граубюнденский ",label:" граубюнденский "},
			{value:" грузинский ",label:" грузинский "},
			{value:" датский ",label:" датский "},
			{value:" доломитский ",label:" доломитский "},
			{value:" иврит ",label:" иврит "},
			{value:" идиш ",label:" идиш "},
			{value:" енисейско-остяцкий ",label:" енисейско-остяцкий "},
			{value:" игбо ",label:" игбо "},
			{value:" ижорский ",label:" ижорский "},
			{value:" иллирийский ",label:" иллирийский "},
			{value:" ингушский ",label:" ингушский "},
			{value:" индонезийский ",label:" индонезийский "},
			{value:" ирландский ",label:" ирландский "},
			{value:" исландский ",label:" исландский "},
			{value:" испанский ",label:" испанский "},
			{value:" итальянский ",label:" итальянский "},
			{value:" ительменский ",label:" ительменский "},
			{value:" кабардино-черкесский ",label:" кабардино-черкесский "},
			{value:" казахский ",label:" казахский "},
			{value:" калмыцкий ",label:" калмыцкий "},
			{value:" камчадальский ",label:" камчадальский "},
			{value:" карачаево-балкарский ",label:" карачаево-балкарский "},
			{value:" карельский ",label:" карельский "},
			{value:" кашубский ",label:" кашубский "},
			{value:" керекский ",label:" керекский "},
			{value:" кетский ",label:" кетский "},
			{value:" кечуа ",label:" кечуа "},
			{value:" киргизский ",label:" киргизский "},
			{value:" китайский ",label:" китайский "},
			{value:" коми ",label:" коми "},
			{value:" корейский ",label:" корейский "},
			{value:" корякский ",label:" корякский "},
			{value:" крымскотатарский ",label:" крымскотатарский "},
			{value:" кумыкский ",label:" кумыкский "},
			{value:" курвальский ",label:" курвальский "},
			{value:" ладинский ",label:" ладинский "},
			{value:" лакский ",label:" лакский "},
			{value:" латинский ",label:" латинский "},
			{value:" латышский ",label:" латышский "},
			{value:" лезгинский ",label:" лезгинский "},
			{value:" ливский ",label:" ливский "},
			{value:" литовский ",label:" литовский "},
			{value:" луораветланский ",label:" луораветланский "},
			{value:" македонский ",label:" македонский "},
			{value:" малайский ",label:" малайский "},
			{value:" марийские ",label:" марийские "},
			{value:" мегрельский ",label:" мегрельский "},
			{value:" мессапский ",label:" мессапский "},
			{value:" молдавский ",label:" молдавский "},
			{value:" монгольский ",label:" монгольский "},
			{value:" мордовский ",label:" мордовский "},
			{value:" нганасанский ",label:" нганасанский "},
			{value:" немецкий ",label:" немецкий "},
			{value:" ненецкий ",label:" ненецкий "},
			{value:" нивхский ",label:" нивхский "},
			{value:" нидерландский ",label:" нидерландский "},
			{value:" нымыланский ",label:" нымыланский "},
			{value:" оджибва ",label:" оджибва "},
			{value:" ойратский ",label:" ойратский "},
			{value:" олюторский ",label:" олюторский "},
			{value:" осетинский ",label:" осетинский "},
			{value:" персидский ",label:" персидский "},
			{value:" польский ",label:" польский "},
			{value:" португальский ",label:" португальский "},
			{value:" прусский ",label:" прусский "},
			{value:" ретороманские ",label:" ретороманские "},
			{value:" романшский ",label:" романшский "},
			{value:" румынский ",label:" румынский "},
			{value:" русский ",label:" русский "},
			{value:" cелькупский ",label:" cелькупский "},
			{value:" сербский ",label:" сербский "},
			{value:" словацкий ",label:" словацкий "},
			{value:" словенский ",label:" словенский "},
			{value:" словио ",label:" словио "},
			{value:" сымский ",label:" сымский "},
			{value:" татарский ",label:" татарский "},
			{value:" тирольский ",label:" тирольский "},
			{value:" тсалаги ",label:" тсалаги "},
			{value:" турецкий ",label:" турецкий "},
			{value:" угаритский ",label:" угаритский "},
			{value:" удмуртский ",label:" удмуртский "},
			{value:" украинский ",label:" украинский "},
			{value:" унанганский ",label:" унанганский "},
			{value:" фарлинго ",label:" фарлинго "},
			{value:" фарси ",label:" фарси "},
			{value:" финский ",label:" финский "},
			{value:" фламандский ",label:" фламандский "},
			{value:" французский ",label:" французский "},
			{value:" фриульский ",label:" фриульский "},
			{value:" хакасский ",label:" хакасский "},
			{value:" халха-монгольский ",label:" халха-монгольский "},
			{value:" хорватский ",label:" хорватский "},
			{value:" чероки ",label:" чероки "},
			{value:" чеченский ",label:" чеченский "},
			{value:" чешский ",label:" чешский "},
			{value:" чжурчжэньский ",label:" чжурчжэньский "},
			{value:" чукотский ",label:" чукотский "},
			{value:" чувашский ",label:" чувашский "},
			{value:" шведский ",label:" шведский "},
			{value:" швейцарско-ретороманский ",label:" швейцарско-ретороманский "},
			{value:" шумерский ",label:" шумерский "},
			{value:" эдо ",label:" эдо "},
			{value:" энецкий ",label:" энецкий "},
			{value:" эрзянский ",label:" эрзянский "},
			{value:" эскимосский ",label:" эскимосский "},
			{value:" эсперанто ",label:" эсперанто "},
			{value:" эстонский ",label:" эстонский "},
			{value:" югский ",label:" югский "},
			{value:" юкагирский ",label:" юкагирский "},
			{value:" якутский ",label:" якутский "},
			{value:" японский ",label:" японский "},
	    ];

		this.options = [
	      {value:"Д1", label:"Д1"},
	      {value:"Д2", label:"Д2"},
	      {value:"Д3", label:"Д3"},
	      {value:"Акцент", label:"Акцент"}
	    ];
	    this.state = {nativeLang: '', country: ''};
	}
  	/**
	    * Функция рендерит список дефектов речи.
	    * @returns {JSX} объект JSX со списком дефектов речи.
	*/
	renderSelect()
	{
	    return (
			<Select
				id="dictorDisorders"
				style={{width: '150px'}}
				placeholder="Нет"
				isMulti
				autoFocus
				name="Дефекты"
				options={this.options}
				closeMenuOnSelect={false}
				//value={this.selectedOptions}
				onChange={
				  (selectedOpts) => {this.props.changeSelected(selectedOpts)}
				}
			/>
	    );
	}
	/**
	    * Функция рендерит список доступных языков.
	    * @returns {JSX} объект JSX со списком доступных языков.
	*/
	renderSelectLang()
	{
		return (
			<Select
				autoFocus={false}
				style={{width: '100px'}}
				id="language"
				name="Родной язык"
				options={this.languages}
				openMenuOnFocus
				closeMenuOnSelect={true}
				placeholder=""
				value={this.state.nativeLang}
				onChange={
				  (selectedOpt) => {
				    this.setState({nativeLang: selectedOpt});
				    this.props.changeLang(selectedOpt.label);
				  }
				}
			/>
		);
	}
	/**
	    * Функция рендерит список доступных стран.
	    * @returns {JSX} объект JSX со списком доступных стран.
	*/
	renderSelectCountry()
	{
		return (
			<Select
				autoFocus={false}
				style={{width: '100px'}}
				id="country"
				name="Страна"
				options={this.countries}
				openMenuOnFocus
				closeMenuOnSelect={true}
				placeholder=""
				value={this.state.country}
				onChange={
				  (selectedOpt) => {
				    this.setState({country: selectedOpt});
				    this.props.changeCountry(selectedOpt.label);
				  }
				}
			/>
		);
	}

	render() {  
		return (
			<div className="col-md-12">
				<div className="row">
					<div className="col-md-2"></div>
					<div className="col-md-8">
			            <div className="card flex-md-row mb-4 box-shadow h-md-250">
			                <div className="card-body d-flex flex-column align-items-start">
		                  		<p> Описание диктора: </p>
			                  	Псевдоним: <input name="dictorPseudo" onChange={this.props.handleInputChange} type="text"/><br/>
			                  	Имя: <input name="dictorName" onChange={this.props.handleInputChange} type="text"/><br/>
			                  	Город: <input name="dictorCity" onChange={this.props.handleInputChange} type="text"/><br/>
			                  	Страна: <div id="select">
					            	{this.renderSelectCountry()}
					            </div>
			                  	Родной язык: <div id="select">
					            	{this.renderSelectLang()}
					            </div>
			                  	Пол: <div name="dictorSex">
								    <div className="radio">
								    	<label>
								        	<input type="radio" value="ж" name="dictorSex"
								                      onChange={this.props.handleInputChange} />
								        	ж
								      	</label>
								    </div>
								    <div className="radio">
								      	<label>
								        	<input type="radio" value="м" name="dictorSex"
								                      onChange={this.props.handleInputChange} />
								        	м
								      	</label>
								    </div>
								</div>
			                  	Возраст: <input name="dictorAge" onChange={this.props.handleInputChange} type="text"/><br/>
				                Нарушения речи:
			                  	<div id="select">
			                    	{this.renderSelect()}
			                  	</div><br/>
			                  	<br/><button className="btn btn-dark" name="saveDictor" onClick={this.props.saveDictor}>Сохранить</button>
			                </div>
              			</div>
              		</div>
              		<div className="col-md-2"></div>
              	</div>
            </div>
		);
    }
}

export default DictorInfo;