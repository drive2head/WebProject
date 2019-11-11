import React from 'react';
import axios from "axios";
import DictorInfo from './dictorInfo.js';
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import Sounds from './sounds.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';

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
      dictorSex: "",
      dictorAge: "",
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
  }

  saveAll()
  {
    let person = entity.Person(
      this.state.dictorName,
      this.state.dictorAge,
      this.state.dictorSex,
      this.state.dictorLang,
      this.state.dictorCity,
      this.state.dictorCountry,
      this.state.selectedOptions,
    );
<<<<<<< HEAD
    console.log(document.getElementById('file').value);
=======
    let record_path = document.getElementById('file').value.split('\\');
    const recname = record_path[record_path.length - 1];
>>>>>>> c6ca0af3876bd84e52e791e7176c0da6b3f84523
    let record = entity.Record(
      recname,
      {},
    );
    const cookies = new Cookies();
    cookies.getAll();
    axios.post('/add_data', {
      username: cookies.cookies.username,
      person: person,
      record: record,
      sounds: this.state.sounds
    });
    window.alert('SucKcess! Yeeey');
    //window.location.href = "/get";
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
    return (
      <div className="container">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
          <WavePlayer
            newTimeInterval={this.newTimeInterval.bind(this)}
            state={this.state}
          />
          <div className="row">
            <DictorInfo
              handleInputChange={this.handleInputChange.bind(this)}
              changeSelected={this.changeSelected.bind(this)}
              saveAll={this.saveAll.bind(this)}
            />
            <SoundInfo
              handleInputChange={this.handleInputChange.bind(this)}
              saveSound={this.saveSound.bind(this)}
              state={this.state}
            />
            <Sounds
              changeSoundInfo={this.changeSoundInfo.bind(this)}
              sounds={this.state.sounds}
            />
          </div>
          <div className="row">
            <button className="btn btn-dark" id="saveData" style={{border: "none"}, {width:"100%"}} onClick={this.saveAll}>Сохранить запись</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PostInterface;