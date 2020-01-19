import React from 'react';
import axios from "axios";
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';

let entity = require("./../../model.js")

class GetInterface extends React.Component {  
  constructor(props)
  {
    super(props);
    this.init();
    // Functions binding
    this.saveSound = this.saveSound.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.newTimeInterval = this.newTimeInterval.bind(this);

    this.slider = "";
    
    this.state = {  
      // Sound info
      record: "",
      startTime: 0,
      endTime: 0,
      soundValue: "",
      soundLang: "",
      soundDialect: "",
      selectedOptions: [],
      sounds: [],
      soundsList: [],
    };
  }

  init = async () => {
	const cookies = new Cookies();
	cookies.getAll();
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
		alert('Bad data, FILOLUX!');
	else
	{
		this.setState({soundDialect: body.output[0].properties.dialect})
		this.setState({soundLang: body.output[0].properties.language})
		let sd = [];
		console.log(body.output);
		for (let i = 0; i < body.output.length; i++)
		{
			sd.push(body.output[i].properties);
			document.getElementById('prevEnd').innerText = body.output[i].properties.end;
		    document.getElementById('prevStart').innerText = body.output[i].properties.start;
			document.getElementById('selPhoneme').innerText = body.output[i].properties.notation;
		    var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
		    document.dispatchEvent(evt);
		}
		document.getElementById('selPhoneme').innerText = '';
		this.setState({sounds: sd});
		this.setState({record: cookies.cookies.record});
	}
  }

  saveSound()
  {
  	console.log(this.state.sounds);
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
	document.getElementById('prevEnd').innerText = this.state.endTime;
	document.getElementById('prevStart').innerText = this.state.startTime;
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
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
  changeNotation(l) {
  	this.setState({soundValue: l})
	//document.getElementById('selPhoneme').innerText = l;
  }
  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}

  render() {  
    document.title = "Новая разметка";
    const cookies = new Cookies();
    cookies.getAll();
    return (
      <div className="container">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
          <WavePlayer
          	record={cookies.cookies.record}
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
            <button className="btn btn-dark" id="saveData" style={{border: "none"}, {width:"100%"}} onClick={this.saveAll}>Сохранить запись</button>
          </div>
        </div>
      </div>
    );
  }
}

export default GetInterface;