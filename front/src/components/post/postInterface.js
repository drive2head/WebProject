import React from 'react';
import axios from "axios";
import DictorInfo from './dictorInfo.js';
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import Sounds from './sounds.js';

let entity = require("./../../entity.js")

class PostInterface extends React.Component {  
  constructor(props)
  {
    super(props);

    // Functions binding
    this.saveSound = this.saveSound.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.newTimeInterval = this.newTimeInterval.bind(this);

    this.slider = "";

    this.state = {  
      // Sound info
      startTime: 0,
      endTime: 0,
      soundValue: "",
      soundLang: "",
      soundDialect: "",
      selectedOptions: [],
      sounds: [],

      // Dictor info
      dictorName: "",
      dictorLang: "",
      dictorCity: "",
      dictorCountry: "",
      dictorAccent: "",
    };
  }

  saveSound()
  {
    let object = entity.Phoneme(
      this.state.soundValue,
      this.state.startTime,
      this.state.endTime,
      this.state.soundLang,
      this.state.soundDialect,
    );
    let newSounds = this.state.sounds;
    newSounds.push(object);
    this.setState({sounds: newSounds});
    console.log(this.state.sounds);
  }

  saveAll()
  {
    if(this.state.userAuth)
    {
      let person = entity.Speaker(
        this.state.dictorName,
        this.state.dictorLang,
        this.state.dictorCity,
        this.state.dictorCountry,
        this.state.selectedOptions,
      );
      axios.post('/add_data', {
        person: person,
        sounds: this.state.sounds
      });
    }
    else
      this.popUpWindow();
  }

  changeSoundInfo(i)
  {
    let newSounds = this.state.sounds;
    let tmp = newSounds[i];
    newSounds.splice(i, 1);

    this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds});
    
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
      document.dispatchEvent(evt);}
      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
    
  }

  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  changeSelected(selectedOpts){this.setState({selectedOptions: selectedOpts});}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}


  render() {  
    const isLoggedIn = this.props.loggedIn();
    return (
      isLoggedIn ? (
        <div className="container">
          <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark zindex">
            <div className="col-md-12 px-0">
              <WavePlayer
                newTimeInterval={this.newTimeInterval.bind(this)}
                state={this.state}
              />
            </div>
          </div>

          <div className="row mb-2">
            <DictorInfo
              handleInputChange={this.handleInputChange.bind(this)}
              changeSelected={this.changeSelected.bind(this)}
            />
            <SoundInfo
              handleInputChange={this.handleInputChange.bind(this)}
              saveSound={this.saveSound.bind(this)}
              state={this.state}
            />
            <Sounds
              changeSoundInfo={this.changeSoundInfo}
              sounds={this.state.sounds}
            />
          </div>

          <button className="btn btn-dark" id="saveData" onClick={this.saveAll}>Save</button>
        </div>
      ) : (
        <div className="App">
          <a href = "/signin"> Login </a>
        </div>
      )
    );
  }
}

export default PostInterface;