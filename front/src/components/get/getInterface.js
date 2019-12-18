import React from 'react';
import SoundInfo from '../post/soundInfo.js';
import WavePlayer from './waveplayer.js';
import Sounds from '../post/sounds.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';
import axios from "axios";

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
			startTime: 0,
			endTime: 0,
			soundValue: "",
			soundLang: "",
			soundDialect: "",
			selectedOptions: [],
			sounds: [],
			newSounds: [],
			soundsList: [],
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

	handleOpts = async (sound) =>
	{
		const cookies = new Cookies();
    	cookies.getAll();
		let response = await fetch('/get_data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				record: sound,
				username: cookies.cookies.username,
			})
		});

		let body = await response.json();
		let list = [];
		console.log(body);
		this.setState({sounds: body});
		for (let i = 0; i < this.state.sounds; i++)
			list.push({id: i, label: this.state.sounds[i].soundValue});
		this.setState({soundsList: list});
		console.log(this.state.soundsList);
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
	    newSounds = this.state.newSounds;
	    newSounds.push(object);
	    this.setState({newSounds: newSounds});
	    let list = this.state.soundsList;
	    list.push({id: list.length, label: this.state.soundValue});
	    this.setState({soundsList: list});
	    console.log(this.state.soundsList);
  	}



  	saveAll()
  	{
	    // let person = entity.Person(
	    //   this.state.dictorName,
	    //   this.state.dictorAge,
	    //   this.state.dictorSex,
	    //   this.state.dictorLang,
	    //   this.state.dictorCity,
	    //   this.state.dictorCountry,
	    //   this.state.selectedOptions,
	    // );
	    // let record_path = document.getElementById('file').value.split('\\');
	    // const recname = record_path[record_path.length - 1];
	    // let record = entity.Record(
	    //   recname,
	    //   {},
	    // );
	    const cookies = new Cookies();
	    cookies.getAll();
	    console.log(document.getElementById('files').textContent);
	    axios.post('/add_data', {
	      username: cookies.cookies.username,
	      record: document.getElementById('files').textContent,
	      phonemes: this.state.newSounds
	    });
	    window.alert('Done!');
	    //window.location.href = "/get";
  	}

  	changeSoundInfo(i)
  	{
	    i = i.id;
	    let newSounds = this.state.sounds;
	    let tmp = newSounds[i];
	    newSounds.splice(i, 1);
	    let list = this.state.soundsList;
	    list.splice(i, 1);

	    for(let i = 0; i < list.length; i++)
	      if (list[i].id != i)
	        list[i].id = i;

	    this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds, soundsList: list});
	    setTimeout( () => {
	      var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
	      document.dispatchEvent(evt);}
	      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
  	}

  	newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  	handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}

	render()
	{
		document.title = "Просмотр разметок";
	    return (
	      	<div className="container">
	        	<Header/>
	        	<div className="jumbotron" style={{borderRadius: "25px"}}>
	          		<WavePlayer
	            		newTimeInterval={this.newTimeInterval.bind(this)}
	            		handleOpts={this.handleOpts.bind(this)}
	            		state={this.state}
	          		/>
	          		<div className="row">
	            		<div className="col-md-1"></div>
	            		<SoundInfo
				            handleInputChange={this.handleInputChange.bind(this)}
				            saveSound={this.saveSound.bind(this)}
				            state={this.state}
				        />
	            		<Sounds
	              			changeSoundInfo={this.changeSoundInfo.bind(this)}
	              			sounds={this.state.soundsList}
	              			current={this.state.soundValue}
	            		/>
	            		<div className="col-md-1"></div>
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