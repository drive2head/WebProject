import React from 'react';
import axios from "axios";
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import WavePlayerLetter from './waveplayerletter.js';
import Sounds from './sounds.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';

let entity = require("./../../model.js")

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
      letterValue: "",
      startTime: 0,
      endTime: 0,
      endTimeLetter: 0,
      startTimeLetter: 0,
      endTimeSent: 0,
      startTimeSent: 0,
      soundValue: "",
      soundLang: "",
      soundDialect: "",
      selectedOptions: [],
      sounds: [],
      letters: [],
      sent: [],
      soundsList: [],
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
    let list = this.state.soundsList;
    list.push({id: list.length, label: this.state.soundValue});
    this.setState({soundsList: list});
    this.setState({soundValue: ''});
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
      document.dispatchEvent(evt);}
      , 100);
  }

  saveLetter()
  {
    let newLetters = this.state.letters;
    newLetters.push({id: document.getElementById('letterValue').value, end: document.getElementById('prevEndLetter').value, start: document.getElementById('prevStartLetter').value});
    this.setState({sounds: newLetters});
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':29, 'which':29});
      document.dispatchEvent(evt);}
      , 100);
  }

  saveAll()
  {
    const cookies = new Cookies();
    cookies.getAll();
    console.log(document.getElementById('files').textContent);
    axios.post('/add_data', {
      username: cookies.cookies.username,
      record: document.getElementById('files').textContent,
      phonemes: this.state.sounds
    });
    window.alert('Done!');
    window.location.href = "/";
  }

  changeSoundInfoWave(st)
  {
    let newSounds = this.state.sounds;
    let tmp = {};

    for (let i = 0; i < newSounds.length; i++)
      if (newSounds[i].start == st)
      {
        tmp = newSounds[i];
        break;
      }
    let list = this.state.soundsList;
    this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds, soundsList: list});
    console.log(this.state.soundValue);
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':30, 'which':30});
      document.dispatchEvent(evt);}
      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
  }

  deleteRegion(st)
  {
    let i = 0;
    let newSounds = this.state.sounds;
    for (i = 0; i < newSounds.length; i++)
      if (newSounds[i].start == st)
        break;
    let tmp = newSounds[i];
    newSounds.splice(i, 1);
    let list = this.state.soundsList;
    list.splice(i, 1);

    for(let i = 0; i < list.length; i++)
      if (list[i].id != i)
        list[i].id = i;

    this.setState({sounds: newSounds, soundsList: list});

  }

  changeLang(l) {this.setState({soundLang: l})}
  changeNotation(l) {this.setState({soundValue: l})}
  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}
  newTimeIntervalLetter(start, end){this.setState({startTimeLetter: start, endTimeLetter: end});}

  render() {  
    document.title = "Новая разметка";
    return (
      <div className="container">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
          <WavePlayer
            newTimeInterval={this.newTimeInterval.bind(this)}
            state={this.state}
            changeSoundInfoWave={this.changeSoundInfoWave.bind(this)}
            soundValue={this.state.soundValue}
            deleteRegion={this.deleteRegion.bind(this)}
          />
          <WavePlayerLetter
            newTimeIntervalLetter={this.newTimeIntervalLetter.bind(this)}
            state={this.state}
          />
          <div className="row">
            <div className="col-md-3"></div>
            <SoundInfo
              changeNotation={this.changeNotation.bind(this)}
              changeLang={this.changeLang.bind(this)}
              handleInputChange={this.handleInputChange.bind(this)}
              saveSound={this.saveSound.bind(this)}
              saveLetter={this.saveLetter.bind(this)}
              state={this.state}
            />
            <div className="col-md-3"></div>
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