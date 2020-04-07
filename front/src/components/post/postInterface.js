import React from 'react';
import axios from "axios";
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import WavePlayerLetter from './waveplayerletter.js';
import WavePlayerSent from './waveplayersent.js';
import Sounds from './sounds.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';
import Select from 'react-select';

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
      sentValue: "",
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
      sents: [],
      sent: [],
      soundsList: [],
    };
    this.file='';
    this.options = [];
    this.getOptions();
    window.addEventListener('keydown', function(e) {
      if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
  }

  getOptions = async () =>
  {
    var response = await fetch('/records', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let body = await response.json();
    for (let i of body)
      this.options.push({value: i.name, label: i.name})
    console.log(this.options);
  }

  renderSelect()
  {
    return (
      <Select
        autoFocus={false}
        id="files"
        name="Файлы"
        options={this.options}
        openMenuOnFocus
        closeMenuOnSelect={true}
        value={this.state.selectedOption}
        onChange={
          (selectedOpt) => {this.changeSelected(selectedOpt)}
        }
      />
    );
  }

  saveSound()
  {
    this.refs.wave.btn();
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
  }

  saveLetter() // Oh, sorry... a letter, yeah?
  {
    let object = entity.Word(
      document.getElementById('letterValue').value,
      document.getElementById('prevStartLetter').value,
      document.getElementById('prevEndLetter').value
    );
    let newLetters = this.state.letters;
    newLetters.push(object);
    this.setState({letters: newLetters});
  }

  saveSent()
  {
    let object = entity.Sentence(
      document.getElementById('sentValue').value,
      document.getElementById('prevStartSent').value,
      document.getElementById('prevEndSent').value
    );
    let newSents = this.state.sents;
    newSents.push(object);
    this.setState({sents: newSents});
  }

  saveAll()
  {
    const cookies = new Cookies();
    cookies.getAll();
    console.log(this.state.sents, this.state.letters, this.state.sounds);
    console.log(document.getElementById('files').textContent);
    axios.post('/add_data', {
      username: cookies.cookies.username,
      record: document.getElementById('files').textContent,
      phonemes: this.state.sounds,
      words: this.state.letters,
      sentences: this.state.sents
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

  deleteLetter(st)
  {
    let i = 0;
    let newLetters = this.state.letters;
    for (i = 0; i < newLetters.length; i++)
      if (newLetters[i].start == st)
        break;
    let tmp = newLetters[i];
    newLetters.splice(i, 1);

    this.setState({letters: newLetters});
  }

  deleteSent(st)
  {
    let i = 0;
    let newSents = this.state.sents;
    for (i = 0; i < newSents.length; i++)
      if (newSents[i].start == st)
        break;
    let tmp = newSents[i];
    newSents.splice(i, 1);

    this.setState({sents: newSents});
  }

  changeSelected(selectedOpt){
    this.file = selectedOpt;
    this.refs.wave.init(this.file);
    this.refs.waveletter.init(this.file);
    this.refs.wavesent.init(this.file);
  }

  slide()
  {
    this.refs.wave.slide();
    this.refs.waveletter.slide();
    this.refs.wavesent.slide();
  }

  changeLang(l) {this.setState({soundLang: l})}
  changeNotation(l) {this.setState({soundValue: l})}
  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}
  newTimeIntervalLetter(start, end){this.setState({startTimeLetter: start, endTimeLetter: end});}
  newTimeIntervalSent(start, end){this.setState({startTimeSent: start, endTimeSent: end});}

  render() {  
    document.title = "Новая разметка";
    return (
      <div className="container">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
          <div id="select" style={{width: '100%'}}>
            {this.renderSelect()}
          </div>
          <WavePlayerSent
            slide={this.slide.bind(this)}
            ref="wavesent"
            handleInputChange={this.handleInputChange.bind(this)}
            newTimeIntervalSent={this.newTimeIntervalSent.bind(this)}
            deleteSent={this.deleteSent.bind(this)}
            saveSent={this.saveSent.bind(this)}
            state={this.state}
          />
          <WavePlayerLetter
            slide={this.slide.bind(this)}
            ref="waveletter"
            handleInputChange={this.handleInputChange.bind(this)}
            newTimeIntervalLetter={this.newTimeIntervalLetter.bind(this)}
            deleteLetter={this.deleteLetter.bind(this)}
            saveLetter={this.saveLetter.bind(this)}
            state={this.state}
          />
          <WavePlayer
            slide={this.slide.bind(this)}
            ref="wave"
            file={this.file}
            newTimeInterval={this.newTimeInterval.bind(this)}
            state={this.state}
            changeSoundInfoWave={this.changeSoundInfoWave.bind(this)}
            soundValue={this.state.soundValue}
            deleteRegion={this.deleteRegion.bind(this)}
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