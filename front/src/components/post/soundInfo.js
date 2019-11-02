import React from 'react';

class SoundInfo extends React.Component {  
  constructor(props)
  {
    super(props);
  }

  render() {  
    return (
      <div className="col-md-4">
        <div className="card flex-md-row mb-4 box-shadow h-md-250">
          <div className="card-body d-flex flex-column align-items-start">
            Lang: <input name="soundLang" onChange={this.props.handleInputChange} value={this.props.state.soundLang} type="text"/><br/>
            Dialect: <input name="soundDialect" onChange={this.props.handleInputChange} value={this.props.state.soundDialect} type="text"/><br/>
            Value: <input name="soundValue" onChange={this.props.handleInputChange} value={this.props.state.soundValue} type="text"/><br/>
            <button className="btn btn-dark" name="saveSound" onClick={this.props.saveSound}>Save sound</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SoundInfo;