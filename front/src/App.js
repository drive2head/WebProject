import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleSaveSoundButton = this.handleSaveSoundButton.bind(this);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.state = {
      play: false
    };
    this.startTime = 0;
    this.endTime = 0;
    this.sounds = [];
  }

  createWavePlayer(url)
  {
    document.getElementById('waveform').innerHTML = '';
    var wavesurfer = WaveSurfer.create({
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
        var slider = document.getElementById('slider');
        var zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
      };
    });

    document.onkeydown = function (e) {
      var keyCode = e.keyCode;
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
    var object = {
      start: document.getElementById('startTime').innerHTML,
      end: document.getElementById('endTime').innerHTML,
      lang: document.getElementById('soundLang').value,
      dialect: document.getElementById('soundDialect').value,
      value: document.getElementById('soundValue').value
    }
    this.sounds.push(object);
  }

  handleChange(e)
  {
    this.createWavePlayer(URL.createObjectURL(e.target.files[0]));
  }

  handleSaveButton()
  {
    var person = {
      name: document.getElementById('dictorName').value,
      city: document.getElementById('dictorName').value,
      country: document.getElementById('dictorName').value,
      lang: document.getElementById('dictorName').value,
      defect: document.getElementById('dictorName').value,
    };
    axios.post('/add_speaker', {
      person: person,
      sounds: this.sounds
    });
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
                  <p> Dictor info: </p>
                  Name: <input id="dictorName" type="text"/><br/>
                  City: <input id="dictorCity" type="text"/><br/>
                  Country: <input id="dictorCountry" type="text"/><br/>
                  Lang: <input id="dictorLang" type="text"/><br/>
                  Defect: <input id="dictorDefect" type="text"/>
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
                  Value: <input id="soundValue" type="text"/>
                  <button id="saveData" onClick={this.handleSaveSoundButton}>Save sound</button>
                </div>
              </div>
            </div>
          </div>
          <button id="saveData" onClick={this.handleSaveButton}>Save</button>
        </div>
      </div>
    );
  }
}

export default App;
