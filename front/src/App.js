import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

let entity = require("./entity.js")

let isAuth = false;
class Popup extends React.Component {  
  constructor(props)
  {
    super(props);
  }

  logIn = async () => {
    var response = await fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      })
    });
    var body = await response.json();
    if (body == true)
    {
      this.props.userAuth();
      this.props.closePopup();
    }
    else
      alert('wrong data!11!!');
  }

  render() {  
    return (  
      <div className='popup'>  
        <div className='popup_inner'>
          <div className="d-flex justify-content-center h-100">
            <div className="card">
              <div className="card-header">
                <h3 style={{display: 'inline'}}>Sign In</h3>
                <div className="d-flex social_icon">
                  <button type="submit" onClick={this.props.closePopup} className="btn"><span><i className="fa fa-times-circle"></i></span></button>
                </div>
              </div>
              <div className="card-body">
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                  </div>
                  <input id="username" type="text" className="form-control" placeholder="username"/>
                  
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                  </div>
                  <input id="password" type="password" className="form-control" placeholder="password"/>
                </div>
                <div className="form-group">
                  <button onClick={this.logIn} className="btn float-right login_btn">Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>  
    );  
  }  
} 

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleSaveSoundButton = this.handleSaveSoundButton.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);

    this.options = [{value:"Д1", label:"Д1"}, {value:"Д2", label:"Д2"}, {value:"Д3", label:"Д3"}]
    this.startTime = 0;
    this.endTime = 0;
    this.sounds = [];

    this.state = { showPopup: false, userAuth: false };  
  }

  createWavePlayer(url)
  {
    document.getElementById('waveform').innerHTML = '';
    let wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'red',
      progressColor: 'red',
      backend: 'MediaElement',
      plugins: [
        RegionPlugin.create({
          dragSelection: true,
        }),
        Timeline.create({
          primaryLabelInterval: 10,
          timeInterval: 1,
          container: "#timeline"
        })
      ]
    });

    wavesurfer.on('ready', function ()
    {
      document.getElementById('slider').oninput = function()
      {
        let slider = document.getElementById('slider');
        let zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
      };
    });

    document.onkeydown = function (e) {
      let keyCode = e.keyCode;
      if(keyCode == 32) {
        wavesurfer.playPause();
      }
    };

    wavesurfer.on('region-update-end', (region) => {
      document.getElementById('startTime').innerHTML = region.start.toFixed(3);
      document.getElementById('endTime').innerHTML = region.end.toFixed(3);
    });

    wavesurfer.on('region-created', (region) => {
      wavesurfer.clearRegions();
    });

    wavesurfer.on('region-click', function(region, e) {
      e.stopImmediatePropagation();
      region.play();
    });

    wavesurfer.load(url);
  }

  handleSaveSoundButton()
  {
    let object = entity.Phoneme(
      document.getElementById('soundValue').value,
      document.getElementById('startTime').innerHTML,
      document.getElementById('endTime').innerHTML,
      document.getElementById('soundLang').value,
      document.getElementById('soundDialect').value,
    );
    this.sounds.push(object);
  }

  handleChange(e)
  {
    this.createWavePlayer(URL.createObjectURL(e.target.files[0]));
  }

  handleSaveButton()
  {
    if(isAuth)
    {
      let person = entity.Speaker(
        document.getElementById('dictorName').value,
        document.getElementById('dictorLang').value,
        document.getElementById('dictorCity').value,
        document.getElementById('dictorCountry').value,
        document.getElementById('dictorAccent').value,
        document.getElementById('dictorDefect').value,
      );
      axios.post('/add_data', {
        person: person,
        sounds: this.sounds
      });
    }
    else
      this.popUpWindow();
  }

  popUpWindow()
  {
    this.setState({  
      showPopup: !this.state.showPopup,
    });  
  }

  userAuth()
  {
    this.setState({
      userAuth: true
    })
  }

  render()
  {
    return (
      <div className="App">
        <div className="container">
          <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark">
            <div className="col-md-12 px-0">
              <div id="waveform"></div>
              <div id="timeline"></div>
              <input id="slider" type="range" min="1" max="500" defaultValue="1"/>
              <input type="file" id="file" onChange={this.handleChange} />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-md-6">
              <div className="card flex-md-row mb-4 box-shadow h-md-250">
                <div className="card-body d-flex flex-column align-items-start">
                  <p> Описание диктора: </p>
                  Имя: <input id="dictorName" type="text"/><br/>
                  Город: <input id="dictorCity" type="text"/><br/>
                  Страна: <input id="dictorCountry" type="text"/><br/>
                  Родной язык: <input id="dictorLang" type="text"/><br/>
                  Акцент: <input id="accent" type="checkbox"/><br/>
                  Нарушения речи:
                  <div id="select">
                    <Select
                      style={{width: '300px'}}
                      placeholder="Нет"
                      isMulti
                      autoFocus
                      name="Дефекты"
                      options={this.options}
                      closeMenuOnSelect={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card flex-md-row mb-4 box-shadow h-md-250">
                <div className="card-body d-flex flex-column align-items-start">
                  <p> Sound info: </p>
                  <p id="startTime">Start time: </p>
                  <p id="endTime">End time: </p>
                  Lang: <input id="soundLang" type="text"/><br/>
                  Dialect: <input id="soundDialect" type="text"/><br/>
                  Value: <input id="soundValue" type="text"/><br/>
                  <button className="btn btn-dark" id="saveSound" onClick={this.handleSaveSoundButton}>Save sound</button>
                </div>
              </div>
            </div>
          </div>
          <button className="btn btn-dark" id="saveData" onClick={this.handleSaveButton}>Save</button>

          <button className="btn btn-dark" onClick={this.popUpWindow.bind(this)}>Login</button>  

          {this.state.showPopup ?  
          <Popup  
            closePopup={this.popUpWindow.bind(this)}  
            userAuth={this.userAuth.bind(this)}
          /> : null}  
        </div>
      </div>
    );
  }
}

export default App;
