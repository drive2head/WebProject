import React from 'react';
import Select from 'react-select';
import '../../App.css';

class DictorInfo extends React.Component {  
	constructor(props)
	{
		super(props);

		this.languages = [
	      {value:"русский", label:"русский"},
	      {value:"английский", label:"английский"},
	      {value:"французский", label:"французский"},
	    ];

		this.options = [
	      {value:"Д1", label:"Д1"},
	      {value:"Д2", label:"Д2"},
	      {value:"Д3", label:"Д3"},
	      {value:"Акцент", label:"Акцент"}
	    ];
	    this.state = {nativeLang: ''};
	}
  
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
			                  	Страна: <input name="dictorCountry" onChange={this.props.handleInputChange} type="text"/><br/>
			                  	Родной язык: <div id="select">
					            	{this.renderSelectLang()}
					            </div>
			                  	Пол: <input name="dictorSex" onChange={this.props.handleInputChange} type="text"/><br/>
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