import React from 'react';
import Select from 'react-select';

class Sounds extends React.Component {  
  constructor(props)
  {
    super(props);
    this.state = {value: ''};
  }

  renderSelect()
  {
    return (
      <Select
        autoFocus={false}
        id="sounds"
        name="Фонемы"
        options={this.props.sounds}
        openMenuOnFocus
        closeMenuOnSelect={true}
        value={this.state.value}
        onChange={
          (selectedOpt) => {
            this.props.changeSoundInfo(selectedOpt);
            this.setState({value: selectedOpt.label});
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
            <p>Добавленные фонемы:</p>
            <div id="select" style={{width: '100%'}}>
              {this.renderSelect()}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Sounds;