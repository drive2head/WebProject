import React from 'react';
import axios from "axios";
import SoundInfo from '../post/soundInfo.js';
import WavePlayer from '../post/waveplayer.js';
import WavePlayerLetter from '../post/waveplayerletter.js';
import WavePlayerSent from '../post/waveplayersent.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';

let entity = require("./../../model.js")

class GetInterface extends React.Component {  
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
    window.addEventListener('keydown', function(e) {
      if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
  }

  componentDidMount() {
    this.init();
    //this.initWords();
    //this.initSentences();
    //console.log('sents: ', this.state.sents, 'words: ', this.state.words, 'sounds: ', this.state.sounds);
  }

  init = async () => {
  	const cookies = new Cookies();
  	cookies.getAll();
    let f = {};
    f.value = cookies.cookies.record;
    this.refs.wave.init(f);

  	let response = await fetch('/get_data', {
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
  			record: cookies.cookies.record,
  			username: cookies.cookies.username,
  		})
  	});

  	let body = await response.json();
  	if (body == false)
  		alert('Bad data!');
  	else
  	{
      if (body.output != null)
      {
        if (body.output.length > 0) {
          document.getElementById('soundDialect').innerText = body.output[0].properties.dialect;
    		  this.setState({soundDialect: body.output[0].properties.dialect})
    		  this.setState({soundLang: body.output[0].properties.language})
        }
    		let sd = [];
    		//console.log(body.output);

    		for (let i = 0; i < body.output.length; i++)
    		{
    			sd.push(body.output[i].properties);
    			//document.getElementById('prevEnd').innerText = body.output[i].properties.end;
    		  //document.getElementById('prevStart').innerText = body.output[i].properties.start;
    			//document.getElementById('selectPhoneme').innerText = body.output[i].properties.notation;
    		  this.refs.wave.btnLoad(body.output[i].properties.end, body.output[i].properties.start, body.output[i].properties.notation);
    		}

    		//document.getElementById('selectPhoneme').innerText = '';
    		this.setState({sounds: sd});
    		this.setState({record: cookies.cookies.record});
      }
  	}
    this.initWords();
  }

  initWords = async () => {
    const cookies = new Cookies();
    cookies.getAll();
    let f = {};
    f.value = cookies.cookies.record;
    this.refs.waveletter.init(f);

    let response = await fetch('/get_data_words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        record: cookies.cookies.record,
        username: cookies.cookies.username,
      })
    });

    let body = await response.json();
    if (body == false)
      alert('Bad data!');
    else
    {
      let sd = [];
      if (body.output != null)
      {
        for (let i = 0; i < body.output.length; i++)
        {
          sd.push(body.output[i].properties);
          this.refs.waveletter.btnLoad(body.output[i].properties.end, body.output[i].properties.start, body.output[i].properties.value);
        }
      }
      this.setState({letters: sd});
    }
    this.initSentences();
  }

  initSentences = async () => {
    const cookies = new Cookies();
    cookies.getAll();
    let f = {};
    f.value = cookies.cookies.record;
    this.refs.wavesent.init(f);

    let response = await fetch('/get_data_sentences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        record: cookies.cookies.record,
        username: cookies.cookies.username,
      })
    });

    let body = await response.json();
    if (body == false)
      alert('Bad data!');
    else
    {
      let sd = [];
      if (body.output != null)
      {
        for (let i = 0; i < body.output.length; i++)
        {
          sd.push(body.output[i].properties);
          this.refs.wavesent.btnLoad(body.output[i].properties.end, body.output[i].properties.start, body.output[i].properties.value);
        }
      }
      this.setState({sents: sd});
    }
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
    //console.log(object);
    this.refs.wave.btn();
    //this.refs.waveletter.btn();
    //this.setState({soundValue: ''});
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

  removeAll = async () =>
  {
    const cookies = new Cookies();
    cookies.getAll();
    await(axios.post('/remove_data', {
      username: cookies.cookies.username,
      record: this.state.record
    }));
    return true;
  }

  saveAll = async () =>
  {
    await(this.removeAll());
    const cookies = new Cookies();
    cookies.getAll();
    console.log(this.state.sents, this.state.letters, this.state.sounds);
    axios.post('/add_data', {
      username: cookies.cookies.username,
      record: this.state.record,
      phonemes: this.state.sounds,
      words: this.state.letters,
      sentences: this.state.sents
    });
    window.alert('Done!');
    window.location.href = "/";
  }

  // changeSoundInfo(i)
  // {
  //   i = i.id;
  //   let newSounds = this.state.sounds;
  //   let tmp = newSounds[i];
  //   // newSounds.splice(i, 1);
  //   let list = this.state.soundsList;
  //   // list.splice(i, 1);

  //   // for(let i = 0; i < list.length; i++)
  //   //   if (list[i].id != i)
  //   //     list[i].id = i;

  //   this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds, soundsList: list});
  //   setTimeout( () => {
  //     var evt = new KeyboardEvent('keydown', {'keyCode':30, 'which':30});
  //     document.dispatchEvent(evt);}
  //     , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
  // }

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
    //console.log(this.state.soundValue);
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':30, 'which':30});
      document.dispatchEvent(evt);}
      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
  }

  deleteRegion(st, v)
  {
    //console.log(v);
    let i = 0;
    let newSounds = this.state.sounds;
    for (i = 0; i < newSounds.length; i++)
      if (newSounds[i].start == st && newSounds[i].notation == v)
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
  changeNotation(l) {
  	this.setState({soundValue: l})
	//document.getElementById('selPhoneme').innerText = l;
  }
  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  newTimeIntervalLetter(start, end){this.setState({startTimeLetter: start, endTimeLetter: end});}
  newTimeIntervalSent(start, end){this.setState({startTimeSent: start, endTimeSent: end});}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}

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

  slide()
  {
    this.refs.wave.slide();
    this.refs.waveletter.slide();
    this.refs.wavesent.slide();
  }

  render() {  
    document.title = "Новая разметка";
    const cookies = new Cookies();
    cookies.getAll();
    return (
      <div className="container-fluid">
        <Header/>
        <div className="jumbotron bg-dark shadow-lg p-3 mb-5" style={{borderRadius: "25px"}}>
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
              value={this.props.soundLang}
              changeNotation={this.changeNotation.bind(this)}
              changeLang={this.changeLang.bind(this)}
              handleInputChange={this.handleInputChange.bind(this)}
              saveSound={this.saveSound.bind(this)}
              state={this.state}
            />
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <button className="btn btn-magick btn-lg btn3d" id="saveData" style={{border: "none"}, {width:"100%"}} onClick={this.saveAll}><span class="glyphicon glyphicon-tag"></span>Сохранить запись</button>
          </div>
        </div>
      </div>
    );
  }
}

export default GetInterface;