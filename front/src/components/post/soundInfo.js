import React from 'react';

class SoundInfo extends React.Component {  
  constructor(props)
  {
    super(props);
  }

  render() {  
    return (
      <div className="col-md-3">
        <div className="card flex-md-row mb-4 box-shadow h-md-250">
          <div className="card-body d-flex flex-column align-items-start">
            <div className="row">
              <div className="col-md-7">
                <p> Описание фонемы: </p>
                Язык: <input name="soundLang" onChange={this.props.handleInputChange} value={this.props.state.soundLang} type="text"/><br/>
                Диалект: <input name="soundDialect" onChange={this.props.handleInputChange} value={this.props.state.soundDialect} type="text"/><br/>
                Значение: <input name="soundValue" onChange={this.props.handleInputChange} value={this.props.state.soundValue} type="text"/><br/>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4">
                <button className="btn btn-dark" name="saveSound" style={{border: "none"}, {height:"100%"}} onClick={this.props.saveSound}>Добавить фонему</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SoundInfo;


