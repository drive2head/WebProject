import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import 'bootstrap/dist/css/bootstrap.css';

// class DictorDescription extends React.Component {
//   constructor(props)
//   {
//     super(props);
//     this.state={
//       ready:false
//     };
//   }

//   render() 
//   {
//     return (
//       <div id="dictor">
//         <div id="mainInfo">
//           <p> Dictor info </p>
//           Name: <input id="dictorName" type="text"/><br/>
//           City: <input id="dictorCity" type="text"/><br/>
//           Country: <input id="dictorCountry" type="text"/><br/>
//           Lang: <input id="dictorLang" type="text"/><br/>
//         </div>
//         <div id="optionalInfo">
//           Defect: <input id="dictorDefect" type="text"/>
//         </div>
//       </div>
//     );
//   }
// }

class AudioVizualization extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.state = {
      play: false
    };
    this.startTime = 0;
    this.endTime = 0;
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

  handleChange(e)
  {
    this.createWavePlayer(URL.createObjectURL(e.target.files[0]));
  }

  render()
  {
    return (
      <div>
        <div id="waveform"></div>
        <div id="timeline"></div>
        <input id="slider" type="range" min="1" max="500" defaultValue="1"/>
        <input type="file" id="file" onChange={this.handleChange} />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.state = {
      play: false
    };
  }

  handleSaveButton()
  {
    return;
  }

  render()
  {
    return (
      <div className="App">
      <div class="container">
        <div class="jumbotron p-3 p-md-5 text-white rounded bg-dark">
          <div class="col-md-12 px-0">
            <AudioVizualization/>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-6">
            <div class="card flex-md-row mb-4 box-shadow h-md-250">
              <div class="card-body d-flex flex-column align-items-start">
                <p> Dictor info: </p>
                Name: <input id="dictorName" type="text"/><br/>
                City: <input id="dictorCity" type="text"/><br/>
                Country: <input id="dictorCountry" type="text"/><br/>
                Lang: <input id="dictorLang" type="text"/><br/>
                Defect: <input id="dictorDefect" type="text"/>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card flex-md-row mb-4 box-shadow h-md-250">
              <div class="card-body d-flex flex-column align-items-start">
                <p> Sound info: </p>
                <p id="startTime">Start time: </p>
                <p id="endTime">End time: </p>
                Lang: <input id="dictorLang" type="text"/><br/>
                Dialect: <input id="dictorLang" type="text"/><br/>
                Value: <input id="dictorLang" type="text"/>
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
