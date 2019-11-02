import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

import Interface from './components/interface.js';
let entity = require("./entity.js")

class App extends React.Component {
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

      // User info
      showPopup: false,
      userAuth: false,
      username: "",
      password: "",
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
      console.log(this.state);
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
  userAuth(uname, pswd){this.setState({userAuth: true, username: uname, password: pswd});}
  changeSelected(selectedOpts){this.setState({selectedOptions: selectedOpts});}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}

  render()
  {
    return (
      <div className="App">
        <Interface 
          saveAll={this.saveAll.bind(this)}
          saveSound={this.saveSound.bind(this)}
          handleInputChange={this.handleInputChange.bind(this)}
          userAuth={this.userAuth.bind(this)}
          changeSelected={this.changeSelected.bind(this)}
          newTimeInterval={this.newTimeInterval.bind(this)}
          changeSoundInfo={this.changeSoundInfo.bind(this)}
          state={this.state}
        />
      </div>
    );
  }
}

export default App;
