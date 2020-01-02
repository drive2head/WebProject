import React from 'react';
import Select from 'react-select';

class SoundInfo extends React.Component {  
  constructor(props)
  {
    super(props);

    this.languages = [
      {value:"Русский", label:"Русский"},
      {value:"Английский", label:"Английский"},
      {value:"Французский", label:"Французский"},
    ];
    this.state = {
      soundLang: '',
    };
  }

  renderSelect()
  {
    return (
      <Select
        autoFocus={false}
        id="language"
        name="Язык"
        options={this.languages}
        openMenuOnFocus
        closeMenuOnSelect={true}
        placeholder="Язык: "
        value={this.state.soundLang}
        onChange={
          (selectedOpt) => {
            this.setState({soundLang: selectedOpt});
            this.props.changeLang(selectedOpt.label);
          }
        }
      />
    );
  }

  render() {  
    return (
      <div className="col-md-5">
        <div className="card flex-md-row mb-4 box-shadow h-md-250">
          <div className="card-body d-flex flex-column align-items-start">
            <p> Описание фонемы: </p>
            <div id="select" style={{width: '100%'}}>
              {this.renderSelect()}
            </div>
            Диалект: <input name="soundDialect" onChange={this.props.handleInputChange} value={this.props.state.soundDialect} type="text"/><br/>
            Значение: <input name="soundValue" onChange={this.props.handleInputChange} value={this.props.state.soundValue} type="text"/><br/>
            <p> </p>
            <button className="btn btn-dark" name="saveSound" onClick={this.props.saveSound}>Добавить фонему</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SoundInfo;


