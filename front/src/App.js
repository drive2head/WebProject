import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

var entity = require("./entity.js")

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
    var object = entity.Phoneme(
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
    var person = entity.Speaker(
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
                  <button class="btn btn-dark" id="saveSound" onClick={this.handleSaveSoundButton}>Save sound</button>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-dark" id="saveData" onClick={this.handleSaveButton}>Save</button>
        </div>
      </div>
    );
  }
}

export default App;
