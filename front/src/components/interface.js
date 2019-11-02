import React from 'react';

import Popup from './login.js';
import DictorInfo from './dictorInfo.js';
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import Sounds from './sounds.js';

class Interface extends React.Component {  
  constructor(props)
  {
    super(props);
  }

  render() {  
    return (
      <div className="container">
        <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark zindex">
          <div className="col-md-12 px-0">
            <WavePlayer
              newTimeInterval={this.props.newTimeInterval.bind(this)}
              state={this.props.state}
            />
          </div>
        </div>

        <div className="row mb-2">
          <DictorInfo
            handleInputChange={this.props.handleInputChange.bind(this)}
            changeSelected={this.props.changeSelected.bind(this)}
          />
          <SoundInfo
            handleInputChange={this.props.handleInputChange.bind(this)}
            saveSound={this.props.saveSound.bind(this)}
            state={this.props.state}
          />
          <Sounds
            changeSoundInfo={this.props.changeSoundInfo}
            sounds={this.props.state.sounds}
          />
        </div>

        <button className="btn btn-dark" id="saveData" onClick={this.props.saveAll}>Save</button>
      </div>
    );
  }
}

export default Interface;